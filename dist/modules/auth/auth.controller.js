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
exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const auth_service_1 = require("./auth.service");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long"),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
});
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = registerSchema.parse(req.body);
        const { user, token } = yield (0, auth_service_1.registerUser)({ name, email, password, role });
        res.status(201).json({ success: true, data: { user, token } });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const { user, token } = yield (0, auth_service_1.loginUser)({ email, password });
        res.status(200).json({ success: true, data: { user, token } });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
