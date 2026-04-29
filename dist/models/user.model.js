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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = void 0;
const db_1 = require("../services/config/db");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = user;
    const [result] = yield db_1.db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
    return result;
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.db.execute("SELECT id FROM users WHERE email = ?", [email]);
    return rows.length > 0;
});
exports.findUserByEmail = findUserByEmail;
