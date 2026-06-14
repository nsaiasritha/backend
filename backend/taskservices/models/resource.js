import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    capacity: { type: Number },
    amenities: { type: String },
    status: { type: Number, default: 1 },
    embedding: { type: [Number], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema, 'resources');
export default Resource;
