"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const express = require('express');
const path = require('path');
const multer = require('multer');
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });
async function registerRoutes(app) {
    // Serve static files
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    // Set view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    // Page Routes
    app.get('/', (_req, res) => {
        res.render('navigation');
    });
    app.get('/info', (_req, res) => {
        res.render('info');
    });
    app.get('/map', (_req, res) => {
        res.render('map');
    });
    app.get('/updates', (_req, res) => {
        res.render('updates');
    });
    app.get('/support', (_req, res) => {
        res.render('support');
    });
    app.get('/admin', (_req, res) => {
        // TODO: Add authentication middleware
        res.render('admin');
    });
    app.get('/users', (_req, res) => {
        res.render('users');
    });
    // API Routes
    // Updates & Events
    app.get('/api/updates', (_req, res) => {
        // TODO: Implement data fetching from database
        res.json({
            emergencyUpdates: [],
            weatherAlerts: [],
            governmentAnnouncements: [],
            upcomingEvents: []
        });
    });
    // Chat Support
    app.post('/api/chat', async (req, res) => {
        try {
            // TODO: Implement AI chat integration
            // This is where you'll integrate with your chosen AI provider
            res.json({
                response: "This is a placeholder response. Implement AI integration here."
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to process chat message' });
        }
    });
    // Admin Routes
    app.get('/api/admin/users', (_req, res) => {
        // TODO: Implement user search
        res.json([]);
    });
    app.post('/api/admin/emergency-updates', (_req, res) => {
        // TODO: Implement emergency update creation
        res.json({ success: true });
    });
    app.post('/api/admin/events', (_req, res) => {
        // TODO: Implement event creation
        res.json({ success: true });
    });
    app.post('/api/admin/resources', (_req, res) => {
        // TODO: Implement resource creation
        res.json({ success: true });
    });
    // User Reports
    app.post('/api/reports', upload.array('attachments'), (_req, res) => {
        // TODO: Implement report submission
        res.json({ success: true });
    });
    app.get('/api/reports/my-reports', (_req, res) => {
        // TODO: Implement fetching user's reports
        res.json([]);
    });
    // Map Data
    app.get('/api/map/markers', (_req, res) => {
        // TODO: Implement fetching map markers
        res.json({
            events: [],
            resources: []
        });
    });
    return app;
}
module.exports = { registerRoutes };
