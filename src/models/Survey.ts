import mongoose from 'mongoose'

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['engineering', 'humanities', 'social', 'economics', 'arts', 'sports', 'etc'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    responseCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.Survey || mongoose.model('Survey', surveySchema) 