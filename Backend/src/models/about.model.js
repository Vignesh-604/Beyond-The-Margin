import { Schema, model } from 'mongoose';

const aboutSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['hero', 'mission', 'founder', 'member'],
            required: true,
        },

        // Generic fields
        title: { type: String },
        content: { type: String },
        image: { type: String },
        order: { type: Number },

        // For founders and members
        name: { type: String },
        role: { type: String },
        bio: { type: String },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        // Founder only
        message: { type: String },
    },
    { timestamps: true }
);

const About = model('About', aboutSchema);
export default About
