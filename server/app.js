const express = require("express");
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

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/issuances", issuanceRoutes);

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
