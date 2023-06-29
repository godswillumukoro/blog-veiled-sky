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
 * SINGLE
 */
router.get("/single", (req, res) => {
  const locals = {
    title: "How to Make the Best Smoothies to Relieve Constipation",
    description:
      "These fruity, fiber-rich smoothies can get things moving again.",
    date: "July 7, 2021",
  };
  res.render("pages/blogPost", { locals });
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
