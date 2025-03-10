import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
    email: string;
    fullName: string;
    password: string;
    profilePic?: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUserDocument> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            select: false
        },
        profilePic: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

// pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Middleware for bulk insert (insertMany)
userSchema.pre('insertMany', async function (next, docs: IUserDocument[]) {
    try {
        for (const doc of docs) {
            const salt = await bcrypt.genSalt(12);
            doc.password = await bcrypt.hash(doc.password, salt);
        }
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
