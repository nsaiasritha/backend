import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    resourceId: { type: String, required: true },
    resourceName: { type: String },
    userId: { type: Number, required: true },
    userName: { type: String },
    slotDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    purpose: { type: String },
    status: { type: Number, default: 0 }, // 0=pending, 1=confirmed, 2=cancelled
    createdBy: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema, 'bookings');
export default Booking;
