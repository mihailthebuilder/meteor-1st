import { Posts } from "../../api/posts.js";
import "./post.html";
import "./post.scss";

import { Template } from "meteor/templating";

Template.post.events({
  "click .vote"(event) {
    event.preventDefault();

    Posts.update(this._id, {
      $set: {
        votes: this.votes + parseInt(event.target.getAttribute("voteValue")),
      },
    });
  },
});
