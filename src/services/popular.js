/** @format */

const getPopularPages = async (req, res) => {
  return res.status(200).json({ message: "Popular pages retrieved", data: [] });
};

module.exports = {
  getPopularPages: getPopularPages,
};
