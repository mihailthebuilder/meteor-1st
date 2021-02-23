import "./comment.html";
import "./comment.scss";
import { Meteor } from "meteor/meteor";

Template.comment.onCreated(function commentOnCreated() {
  console.log("comment template created");
});

Template.comment.helpers({
  notUserComment() {
    return this.owner !== Meteor.user()._id;
  },
  calculateVotes() {
    return this.votes.reduce((sum, user) => sum + user.voteValue, 0);
  },
});
