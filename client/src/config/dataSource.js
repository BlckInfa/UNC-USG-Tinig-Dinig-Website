/**
 * Data Source Configuration
 * Single source-of-truth flag for switching between data sources.
 *
 * "json" → Static JSON (default) — demo / offline / low-budget
 * "api"  → Backend API            — real /api/* endpoints
 *
 * To switch, change the value below. No other file changes needed.
 */
export const DATA_SOURCE = "json"; // "json" | "api"
