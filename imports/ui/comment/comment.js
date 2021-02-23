import "./comment.html";
import "./comment.scss";
import { Meteor } from "meteor/meteor";

Template.comment.helpers({
  notUserComment() {
    return this.owner !== Meteor.user()._id;
  },
  calculateVotes() {
    return this.votes.reduce((sum, user) => sum + user.voteValue, 0);
  },
});
