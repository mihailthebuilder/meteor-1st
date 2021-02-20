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

Template.body.events({
  "submit .new-post"(event) {
    event.preventDefault();

    const currentText = event.target.textarea_post.value;

    Posts.insert({
      text: currentText,
      createdAt: new Date(),
    });
  },
});
