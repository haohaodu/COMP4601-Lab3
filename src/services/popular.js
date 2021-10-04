/** @format */

const Crawler = require("crawler");

const getPopularPages = async (req, res) => {
  return res.status(200).json({ message: "Popular pages retrieved", data: [] });
};

const seedPopularPages = async (req, res) => {
  let popularTally = {};
  console.log("start");

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
    .json({ message: "Popular pages seeded", data: popularTally });
};

module.exports = {
  getPopularPages: getPopularPages,
  seedPopularPages: seedPopularPages,
};
