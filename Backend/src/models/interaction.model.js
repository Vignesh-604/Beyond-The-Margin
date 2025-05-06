import { Schema, model } from "mongoose";

const interactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article",
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  type: {
    type: String,
    enum: ["like", "dislike", "bookmark"],
    required: true,
  },
}, { timestamps: true });


interactionSchema.pre("validate", function (next) {
  if (this.type === "bookmark" && this.comment) {
    return next(new Error("Bookmarks cannot be applied to comments"));
  }

  if ((this.type === "like" || this.type === "dislike") && (!this.article && !this.comment)) {
    return next(new Error("Like/Dislike must be on either an article or a comment"));
  }

  if (this.article && this.comment) {
    return next(new Error("Interaction cannot be on both article and comment"));
  }

  next();
});


// 🔍 Unique interactions (per user, per target, per type)
// interactionSchema.index({ user: 1, article: 1, type: 1 }, { unique: true, sparse: true });
interactionSchema.index({ user: 1, comment: 1, type: 1 }, { unique: true, partialFilterExpression: { comment: { $exists: true } } });

// 🔍 Useful for counting likes/dislikes/bookmarks
interactionSchema.index({ article: 1, type: 1 });
interactionSchema.index({ comment: 1, type: 1 });

const Interaction = model("Interaction", interactionSchema);
export default Interaction;
