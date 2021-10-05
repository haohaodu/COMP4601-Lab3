/** @format */

const Page = require("../models/Page");

const getPopularPages = async (req, res) => {
  console.log("getPopularPages is called");

  const popularPages = await Page.aggregate([
    { $unwind: "$incoming_links" },
    { $group: { _id: "$_id", len: { $sum: 1 } } }, //I'm not entirely sure what this does
    { $sort: { len: -1 } },
    { $limit: 10 }, //this is what gets the 10 pages with the most incoming_links
  ]).catch((e) =>
    console.log(`Error when retrieving the most popular pages: ${e}`)
  );

  return res.status(200).json({ message: "Popular pages retrieved", data: popularPages });

  //return res.status(200).json({ message: "Popular pages retrieved", data: [] });
};

const getOnePopularPage = async (req, res) => {
  const { id } = req.params;
  let hasPage = false;

  //use .findOne()?

  //Or should I use .match()?

  //Am I doing this right?

  /*const popularPage = await Page.aggregate([
    { $unwind: "$incoming_links" },
    { $group: { _id: "$_id", len: { $sum: 1 } } }, //I'm not entirely sure what this does
    { $sort: { len: -1 } },
    { $limit: 10 },
    { $match: { _id: id } },
  ]);*/

  const popularPages = await Page.aggregate([
    { $unwind: "$incoming_links" },
    { $group: { _id: "$_id", len: { $sum: 1 } } }, //I'm not entirely sure what this does
    { $sort: { len: -1 } },
    { $limit: 10 },
  ]);

  for (let i = 0; i < popularPages.length; i++) {
    console.log("Popular pages array has page with id of " + popularPages[i]._id);
    if(id == popularPages[i]._id){
      hasPage = true;
    }
  }

  if(hasPage){
    const popularPage = await Page.findById(id).catch((e) =>
      console.log(`Error when retrieving page with id ${id}: ${e}`)
    );

    console.log("Popular page's url is: " + popularPage.url);

    return res.status(200).json({ data: popularPage });
  }else{
    return res.status(404).json({ message: `Page with id ${id} not found` }); 
  }

  //How do I add the error checks?
  //return res.status(200).json({ data: popularPage });
};

module.exports = {
  getPopularPages: getPopularPages,
  getOnePopularPage : getOnePopularPage
};
