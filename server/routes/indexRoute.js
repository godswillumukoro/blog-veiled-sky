const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/* **
 * GET /
 * HOME
 */
router.get("/", async (req, res) => {
  const locals = {
    title: "How to Make the Best Smoothies to Relieve Constipation",
    description:
      "These fruity, fiber-rich smoothies can get things moving again.",
    date: "July 7, 2021",
  };

  try {
    let perPage = 5;
    let page = req.query.page || 1;
    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    const prevPage = parseInt(page) - 1;
    const hasPrevPage =
      prevPage <= Math.ceil(count / perPage) && prevPage > 0 ? true : false;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    res.render("pages/home", {
      locals,
      data,
      currentPage: page,
      prevPage: hasPrevPage ? prevPage : null,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.error(error);
  }
});

/* **
 * GET /
 * SINGLE POST
 */
router.get("/post/:id", async (req, res) => {
  const locals = {
    title: "How to Make the Best Smoothies to Relieve Constipation",
    description:
      "These fruity, fiber-rich smoothies can get things moving again.",
    date: "July 7, 2021",
  };
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });
    res.render("pages/singlePost", { locals, data });
  } catch (error) {
    console.error(error);
  }
});

/* **
 * POST /
 * SEARCH BAR
 */
router.post("/search", async (req, res) => {
  const locals = {
    title: "Search for a post",
    description: "Search for a post quickly",
  };
  try {
    let perPage = 5;
    let page = req.query.page || 1;
    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    const prevPage = parseInt(page) - 1;
    const hasPrevPage =
      prevPage <= Math.ceil(count / perPage) && prevPage > 0 ? true : false;

    let searchTerm = req.body.searchTerm;
    const removeSpecialCharacters = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    // search through db
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(removeSpecialCharacters, "i") } },
        { body: { $regex: new RegExp(removeSpecialCharacters, "i") } },
      ],
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    res.render("pages/searchResults", {
      locals,
      data,
      currentPage: page,
      prevPage: hasPrevPage ? prevPage : null,
      nextPage: hasNextPage ? nextPage : null,
    });
    // res.render("pages/searchResults", { locals });
  } catch (error) {
    console.error(error);
  }
});

/* **
 * GET /
 * ABOUT
 */
router.get("/about", (req, res) => {
  res.render("pages/about");
});

/* **
 * GET /
 * CONTACT
 */
router.get("/contact", (req, res) => {
  res.render("pages/contact");
});

/* **
 * GET /
 * 404
 */
router.get("*", (req, res) => {
  res.render("pages/404");
});

module.exports = router;
