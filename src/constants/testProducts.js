/** @format */

let products = {
  1: {
    id: 1,
    name: `doofus`,
    stock: 1,
    price: 15,
    length: 4,
    width: 2,
    height: 1,
    reviews: [
      {
        id: 1,
        rating: 2,
      },
      {
        id: 2,
        rating: 5,
      },
    ],
  },
  2: {
    id: 2,
    name: `scoobey`,
    stock: 0,
    price: 5,
    length: 1,
    width: 1,
    height: 1,
    reviews: [
      {
        id: 3,
        rating: 9,
      },
      {
        id: 4,
        rating: 10,
      },
    ],
  },

  3: {
    id: 3,
    name: `scoobey3`,
    stock: 0,
    price: 5,
    length: 1,
    width: 1,
    height: 1,
    reviews: [],
  },

  4: {
    id: 4,
    name: `scoobey4`,
    stock: 1,
    price: 5,
    length: 1,
    width: 1,
    height: 1,
    reviews: [],
  },
};

module.exports = { products: products };
