import { Template } from "meteor/templating";
import { Posts } from "../../api/posts.js";
import "../post/post.js";
import "./body.html";
import "./body.scss";

Template.body.helpers({
  posts() {
    return Posts.find({}, { sort: { createdAt: -1 } });
  },
});
