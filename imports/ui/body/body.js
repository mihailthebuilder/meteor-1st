import { Template } from "meteor/templating";
import { Posts } from "../../api/content.js";
import { Meteor } from "meteor/meteor";

import "../post/post.js";
import "./body.html";
import "./body.scss";

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe("posts");
});

Template.body.helpers({
  posts() {
    return Posts.find({}, { sort: { createdAt: -1 } });
  },
});

Template.body.events({
  "submit .new-content"(event) {
    event.preventDefault();

    const currentText = event.target.textarea_content.value;
    const contentType = event.target.getAttribute("content");

    contentRelId = contentType === "comment" ? this._id : null;

    Meteor.call("content.insert", currentText, contentType, contentRelId);

    event.target.textarea_content.value = "";
  },
});
