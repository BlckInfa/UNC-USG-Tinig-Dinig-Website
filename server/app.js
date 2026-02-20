const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const corsOptions = require("./config/cors.config");
const errorHandler = require("./middlewares/errorHandler");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const financeRoutes = require("./routes/finance.routes");
const orgRoutes = require("./routes/org.routes");
const issuanceRoutes = require("./routes/issuance.routes");
const commentRoutes = require("./routes/comment.routes");
const adminRoutes = require("./routes/admin.routes");
const surveyRoutes = require("./routes/survey.routes");

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/issuances", issuanceRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/survey", surveyRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
