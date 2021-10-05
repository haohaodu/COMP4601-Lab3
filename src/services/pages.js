/** @format */
const { validationResult, body, param } = require("express-validator");

const Page = require("../models/Page");
const Crawler = require("crawler");

const BASE_URL = `https://people.scs.carleton.ca/~davidmckenney/fruitgraph`;

const getPages = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Popular pages retrieved 1", data: [] });
};

const getOnePage = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Popular pages retrieved 2", data: [] });
};

const getPopularPages = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Popular pages retrieved 3 ", data: [] });
};

const getOnePopularPage = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Popular pages retrieved 4", data: [] });
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

const addIncoming = async (url, incomingUrl) => {
  // createPage if does not exist in DB yet
  const page = await Page.find({ url: url })
    .then((data) => {
      return data;
    })
    .catch((e) => console.log("error finding page: ", e));

  // if page not found, create page in DB
  if (!page || page.length === 0) {
    await Page.create({
      url: url,
      incoming_links: [],
      outgoing_links: [],
    }).catch((e) => console.log("e ", e));
  }

  await Page.findOneAndUpdate(
    { url: url },
    { $push: { incoming_links: incomingUrl } }
  ).catch((e) => {
    console.log("something went wrong finding page with url: ", url);
    console.log("error: ", e);
  });
};

const addOutgoing = async (url, outgoingUrls) => {
  // createPage if does not exist in DB yet
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

  // update page's outgoing list with all past in URLs
  await Page.findOneAndUpdate(
    { url: url },
    {
      $push: {
        outgoing_links: outgoingUrls,
      },
    }
  ).catch((e) => {
    console.log("something went wrong finding page with url: ", url);
    console.log("error: ", e);
  });
};

let crawlUrl = "";
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

          console.log(`progress ${Object.keys(pageGraph).length}/600`);
          if (Object.keys(pageGraph).length >= 600) {
            console.log("DONE");
            return resolve(pageGraph);
          }

          // add all outgoing links to curr page if exists
          if (pageGraph.hasOwnProperty(fullUrl))
            pageGraph[fullUrl].outgoing_links = urlList;
          // create new page if url does not currently exist
          else {
            const newPage = {
              url: fullUrl,
              incoming_links: [],
              outgoing_links: urlList,
            };
            pageGraph[fullUrl] = newPage;
          }

          // loop through url list, and add curr page as incoming link for all urls
          urlList.map((link) => {
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
  return await seedHelper(baseUrl)
    .then((localData) => {
      console.log("finished crawling: ", localData);
      return res.status(200).json({
        message: "Popular pages seeded 5 succesfully",
        data: localData,
      });
    })
    .catch((e) => console.log("error crawling: ", e));
};

module.exports = {
  getPages: getPages,
  getOnePage: getOnePage,
  getPopularPages: getPopularPages,
  getOnePopularPage: getOnePopularPage,
  seedPages: seedPages,
};
