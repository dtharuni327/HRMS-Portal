"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../services/config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const register = (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const checkQuery = "SELECT * FROM users WHERE email = ?";
        db_1.default.query(checkQuery, [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("DB ERROR (REGISTER - CHECK):", err); // 🔥 shows exact error
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                });
            }
            if (results && results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists",
                });
            }
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
                db_1.default.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                    if (err) {
                        console.error("❌ DB ERROR (REGISTER - INSERT):", err);
                        return res.status(500).json({
                            success: false,
                            message: "Error creating user",
                        });
                    }
                    return res.status(201).json({
                        success: true,
                        message: "User registered successfully ✅",
                    });
                });
            }
            catch (hashError) {
                console.error("❌ HASH ERROR:", hashError);
                return res.status(500).json({
                    success: false,
                    message: "Password hashing failed",
                });
            }
        }));
    }
    catch (error) {
        console.error("❌ SERVER ERROR (REGISTER):", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.register = register;
// ================= LOGIN =================
const login = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }
        const query = "SELECT * FROM users WHERE email = ?";
        db_1.default.query(query, [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("❌ DB ERROR (LOGIN):", err); // 🔥 exact error
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                });
            }
            if (!results || results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            try {
                const user = results[0];
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Login successful ✅",
                });
            }
            catch (compareError) {
                console.error("❌ BCRYPT ERROR:", compareError);
                return res.status(500).json({
                    success: false,
                    message: "Password comparison failed",
                });
            }
        }));
    }
    catch (error) {
        console.error("❌ SERVER ERROR (LOGIN):", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.login = login;
