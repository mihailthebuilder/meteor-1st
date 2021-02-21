import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";

import { Mongo } from "meteor/mongo";

export const Posts = new Mongo.Collection("posts");

const VoteOptions = Match.Where((value) => {
  check(value, Match.Integer);
  return Math.abs(value) === 1;
});

Meteor.methods({
  "posts.insert"(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Posts.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      votes: 0,
    });
  },
  "posts.vote"(postId, voteValue) {
    check(voteValue, VoteOptions);

    // don't allow people who haven't logged in
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    // don't allow votes on own posts
    if (Posts.find({ _id: postId, owner: this.userId }).count() > 0) {
      throw new Meteor.Error("not-authorized");
    }

    previousVoteValue = Posts.findOne({ _id: postId }).votes;

    Posts.update(postId, {
      $set: {
        votes: previousVoteValue + voteValue,
      },
    });
  },
});
