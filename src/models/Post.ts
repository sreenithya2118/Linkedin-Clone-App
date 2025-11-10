import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  imageUrl?: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
