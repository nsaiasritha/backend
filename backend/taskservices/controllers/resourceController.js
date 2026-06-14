import express from 'express';
import * as resourceService from '../services/resourceService.js';

const router = express.Router();

// ─── Resource Routes ────────────────────────────────────────────

router.post('/resource/createresource', async (req, res) => {
    const token = req.headers['token'];
    const result = await resourceService.createResource(req.body, token);
    res.json(result);
});

router.get('/resource/getallresources/:page/:size', async (req, res) => {
    const { page, size } = req.params;
    const result = await resourceService.getAllResources(Number(page), Number(size));
    res.json(result);
});

router.get('/resource/getresource/:id', async (req, res) => {
    const result = await resourceService.getResourceById(req.params.id);
    res.json(result);
});

router.put('/resource/updateresource/:id', async (req, res) => {
    const token = req.headers['token'];
    const result = await resourceService.updateResource(req.params.id, req.body, token);
    res.json(result);
});

router.delete('/resource/deleteresource/:id', async (req, res) => {
    const token = req.headers['token'];
    const result = await resourceService.deleteResource(req.params.id, token);
    res.json(result);
});

router.get('/resource/vectorsearch/:key', async (req, res) => {
    const result = await resourceService.vectorSearch(decodeURIComponent(req.params.key));
    res.json(result);
});

router.get('/resource/bycategory/:category', async (req, res) => {
    const result = await resourceService.getResourcesByCategory(req.params.category);
    res.json(result);
});

router.get('/resource/recommendations/:key', async (req, res) => {
    const result = await resourceService.getRecommendations(decodeURIComponent(req.params.key));
    res.json(result);
});

// ─── Booking Routes ─────────────────────────────────────────────

router.post('/booking/createbooking', async (req, res) => {
    const token = req.headers['token'];
    const result = await resourceService.createBooking(req.body, token);
    res.json(result);
});

router.get('/booking/getallbookings/:page/:size', async (req, res) => {
    const token = req.headers['token'];
    const { page, size } = req.params;
    const result = await resourceService.getAllBookings(Number(page), Number(size), token);
    res.json(result);
});

router.get('/booking/getbooking/:id', async (req, res) => {
    const result = await resourceService.getBookingById(req.params.id);
    res.json(result);
});

router.put('/booking/updatebooking/:id', async (req, res) => {
    const token = req.headers['token'];
    const result = await resourceService.updateBooking(req.params.id, req.body, token);
    res.json(result);
});

router.delete('/booking/cancelbooking/:id', async (req, res) => {
    const token = req.headers['token'];
    const result = await resourceService.cancelBooking(req.params.id, token);
    res.json(result);
});

router.get('/booking/availability/:resourceId/:date', async (req, res) => {
    const result = await resourceService.checkAvailability(req.params.resourceId, req.params.date);
    res.json(result);
});

export default router;
