import { Posts } from "../../api/posts.js";
import "./post.html";
import "./post.scss";
import { Meteor } from "meteor/meteor";

import { Template } from "meteor/templating";

Template.post.helpers({
  notUserPost() {
    return this.owner !== Meteor.user()._id;
  },
});

Template.post.events({
  "click .vote"(event) {
    event.preventDefault();

    Meteor.call(
      "posts.vote",
      this._id,
      parseInt(event.target.getAttribute("voteValue"))
    );
  },
});
