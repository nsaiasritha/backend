import mongoose from 'mongoose';

const bookingHistorySchema = new mongoose.Schema({
    bookingId: { type: String },
    resourceId: { type: String },
    resourceName: { type: String },
    userId: { type: Number },
    action: { type: String },        // 'CREATED', 'UPDATED', 'CANCELLED'
    previousStatus: { type: Number },
    newStatus: { type: Number },
    slotDate: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    changedAt: { type: Date, default: Date.now }
});

const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema, 'booking_history');
export default BookingHistory;
