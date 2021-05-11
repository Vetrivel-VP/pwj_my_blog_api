const PATH = "./data.json";
const fs = require("fs");

class Post {
  get() {
    // Get all the posts
    return this.readData();
  }

  getIndividualBlog(postId) {
    // Get one blog post

    const posts = this.readData();
    const foundPost = posts.find((post) => post.id == postId);
    return foundPost;
  }

  add(newPost) {
    // Add new blog post
    const currentPost = this.readData();
    currentPost.unshift(newPost);
    this.storeData(currentPost);
  }

  readData() {
    //   reads json data from the file
    let rawData = fs.readFileSync(PATH);
    let posts = JSON.parse(rawData);
    return posts;
  }

  storeData(rawData) {
    let data = JSON.stringify(rawData);
    fs.writeFileSync(PATH, data);
  }
}

module.exports = Post;
