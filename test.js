/** @format */

const Page = require("./src/models/Page");
const mg = require("./configs/mongo");
const CreateUrl = async (url) => {
  console.log("1");
  const page = await Page.find({ url: url })
    .then((data) => {
      console.log("page found. ");
      return data;
    })
    .catch((e) => console.log("error finding page: ", e));

  console.log("2");
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
  } else {
    console.log("page found, not creating");
  }
  console.log("3");
  return true;
};
mg.then((data) => console.log("connected to db ")).catch((e) =>
  console.log("error: ", e)
);
CreateUrl("N-0");
