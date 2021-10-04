/** @format */

//Required module (install via NPM)
const Crawler = require("crawler");

const crawl = new Crawler({
  maxConnections: 10, //use this for parallel, rateLimit for individual
  rateLimit: 10000,

  // This will be called for each crawled page
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
    } else {
      let $ = res.$; //get cheerio data, see cheerio docs for info'cibsike,kig/
      let links = $("a"); //get all links from page
      $(links).each((i, link) => {
        console.log($(link).text() + ":  " + $(link).attr("href"));
      });
    }
    done();
  },
});

crawl.on("drain", function () {
  console.log("Done.");
});

module.exports = crawl;
