const express = require("express");
const router = express.Router();
const { issuanceController } = require("../controllers");

/**
 * Issuance Routes
 * /api/issuances
 */

// Public Endpoints

// GET /api/issuances - Get all published issuances
router.get("/", issuanceController.getAll);

// GET /api/issuances/:id - Get a single issuance by ID
router.get("/:id", issuanceController.getById);

// Admin Endpoints (No auth logic required yet)

// POST /api/issuances - Create a new issuance
router.post("/", issuanceController.create);

// PUT /api/issuances/:id - Update an existing issuance
router.put("/:id", issuanceController.update);

module.exports = router;
