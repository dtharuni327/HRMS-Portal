"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaveStatus = exports.getAllLeaves = exports.applyLeave = void 0;
const db_1 = __importDefault(require("../config/db"));
// APPLY LEAVE
const applyLeave = (req, res) => {
    const { leave_type, from_date, to_date, reason } = req.body;
    db_1.default.query("INSERT INTO leaves (user_id, leave_type, from_date, to_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)", [req.user.id, leave_type, from_date, to_date, reason, "PENDING"], (err) => {
        if (err)
            return res.status(500).json(err);
        res.json({ message: "Leave applied" });
    });
};
exports.applyLeave = applyLeave;
// GET ALL LEAVES
const getAllLeaves = (req, res) => {
    db_1.default.query("SELECT * FROM leaves", (err, result) => {
        if (err)
            return res.status(500).json(err);
        res.json(result);
    });
};
exports.getAllLeaves = getAllLeaves;
// UPDATE STATUS
const updateLeaveStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db_1.default.query("UPDATE leaves SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err)
            return res.status(500).json(err);
        res.json({ message: "Leave status updated" });
    });
};
exports.updateLeaveStatus = updateLeaveStatus;
