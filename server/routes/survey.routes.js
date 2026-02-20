const express = require("express");
const router = express.Router();
const { surveyController } = require("../controllers");
const { authenticate, surveyValidation } = require("../middlewares");

/**
 * Survey Routes (Tinig Dinig Survey)
 * /api/survey
 */

// All routes require authentication
router.use(authenticate);

// POST /api/survey - Submit survey response
router.post("/", surveyValidation.submit, surveyController.submitSurvey);

module.exports = router;
