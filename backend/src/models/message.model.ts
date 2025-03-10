import mongoose, { Document, Schema } from 'mongoose';
import { IUserDocument } from './user.model';

export interface IMessageDocument extends Document {
    senderId: Schema.Types.ObjectId | IUserDocument;
    receiverId: Schema.Types.ObjectId | IUserDocument;
    text?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema: Schema<IMessageDocument> = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String
        },
        image: {
            type: String
        }
    },
    { timestamps: true }
);

const Message = mongoose.model<IUserDocument>('Message', messageSchema);

export default Message;
