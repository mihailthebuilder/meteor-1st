import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";

import { Mongo } from "meteor/mongo";

export const Posts = new Mongo.Collection("posts");
export const Comments = new Mongo.Collection("comments");

if (Meteor.isServer) {
  Meteor.publish("posts", function postsPublication() {
    return Posts.find();
  });
  Meteor.publish("comments", function commentsPublication() {
    return Comments.find();
  });
}

const VoteOptions = Match.Where((value) => {
  check(value, Match.Integer);
  return Math.abs(value) === 1;
});

Meteor.methods({
  "content.insert"(text, contentType, postId) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    contentObj = {
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      votes: [],
    };

    Dataset = Posts;

    if (contentType === "comment") {
      contentObj.post = postId;
      Dataset = Comments;
    }

    Dataset.insert(contentObj);
  },
  "content.vote"(contentType, contentId, voteValue) {
    check(voteValue, VoteOptions);

    userId = this.userId;

    // don't allow people who haven't logged in
    if (!userId) {
      throw new Meteor.Error("not-authorized");
    }

    Dataset = contentType === "comment" ? Comments : Posts;

    console.log(Dataset);

    content = Dataset.findOne({ _id: contentId });

    // don't allow votes on own posts
    if (content.owner === userId) {
      throw new Meteor.Error("not-authorized");
    }

    let newVotes = content.votes.concat({
      userId: userId,
      voteValue: voteValue,
    });

    const userPreviousVoteIndex = content.votes.findIndex(
      (user) => user.userId === userId
    );

    if (userPreviousVoteIndex !== -1) {
      if (content.votes[userPreviousVoteIndex].voteValue === voteValue) {
        throw new Meteor.Error("not-authorized");
      }
      content.votes[userPreviousVoteIndex].voteValue = voteValue;
      newVotes = content.votes;
    }

    Dataset.update(contentId, {
      $set: {
        votes: newVotes,
      },
    });
  },
});
