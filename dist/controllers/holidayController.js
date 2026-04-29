"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHoliday = exports.updateHoliday = exports.getHolidays = exports.addHoliday = void 0;
const db_1 = __importDefault(require("../config/db"));
// ➕ ADD HOLIDAY
const addHoliday = (req, res) => {
    const { name, date } = req.body;
    db_1.default.query("INSERT INTO holidays (name, date) VALUES (?, ?)", [name, date], (err) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Holiday added successfully" });
    });
};
exports.addHoliday = addHoliday;
// 📄 GET ALL HOLIDAYS
const getHolidays = (req, res) => {
    db_1.default.query("SELECT * FROM holidays", (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};
exports.getHolidays = getHolidays;
// ✏️ UPDATE HOLIDAY
const updateHoliday = (req, res) => {
    const { id } = req.params;
    const { name, date } = req.body;
    db_1.default.query("UPDATE holidays SET name = ?, date = ? WHERE id = ?", [name, date, id], (err) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Holiday updated successfully" });
    });
};
exports.updateHoliday = updateHoliday;
// ❌ DELETE HOLIDAY
const deleteHoliday = (req, res) => {
    const { id } = req.params;
    db_1.default.query("DELETE FROM holidays WHERE id = ?", [id], (err) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Holiday deleted successfully" });
    });
};
exports.deleteHoliday = deleteHoliday;
