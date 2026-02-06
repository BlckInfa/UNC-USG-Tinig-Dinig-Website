const express = require("express");
const router = express.Router();
const { reportController } = require("../controllers");

/**
 * Report Routes
 * /api/reports
 *
 * NOTE: This is a SCAFFOLDED feature (Layer 2)
 * Routes are defined but many return mock/placeholder data.
 *
 * @stub - Full implementation deferred
 */

// Dashboard & Analytics

// GET /api/reports/dashboard - Get dashboard analytics
router.get("/dashboard", reportController.getDashboard);

// GET /api/reports/summary - Get summary statistics
router.get("/summary", reportController.getSummary);

// GET /api/reports/trends - Get trend analysis (@stub)
router.get("/trends", reportController.getTrends);

// GET /api/reports/departments - Get department breakdown
router.get("/departments", reportController.getDepartments);

// Search

// GET /api/reports/search - Search issuances
router.get("/search", reportController.search);

// Report Management

// GET /api/reports - Get saved reports
router.get("/", reportController.getAll);

// POST /api/reports - Create a custom report
router.post("/", reportController.create);

// POST /api/reports/:id/generate - Generate report data (@stub)
router.post("/:id/generate", reportController.generate);

// GET /api/reports/:id/export - Export report (@stub)
router.get("/:id/export", reportController.export);

// POST /api/reports/:id/schedule - Schedule a report (@stub)
router.post("/:id/schedule", reportController.schedule);

module.exports = router;
