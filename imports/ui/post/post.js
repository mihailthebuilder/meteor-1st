import "./post.html";
import "./post.scss";
import { Meteor } from "meteor/meteor";

import { Template } from "meteor/templating";

Template.post.helpers({
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

    const userPreviousVoteIndex = this.votes.findIndex(
      (user) => user.userId === Meteor.user()._id
    );

    if (userPreviousVoteIndex !== -1) {
      previousVoteValue = this.votes[userPreviousVoteIndex].voteValue;
      if (previousVoteValue === voteValue) {
        const voteType = previousVoteValue === 1 ? "upvoted" : "downvoted";
        alert(`You already ${voteType} this post.`);
      } else {
        Meteor.call("posts.vote", this._id, voteValue);
      }
    } else {
      Meteor.call("posts.vote", this._id, voteValue);
    }
  },
});
