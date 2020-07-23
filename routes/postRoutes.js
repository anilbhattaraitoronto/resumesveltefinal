const router = require("express").Router();
const {
  createPost,
  getAllPosts,
  getCategoryPosts,
  getSinglePost,
  updatePost,
  deletePost,
} = require(
  "../controllers/postControllers",
);

//add categories
router.post("/createpost", createPost);

//get all posts
router.get("/", getAllPosts);
//get category posts
router.get("/:id", getSinglePost);
router.get("/:category", getCategoryPosts);

//get single post

router.post("/update/:id", updatePost);
router.post("/delete/:id", deletePost);

module.exports = router;
