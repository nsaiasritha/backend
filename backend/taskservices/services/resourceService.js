import Resource from '../models/resource.js';
import Booking from '../models/booking.js';
import UsageLog from '../models/usageLog.js';
import ResourceEmbedding from '../models/resourceEmbedding.js';
import BookingHistory from '../models/bookingHistory.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRETE_KEY = process.env.SECRETE_KEY;

// ─── Helper: Log usage ────────────────────────────────────────────
const logUsage = async (action, userId, resourceId, resourceName, query = null) => {
    try {
        await new UsageLog({ action, userId, resourceId, resourceName, query }).save();
    } catch (_) {}
};

// ─── Helper: Log booking history ─────────────────────────────────
const logBookingHistory = async (bookingId, resourceId, resourceName, userId, action, prevStatus, newStatus, slotDate, startTime, endTime) => {
    try {
        await new BookingHistory({
            bookingId, resourceId, resourceName, userId,
            action, previousStatus: prevStatus, newStatus: newStatus,
            slotDate, startTime, endTime
        }).save();
    } catch (_) {}
};

// ─── Helper: Upsert resource embedding ───────────────────────────
const upsertEmbedding = async (resource) => {
    try {
        const keywords = [
            ...(resource.name || '').split(' '),
            ...(resource.category || '').split(' '),
            ...(resource.amenities || '').split(',').map(a => a.trim()),
            ...(resource.location || '').split(' ')
        ].filter(Boolean).map(k => k.toLowerCase());

        await ResourceEmbedding.findOneAndUpdate(
            { resourceId: resource._id.toString() },
            { resourceId: resource._id.toString(), resourceName: resource.name, keywords, updatedAt: new Date() },
            { upsert: true, new: true }
        );
    } catch (_) {}
};

// ─── Resources ────────────────────────────────────────────────────

export const createResource = async (data, token) => {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        const resource = new Resource({ ...data, updatedAt: new Date() });
        await resource.save();
        await upsertEmbedding(resource);
        await logUsage('CREATE_RESOURCE', payload.crid, resource._id.toString(), resource.name);
        return { code: 200, message: 'Resource created successfully', resource };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const getAllResources = async (page, size) => {
    try {
        const skip = (page - 1) * size;
        const total = await Resource.countDocuments({ status: 1 });
        const resources = await Resource.find({ status: 1 })
            .skip(skip).limit(size).sort({ createdAt: -1 });
        return { code: 200, resources, total };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const getResourceById = async (id) => {
    try {
        const resource = await Resource.findById(id);
        if (!resource) return { code: 404, message: 'Resource not found' };
        return { code: 200, resource };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const updateResource = async (id, data, token) => {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        data.updatedAt = new Date();
        const resource = await Resource.findByIdAndUpdate(id, data, { new: true });
        if (!resource) return { code: 404, message: 'Resource not found' };
        await upsertEmbedding(resource);
        await logUsage('UPDATE_RESOURCE', payload.crid, id, resource.name);
        return { code: 200, message: 'Resource updated', resource };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const deleteResource = async (id, token) => {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        const resource = await Resource.findByIdAndUpdate(id, { status: 0 });
        await logUsage('DELETE_RESOURCE', payload.crid, id, resource?.name);
        return { code: 200, message: 'Resource deleted' };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const vectorSearch = async (key, userId = null) => {
    try {
        const regex = new RegExp(key, 'i');
        const resources = await Resource.find({
            status: 1,
            $or: [
                { name: regex }, { description: regex },
                { category: regex }, { amenities: regex }, { location: regex }
            ]
        });
        // Log search to usage_logs
        await logUsage('SEARCH', userId, null, null, key);
        return { code: 200, resources };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const getResourcesByCategory = async (category) => {
    try {
        const resources = await Resource.find({ category, status: 1 });
        return { code: 200, resources };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const getRecommendations = async (key) => {
    try {
        const regex = new RegExp(key, 'i');
        const resources = await Resource.find({
            status: 1,
            $or: [
                { name: regex }, { description: regex },
                { amenities: regex }, { category: regex }
            ]
        }).limit(5);
        await logUsage('RECOMMEND', null, null, null, key);
        return { code: 200, resources };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

// ─── Bookings ─────────────────────────────────────────────────────

export const createBooking = async (data, token) => {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        data.createdBy = payload.crid;
        data.userId = payload.crid;

        // Conflict check
        const conflict = await Booking.findOne({
            resourceId: data.resourceId,
            slotDate: data.slotDate,
            status: { $ne: 2 },
            $or: [{ startTime: { $lt: data.endTime }, endTime: { $gt: data.startTime } }]
        });

        if (conflict) {
            return { code: 409, message: 'Time slot already booked. Please choose a different time.' };
        }
const booking = new Booking({
    ...data,
    status: 1,
    updatedAt: new Date()
});
        await booking.save();

        // Log to booking_history and usage_logs
        await logBookingHistory(
            booking._id.toString(), data.resourceId, data.resourceName,
            payload.crid, 'CREATED', null, 1, data.slotDate, data.startTime, data.endTime
        );
        await logUsage('CREATE_BOOKING', payload.crid, data.resourceId, data.resourceName);

        return { code: 200, message: 'Booking created successfully', booking };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const getAllBookings = async (page, size, token) => {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        const skip = (page - 1) * size;
        let query = {};
        if (payload.role !== 2) query.userId = payload.crid;
        const total = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .skip(skip).limit(size).sort({ createdAt: -1 });
        return { code: 200, bookings, total };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const getBookingById = async (id) => {
    try {
        const booking = await Booking.findById(id);
        if (!booking) return { code: 404, message: 'Booking not found' };
        return { code: 200, booking };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const updateBooking = async (id, data, token) => {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        const old = await Booking.findById(id);
        data.updatedAt = new Date();
        const booking = await Booking.findByIdAndUpdate(id, data, { new: true });
        if (!booking) return { code: 404, message: 'Booking not found' };
        await logBookingHistory(
            id, booking.resourceId, booking.resourceName,
            payload.crid, 'UPDATED', old?.status, data.status,
            booking.slotDate, booking.startTime, booking.endTime
        );
        return { code: 200, message: 'Booking updated', booking };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const cancelBooking = async (id, token) => {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        const old = await Booking.findById(id);
        await Booking.findByIdAndUpdate(id, { status: 2, updatedAt: new Date() });
        await logBookingHistory(
            id, old?.resourceId, old?.resourceName,
            payload.crid, 'CANCELLED', old?.status, 2,
            old?.slotDate, old?.startTime, old?.endTime
        );
        await logUsage('CANCEL_BOOKING', payload.crid, old?.resourceId, old?.resourceName);
        return { code: 200, message: 'Booking cancelled' };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};

export const checkAvailability = async (resourceId, date) => {
    try {
        const bookings = await Booking.find({
            resourceId, slotDate: date, status: { $ne: 2 }
        });
        return { code: 200, bookings };
    } catch (err) {
        return { code: 500, message: err.message };
    }
};
