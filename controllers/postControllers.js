const sqlite3 = require("better-sqlite3");

exports.createPost = (req, res) => {
  //   if (req.session.is_admin === 1) {
  const { title, category, tags, content } = req.body;
  const DB = new sqlite3("./resumedb.sqlite");
  const createPostStmt = DB.prepare(
    `INSERT INTO posts (title, category, tags, content) VALUES(?,?,?,?);`,
  );
  const newpostId =
    createPostStmt.run(title, category, tags, content).lastInsertRowid;
  const getNewPost = DB.prepare(`SELECT * FROM posts WHERE id = ?;`);
  const newpost = getNewPost.get(newpostId);
  DB.close();

  res.status(200).json(newpost);
  //   } else {
  // res.status(400).json({ message: "You are not authorized to add post." });
  //   }
};

exports.getAllPosts = (req, res) => {
  const DB = new sqlite3("./resumedb.sqlite");

  const getAllPostsStmt = DB.prepare(
    `SELECT * FROM posts ORDER BY posted_date DESC;`,
  );
  const posts = getAllPostsStmt.all();
  if (posts) {
    res.status(200).json(posts);
    DB.close();
  } else {
    res.status(200).json({ message: "There is no post yet." });
    DB.close();
  }
};

exports.getCategoryPosts = (req, res) => {
  const category = req.params.category;
  const DB = new sqlite3("./resumedb.sqlite");
  const getCategoryPostsStmt = DB.prepare(
    `SELECT * FROM posts WHERE category = ? ORDER BY posted_date DESC LIMIT 20;`,
  );
  const catPosts = getCategoryPostsStmt.all(category);
  if (catPosts) {
    DB.close();
    res.status(200).json(catPosts);
  } else {
    DB.close();
    res.status(200).json({ message: "There is no post yet in that category." });
  }
};

exports.getSinglePost = (req, res) => {
  const id = req.params.id;
  const DB = new sqlite3("./resumedb.sqlite");
  const getPostStmt = DB.prepare(`SELECT * from posts WHERE id =?;`);
  const post = getPostStmt.get(id);
  if (post) {
    DB.close();
    res.status(200).json(post);
  } else {
    res.status(200).json({ message: "Post does not exist." });
  }
};

exports.updatePost = (req, res) => {
  if (req.session.is_admin === 1) {
    const id = req.params.id;
    const { title, category, tags, content } = req.body;
    const DB = new sqlite3("./resumedb.sqlite");
    const updatePostStmt = DB.prepare(
      `UPDATE posts SET title =?, category=?, tags=?, content=? WHERE id=?; `,
    );
    updatePostStmt.run(title, category, tags, content, id);
    DB.close;
    res.status(200).json({ message: "Updated the post." });
  } else {
    res.status(400).json(
      { message: "You are not authorized to update posts." },
    );
  }
};

exports.deletePost = (req, res) => {
  //   if (req.session.is_admin === 1) {
  const id = req.params.id;
  const DB = new sqlite3("./resumedb.sqlite");
  const deletePostStmt = DB.prepare(`DELETE FROM posts WHERE id =?;`);
  deletePostStmt.run(id);
  res.status(200).json({ message: "Post successfully deleted" });
  DB.close();
  //   } else {
  // res.status(400).json({ message: "You are not authorized." });
  //   }
};
