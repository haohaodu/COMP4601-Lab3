/** @format */
const { validationResult, body, param } = require("express-validator");

const Page = require("../models/Page");

const getPages = async (req, res) => {

};

const getOnePage = async (req, res) => {

};

const getPopularPages = async (req, res) => {

};

const getOnePopularPage = async (req, res) => {

};

const testPostPage = async (req, res) => {
  const page1 = new Page({
    url : "https://hero.fandom.com/wiki/Heroes_Wiki",
    incoming_links : [],
    outgoing_links : [],
  })

  const page2 = new Page({
    url : "https://zombieland-saga.fandom.com/wiki/Zombie_Land_Saga_Wiki",
    incoming_links : ,
    outgoing_links : ,
  })

  Page.create(page1)
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
