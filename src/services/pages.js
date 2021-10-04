/** @format */
const { validationResult, body, param } = require("express-validator");

const Page = require("../models/Page");
const Crawler = require("crawler");

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

  console.log("FINAL LIST: ", await Page.find());
};

let crawledList = [];

const seedPages = async (req, res) => {
  const { seedUrl } = req.query;
  let popularTally = {};

  const crawl = new Crawler({
    maxConnections: 10,
    skipDuplicates: true,
    callback: (error, res, done) => {
      if (error) {
        console.log(error);
      } else {
        let outgoingList = [];
        let $ = res.$;
        let links = $("a");

        // loop through all links on page
        $(links).each((i, link) => {
          let urlNum = $(link).text();
          let url = `https://people.scs.carleton.ca/~davidmckenney/fruitgraph/${urlNum}.html`;

          // append all the outgoing links to a local array
          outgoingList.push(url);

          // add each link to the URLs 'incoming' array
          addIncoming(urlNum, seedUrl);
          // if (!crawledList.includes(url)) {
          //   crawl.queue(url);
          //   crawledList.push(url);
          // }
        });

        // add all to outgoing list array
        console.log("outgoing list: ", outgoingList);
        addOutgoing(seedUrl, outgoingList);
      }
      done();
    },
  });

  crawl.on("drain", () => {
    console.log("\n\nFinished web crawling.\n\n");
  });

  console.log(
    "crawl: ",
    `https://people.scs.carleton.ca/~davidmckenney/fruitgraph/${seedUrl}.html`
  );
  await crawl.queue(
    `https://people.scs.carleton.ca/~davidmckenney/fruitgraph/${seedUrl}.html`
  );

  return res
    .status(200)
    .json({ message: "Popular pages seeded 5", data: popularTally });
};

module.exports = {
  getPages: getPages,
  getOnePage: getOnePage,
  getPopularPages: getPopularPages,
  getOnePopularPage: getOnePopularPage,
  seedPages: seedPages,
};
