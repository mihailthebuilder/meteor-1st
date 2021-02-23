import { Template } from "meteor/templating";
import { Posts } from "../../api/content.js";
import { Meteor } from "meteor/meteor";
import { ReactiveDict } from "meteor/reactive-dict";

import "../post/post.js";
import "./body.html";
import "./body.scss";

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.set("onlyOwnPosts", false);
  Meteor.subscribe("posts");
});

Template.body.helpers({
  posts() {
    const instance = Template.instance();
    const sortMethod = { sort: { createdAt: -1 } };

    if (instance.state.get("onlyOwnPosts")) {
      return Posts.find({ owner: { $eq: Meteor.user()._id } }, sortMethod);
    }
    return Posts.find({}, sortMethod);
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
  "change .own-posts input"(event, instance) {
    instance.state.set("onlyOwnPosts", event.target.checked);
  },
});
