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
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const users_service_1 = require("./users.service");
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { users, total } = yield (0, users_service_1.getAllUsers)(Number(page), Number(limit));
        res.status(200).json({ success: true, data: users, meta: { page, limit, total } });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, users_service_1.getUserById)(req.params.id);
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long").optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
    status: zod_1.z.nativeEnum(client_1.UserStatus).optional(),
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = updateSchema.parse(req.body);
        const user = yield (0, users_service_1.updateUserById)(req.params.id, data);
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield (0, users_service_1.deleteUserById)(req.params.id, user.id);
        res.status(200).json({ success: true, data: { message: 'User deleted successfully' } });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
