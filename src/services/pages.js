/** @format */
const { validationResult, body, param } = require("express-validator");

const Page = require("../models/Page");

const getPages = async (req, res) => {
  return res.status(200);
};

const getOnePage = async (req, res) => {
  return res.status(200);
};

const getPopularPages = async (req, res) => {
  return res.status(200);
};

const getOnePopularPage = async (req, res) => {
  return res.status(200);
};

const seedPages = async (req, res) => {
  // for 1 page

  // loop through all links

  // add each links to outgoingList array

  // search each link in Page array and add to its 'incoming' array

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

  return res.status(200);
};
