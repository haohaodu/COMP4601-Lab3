/** @format */
const { validationResult, body, param } = require("express-validator");
const Crawler = require("crawler");

const Page = require("../models/Page");

const BASE_URL = `https://people.scs.carleton.ca/~davidmckenney/fruitgraph`;

const getPages = async (req, res) => {
  //let { url } = req.query;
  //const pageURL = url || "";

  const pages = await Page.find({});
  //return res.status(200); // TODO: need to make this return a bunch of URLS

  /*if (pages.length == 0) {
    return res.status(404).json({
      message: `No pages found`,
    });
  }*/

  //return urls to all pages
  return res.status(200).json({ data: pages });
};

const getOnePage = async (req, res) => {
  const { id } = req.params;
  const page = await Page.findById(id).catch((e) =>
    console.log(`Error when retrieving page with id ${id}: ${e}`)
  );

  if (!page)
    return res.status(404).json({ message: `Product with id ${id} not found` });

  return res.status(200).json({ data: page });
};

const getPopularPages = async (req, res) => {
  //need to query database for getting the most popular pages
  //let popularPages = [];

  /*while (popularPages.length < 10) {
    //populate the array here

    //Helpful link? : https://www.quickprogrammingtips.com/mongodb/how-to-find-the-document-with-the-longest-array-in-a-mongodb-collection.html
  }*/

  //Do I use '$size'?

  //use db.collection.find()?
  const popularPages = db.collection("pages").aggregate([
    { $unwind: "$incoming_links" },
    { $group: { _id: "url", len: { $sum: 1 } } }, //I'm not entirely sure what this does
    { $sort: { len: -1 } },
    { $limit: 10 }, //this is what gets the 10 pages with the most incoming_links
  ]);

  //How do I add the error checks?
  return res.status(200).json({ data: popularPages });
};

const getOnePopularPage = async (req, res) => {
  const { id } = req.params;

  //use .findOne()?

  //Or should I use .match()?

  //Am I doing this right?
  const popularPage = db.collection("pages").aggregate([
    { $unwind: "$incoming_links" },
    { $group: { _id: "url", len: { $sum: 1 } } }, //I'm not entirely sure what this does
    { $sort: { len: -1 } },
    { $limit: 10 },
    { $match: { url: id } },
  ]);

  //How do I add the error checks?
  return res.status(200).json({ data: popularPage });
};

const testPostPage = async (req, res) => {
  const page1 = new Page({
    url: "https://hero.fandom.com/wiki/Heroes_Wiki",
    incoming_links: [],
    outgoing_links: [
      "https://villains.fandom.com/wiki/Main_Page",
      "https://real-life-heroes.fandom.com/wiki/Real_Life_Heroes_Wiki",
      "https://herofanon.fandom.com/wiki/Heroes_Fanon_Wiki",
      "https://near-pure-good-hero.fandom.com/wiki/Near_Pure_Good_Hero_Wiki",
    ],
  });

  const page2 = new Page({
    url: "https://zombieland-saga.fandom.com/wiki/Zombie_Land_Saga_Wiki",
    incoming_links: [],
    outgoing_links: [
      "https://zombieland-saga.fandom.com/wiki/Zombie_Land_Saga_(series)",
      "https://zombieland-saga.fandom.com/wiki/Characters",
      "https://zombieland-saga.fandom.com/wiki/Zombie_Land_Saga_Soundtrack",
    ],
  });

  //How do I post a url? (href element?) (Nvm about this)

  Page.create(page1) //this adds new page to database
    .then((data) => {
      return res
        .status(201)
        .json({ message: "Page 1 successfully created", data: data });
    })
    .catch((err) => {
      return res.status(409).json({
        message: "Error while creating page 1",
        err: err,
      });
    });

  Page.create(page2)
    .then((data) => {
      return res
        .status(201)
        .json({ message: "Page 2 successfully created", data: data });
    })
    .catch((err) => {
      return res.status(409).json({
        message: "Error while creating page 2",
        err: err,
      });
    });
};

const createPage = async (url) => {
  const page = await Page.find({ url: url })
    .then((data) => {
      return data;
    })
    .catch((e) => console.log("error finding page: ", e));

  // if page not found, create page in DB
  if (!page || page.length === 0) {
    console.log("creating pages...");
    await Page.create({
      url: url,
      incoming_links: [],
      outgoing_links: [],
    })
      .then(() => {
        console.log(`page ${url} has been created`);
      })
      .catch((e) => console.log("e ", e));
  }
};

let pageGraph = {};

const seedHelper = async (baseUrl) =>
  new Promise((resolve, reject) => {
    const crawl = new Crawler({
      maxConnections: 10,
      skipDuplicates: true,
      callback: (error, res, done) => {
        if (error) {
          reject(error);
        } else {
          let $ = res.$;
          const title = $("title").text();
          let urlList = [];

          // add all links on page to local url list
          $("a").each((i, link) => {
            let urlPath = $(link).text();
            let fullLinkUrl = `${BASE_URL}/${urlPath}.html`;
            urlList.push(fullLinkUrl);
          });
          let fullUrl = `${BASE_URL}/${title}.html`;

          console.log(`status ${Object.keys(pageGraph).length}/1000`);
          if (Object.keys(pageGraph).length >= 1000) {
            console.log("DONE");
            return resolve(pageGraph);
          }

          // add OUTGOING links to curr page url
          if (pageGraph.hasOwnProperty(fullUrl))
            pageGraph[fullUrl].outgoing_links = urlList;
          // create new page if it does not exist
          else {
            const newPage = {
              url: fullUrl,
              incoming_links: [],
              outgoing_links: urlList,
            };
            pageGraph[fullUrl] = newPage;
          }

          // loop through url list
          urlList.map((link) => {
            // add curr url as INCOMING link for each url
            if (pageGraph.hasOwnProperty(link)) {
              pageGraph[link].incoming_links.push(fullUrl);
            } else {
              const newIncomingPage = {
                url: link,
                incoming_links: [fullUrl],
                outgoing_links: [],
              };
              pageGraph[link] = newIncomingPage;
            }

            // re-crawl all the other urls that come up
            crawl.queue(link);
          });
        }
        done();
      },
    });
    crawl.queue(baseUrl);
  });

const seedPages = async (req, res) => {
  console.log("start crawling...");
  const baseUrl =
    "https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html";
  const pages = [];
  return await seedHelper(baseUrl)
    .then(async (localData) => {
      // loop through local page graph object and put it into list
      Object.values(localData).map((page) => {
        pages.push(page);
      });
      // upload local copy to DB
      await Page.insertMany(pages)
        .then(() => {
          console.log("seed complete");
        })
        .catch((e) => console.log("error while inserting", e));
      return res.status(200).json({
        message: "DB succesfully seeded",
        data: localData,
      });
    })
    .catch((e) =>
      res.status(500).json({
        message: "Error while seeding db",
        data: e,
      })
    );
};

module.exports = {
  getPages: getPages,
  getOnePage : getOnePage,
  testPostPage: testPostPage,
  seedPages: seedPages,
};
