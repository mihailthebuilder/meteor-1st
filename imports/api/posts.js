import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";

import { Mongo } from "meteor/mongo";

export const Posts = new Mongo.Collection("posts");

if (Meteor.isServer) {
  Meteor.publish("posts", function postsPublication() {
    return Posts.find();
  });
}

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
      votes: [],
    });
  },
  "posts.vote"(postId, voteValue) {
    check(voteValue, VoteOptions);

    userId = this.userId;

    // don't allow people who haven't logged in
    if (!userId) {
      throw new Meteor.Error("not-authorized");
    }

    post = Posts.findOne({ _id: postId });

    // don't allow votes on own posts
    if (post.owner === userId) {
      throw new Meteor.Error("not-authorized");
    }

    let newVotes = post.votes.concat({
      userId: userId,
      voteValue: voteValue,
    });

    const userPreviousVoteIndex = post.votes.findIndex(
      (user) => user.userId === userId
    );

    if (userPreviousVoteIndex !== -1) {
      if (post.votes[userPreviousVoteIndex].voteValue === voteValue) {
        throw new Meteor.Error("not-authorized");
      }
      post.votes[userPreviousVoteIndex].voteValue = voteValue;
      newVotes = post.votes;
    }

    Posts.update(postId, {
      $set: {
        votes: newVotes,
      },
    });
  },
});
