const nodemailer = require("nodemailer");

const RECIPIENT_EMAIL = "johndavid.laureles@unc.edu.ph";

/**
 * Create email transporter
 * Uses SMTP credentials from environment variables
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
};

/**
 * Format survey response into a readable HTML email
 */
const formatSurveyEmail = (data) => {
    const likertLabel = (val) => {
        const labels = {
            "1": "Strongly Disagree",
            "2": "Disagree",
            "3": "Neutral",
            "4": "Agree",
            "5": "Strongly Agree",
        };
        return labels[val] || val;
    };

    return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background: #C8102E; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Tinig Dinig Survey Response</h1>
      </div>

      <div style="padding: 20px; background: #fff;">

        <h2 style="color: #C8102E; border-bottom: 2px solid #C8102E; padding-bottom: 8px;">Respondents Profile</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px; font-weight: bold;">Name:</td><td style="padding: 6px;">${data.name || "N/A"}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Student Number:</td><td style="padding: 6px;">${data.studentNumber}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">College Department:</td><td style="padding: 6px;">${data.collegeDepartment}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Year Level:</td><td style="padding: 6px;">${data.yearLevel}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Aiming for Latin Honors:</td><td style="padding: 6px;">${data.aimingForLatinHonors}</td></tr>
        </table>

        <h2 style="color: #C8102E; border-bottom: 2px solid #C8102E; padding-bottom: 8px;">Awareness and Understanding</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px; font-weight: bold;">Aware of new IRR:</td><td style="padding: 6px;">${data.awareOfNewIRR}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Understanding Level:</td><td style="padding: 6px;">${data.understandingLevel}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Familiar Aspects:</td><td style="padding: 6px;">${Array.isArray(data.familiarAspects) ? data.familiarAspects.join(", ") : data.familiarAspects}</td></tr>
        </table>

        <h2 style="color: #C8102E; border-bottom: 2px solid #C8102E; padding-bottom: 8px;">Viewpoints Scale</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px; font-weight: bold;">GWA ranges are fair and attainable:</td><td style="padding: 6px;">${likertLabel(data.gwaRangesFair)}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">No-failing-grade encourages discipline:</td><td style="padding: 6px;">${likertLabel(data.noFailingGradeEncourages)}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Minimum unit load is reasonable:</td><td style="padding: 6px;">${likertLabel(data.minimumUnitLoadReasonable)}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">IRR might cause unnecessary stress:</td><td style="padding: 6px;">${likertLabel(data.irrCausesStress)}</td></tr>
        </table>

        <h2 style="color: #C8102E; border-bottom: 2px solid #C8102E; padding-bottom: 8px;">Sentiments and Opinions</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px; font-weight: bold;">New criteria difficulty:</td><td style="padding: 6px;">${data.newCriteriaDifficulty}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Favor retaining previous GWA:</td><td style="padding: 6px;">${data.favorRetainingPreviousGWA}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Favor academic distinction:</td><td style="padding: 6px;">${data.favorAcademicDistinction}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Prefer more categories:</td><td style="padding: 6px;">${data.preferMoreCategories}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Criteria reflect excellence:</td><td style="padding: 6px;">${data.criteriaReflectExcellence}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Grading vs teaching impact:</td><td style="padding: 6px;">${data.gradingVsTeaching}</td></tr>
        </table>

        <h2 style="color: #C8102E; border-bottom: 2px solid #C8102E; padding-bottom: 8px;">Open Feedback</h2>
        <p><strong>Strengths of new criteria:</strong><br/>${data.strengths}</p>
        <p><strong>Concerns/challenges:</strong><br/>${data.concerns}</p>
        <p><strong>Suggestions to improve:</strong><br/>${data.suggestions}</p>
        <p><strong>Importance of prestige:</strong><br/>${data.importanceOfPrestige}</p>
        <p><strong>Main factor influencing academic culture:</strong><br/>${data.mainFactor}</p>

        <h2 style="color: #C8102E; border-bottom: 2px solid #C8102E; padding-bottom: 8px;">Share Your Voice</h2>
        <p>${data.shareYourVoice}</p>

      </div>

      <div style="background: #f5f5f5; padding: 12px; text-align: center; font-size: 12px; color: #666;">
        Submitted via USG Tinig Dinig Survey
      </div>
    </div>
    `;
};

/**
 * Survey Controller
 */
class SurveyController {
    /**
     * Submit survey response via email
     * POST /api/survey
     */
    async submitSurvey(req, res, next) {
        try {
            const transporter = createTransporter();
            const html = formatSurveyEmail(req.body);

            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: RECIPIENT_EMAIL,
                subject: `Tinig Dinig Survey Response - ${req.body.studentNumber || "Anonymous"}`,
                html,
            });

            res.status(200).json({
                success: true,
                message: "Survey submitted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SurveyController();
