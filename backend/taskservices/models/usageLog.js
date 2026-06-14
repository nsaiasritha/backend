import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema({
    action: { type: String },        // e.g. 'SEARCH', 'VIEW', 'BOOK'
    userId: { type: Number },
    resourceId: { type: String },
    resourceName: { type: String },
    query: { type: String },         // for search actions
    timestamp: { type: Date, default: Date.now }
});

const UsageLog = mongoose.model('UsageLog', usageLogSchema, 'usage_logs');
export default UsageLog;
