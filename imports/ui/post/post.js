import "./post.html";
import "./post.scss";
import "../comment/comment.js";
import { Meteor } from "meteor/meteor";
import { Comments } from "../../api/content.js";
import { Template } from "meteor/templating";

Template.post.onCreated(function commentOnCreated() {
  Meteor.subscribe("comments");
});

Template.post.helpers({
  comments() {
    return Comments.find({ post: this._id }, { sort: { createdAt: -1 } });
  },

  notUserPost() {
    return this.owner !== Meteor.user()._id;
  },
  calculateVotes() {
    return this.votes.reduce((sum, user) => sum + user.voteValue, 0);
  },
});

Template.post.events({
  "click .vote"(event) {
    event.preventDefault();

    const voteValue = parseInt(event.target.getAttribute("voteValue"));

    const contentType = this.hasOwnProperty("post") ? "comment" : "post";

    const userPreviousVoteIndex = this.votes.findIndex(
      (user) => user.userId === Meteor.user()._id
    );

    previousVoteValue =
      userPreviousVoteIndex !== -1
        ? this.votes[userPreviousVoteIndex].voteValue
        : null;

    if (previousVoteValue !== null && previousVoteValue === voteValue) {
      const voteType = previousVoteValue === 1 ? "upvoted" : "downvoted";
      alert(
        `You already ${voteType} this ${
          contentType === "comment" ? "comment" : "post"
        }.`
      );
    } else {
      Meteor.call("content.vote", contentType, this._id, voteValue);
    }
  },
});
