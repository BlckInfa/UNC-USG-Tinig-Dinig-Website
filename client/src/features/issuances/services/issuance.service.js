/**
 * Issuance Service — Data Source Switch
 *
 * ⚠️  This is the ONLY service file UI components may import.
 *
 * It reads the DATA_SOURCE flag and re-exports the matching implementation:
 *   "json" → issuance.service.json.js  (static JSON, no backend)
 *   "api"  → issuance.service.api.js   (real API endpoints)
 *
 * To switch data sources, change ONE line in config/dataSource.js
 */
import { DATA_SOURCE } from "../../../config/dataSource";
import {
    issuanceServiceJSON,
    commentServiceJSON,
} from "./issuance.service.json";
import { issuanceServiceAPI, commentServiceAPI } from "./issuance.service.api";

export const issuanceService =
    DATA_SOURCE === "api" ? issuanceServiceAPI : issuanceServiceJSON;

export const commentService =
    DATA_SOURCE === "api" ? commentServiceAPI : commentServiceJSON;

export default issuanceService;
