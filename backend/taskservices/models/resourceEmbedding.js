import mongoose from 'mongoose';

const resourceEmbeddingSchema = new mongoose.Schema({
    resourceId: { type: String, required: true },
    resourceName: { type: String },
    keywords: { type: [String], default: [] },   // extracted keywords for search
    embedding: { type: [Number], default: [] },  // future vector embeddings
    updatedAt: { type: Date, default: Date.now }
});

const ResourceEmbedding = mongoose.model('ResourceEmbedding', resourceEmbeddingSchema, 'resource_embeddings');
export default ResourceEmbedding;
