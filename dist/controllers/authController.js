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
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// REGISTER
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    db_1.default.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], (err) => {
        if (err)
            return res.status(500).json(err);
        res.json({ message: "User registered" });
    });
});
exports.register = register;
// LOGIN
const login = (req, res) => {
    const { email, password } = req.body;
    db_1.default.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(500).json(err);
        if (result.length === 0) {
            return res.json({ message: "User not found" });
        }
        const user = result[0];
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.json({ message: "Wrong password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }));
};
exports.login = login;
