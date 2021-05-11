const express = require("express");
const app = express();

const Post = require("./api/models/posts");
const postData = new Post();
// Package use to upload file
var multer = require("multer");

//store the image in the folder with the extension
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${getExten(file.mimetype)}`);
  },
});

// function to get the file extension
const getExten = (mimeType) => {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpeg";
    case "image/png":
      return ".png";
  }
};

// saving our storage
var upload = multer({ storage: storage });

// Informiing NodeJs to parase the JSON data: So that we can use json data however we want
app.use(express.json());
//Middle ware to solve this error : Access-Control-Allow-Origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Middleware to make the uploads for to public
app.use("/uploads", express.static("uploads"));

app.get("/api/posts", (req, res) => {
  res.status(200).send(postData.get());
});

app.get("/api/posts/:post_id", (req, res) => {
  const postId = req.params.post_id;
  const foundPost = postData.getIndividualBlog(postId);
  if (foundPost) {
    res.status(200).send(foundPost);
  } else {
    res.status(404).send("Not Found : Invalid Id");
  }
});

app.post("/api/posts", upload.single("post_image"), (req, res) => {
  // need to replace the file path slash
  let filepath = req.file.path.replace("\\", "/");

  const newPost = {
    id: `${Date.now()}`,
    title: req.body.title,
    content: req.body.content,
    post_image: filepath,
    added_date: `${Date.now()}`,
  };

  postData.add(newPost);

  res.status(201).send(newPost);
});

app.listen(3000, () => console.log("Listening On https://localhost:3000"));
