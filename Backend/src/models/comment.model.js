import {Schema, model} from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 }
}, { timestamps: true });

const Comment = model('Comment', commentSchema);
export default Comment;
