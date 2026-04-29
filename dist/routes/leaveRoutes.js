"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = require("../controllers/leaveController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/leave", authMiddleware_1.verifyToken, leaveController_1.applyLeave);
router.get("/leave", authMiddleware_1.verifyToken, leaveController_1.getAllLeaves);
router.put("/leave/:id", authMiddleware_1.verifyToken, leaveController_1.updateLeaveStatus);
exports.default = router;
