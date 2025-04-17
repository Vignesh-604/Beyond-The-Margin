import {Schema, model} from "mongoose";

const bookmarkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  }
}, { timestamps: true });

bookmarkSchema.index({ user: 1, article: 1 }, { unique: true });

const Bookmark = model('Bookmark', bookmarkSchema);
export default Bookmark;
