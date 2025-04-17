import {Schema, model} from "mongoose";


const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, { timestamps: true });

likeSchema.index({ user: 1, article: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

const Like = model('Like', likeSchema);
export default Like;
