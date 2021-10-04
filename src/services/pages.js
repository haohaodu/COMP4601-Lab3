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
const seedPages = async (req, res) => {
  // for 1 page

  // loop through all links

  // add each links to outgoingList array

  // search each link in Page array and add to it if needed

  console.log("one");
  let popularTally = {};
  console.log("start");

  const findOnePage = async (url) => {
    const page = await Page.find({ url: url })
      .then(({ data }) => {
        console.log("data: ", data);
        return data;
      })
      .catch((e) => {
        console.log("something went wrong finding page with url: ", url);
        console.log("error: ", e);
      });
  };

  const crawl = new Crawler({
    maxConnections: 10, //use this for parallel, rateLimit for individual
    // rateLimit: 10000,

    // This will be called for each crawled page
    callback: (error, res, done) => {
      if (error) {
        console.log(error);
      } else {
        let $ = res.$; //get cheerio data, see cheerio docs for info'cibsike,kig/
        let links = $("a");
        let outgoingList = [];

        // loop through all links in page
        $(links).each((i, link) => {
          let urlNum = $(link).text();
          let url = `https://people.scs.carleton.ca/~davidmckenney/fruitgraph/${urlNum}.html`;
          outgoingList.push(url);

          const page = findOnePage(url);

          if (popularTally.hasOwnProperty(urlNum)) {
            popularTally[urlNum]++;
          } else {
            popularTally[urlNum] = 1;
            // crawl.queue(
            //   `https://people.scs.carleton.ca/~davidmckenney/fruitgraph/${urlVal}.html`
            // );
          }
        });
        console.log("outgoingList: ", outgoingList);
      }
      done();
    },
  });

  crawl.on("drain", () => {
    console.log("popular tally: ", popularTally);
    console.log("Done.");
  });

  await crawl.queue(
    "https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html"
  );

  console.log("returning now...");

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
