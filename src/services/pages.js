/** @format */
const { validationResult, body, param } = require("express-validator");

const Page = require("../models/Page");

const getPages = async (req, res) => {
  let { url } = req.query;
  const pageURL = url || "";

  const pages = await Page.find();
  //return res.status(200); // TODO: need to make this return a bunch of URLS

  if (pages.length == 0) {
    return res.status(404).json({
      message: `No pages found`,
    });
  }

  //return urls to all pages
  return res.status(200).json({data : pages});
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
  let popularPages = [];

  while (popularPages.length < 10) {
    //populate the array here
  }

  //Do I use '$size'?

  //use db.collection.find()?
  db.collection("pages").find(req.query)
};

const getOnePopularPage = async (req, res) => {

};

const testPostPage = async (req, res) => {
  const page1 = new Page({
    url : "https://hero.fandom.com/wiki/Heroes_Wiki",
    incoming_links : [],
    outgoing_links : ["https://villains.fandom.com/wiki/Main_Page",
      "https://real-life-heroes.fandom.com/wiki/Real_Life_Heroes_Wiki",
      "https://herofanon.fandom.com/wiki/Heroes_Fanon_Wiki",
      "https://near-pure-good-hero.fandom.com/wiki/Near_Pure_Good_Hero_Wiki"],
  })

  const page2 = new Page({
    url : "https://zombieland-saga.fandom.com/wiki/Zombie_Land_Saga_Wiki",
    incoming_links : [],
    outgoing_links : ["https://zombieland-saga.fandom.com/wiki/Zombie_Land_Saga_(series)",
      "https://zombieland-saga.fandom.com/wiki/Characters",
      "https://zombieland-saga.fandom.com/wiki/Zombie_Land_Saga_Soundtrack"],
  })

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
