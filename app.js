//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let posts = []

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL + '/blogDB');
    console.log('MongoDB database successfully connected');
  } catch(err) {
    console.log('MongoDB database connection error: ' + err);
  }
}

connectToDB();

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", async (req, res) => {
  try {
    const foundPosts = await Post.find({});
    console.log("Retrived posts successfully");
    res.render("home", {homeStartingContent: homeStartingContent, posts: foundPosts});
  } catch (err) {
    console.log("unable to retrive posts" + err);
  }
});

app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent})
})

app.get("/contact", (req, res) => {
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", (req, res) => {
  res.render("compose")
})

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  try {
    await post.save();
    console.log("Post inserted successfully");
  } catch (err) {
    console.log("Unable to insert post, error: ")
  }
  // posts.push(post);

  res.redirect("/");
})

app.get('/posts/:postId', async (req, res) => {
  const requestedId = req.params.postId;
  try {
    const requestedPost = await Post.findById(requestedId);
    console.log("retrived post successfully!");
    res.render("post", {
      title: requestedPost.title,
      content: requestedPost.content,
    })
  } catch (err){
    console.log("unable to retrive post, Error: " + err);
  }
});







const PORT = process.env.PORT;



app.listen(PORT || 3000, function() {
  console.log("Server started on port 3000");
});
