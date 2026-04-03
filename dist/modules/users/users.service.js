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
exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const getAllUsers = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [users, total] = yield db_1.prisma.$transaction([
        db_1.prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
        db_1.prisma.user.count(),
    ]);
    return { users, total };
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.AppError('NOT_FOUND', 'User not found');
    }
    return user;
});
exports.getUserById = getUserById;
const updateUserById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
});
exports.updateUserById = updateUserById;
const deleteUserById = (id, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (id === currentUserId) {
        throw new AppError_1.AppError('VALIDATION_ERROR', 'You cannot delete your own account');
    }
    yield db_1.prisma.user.update({
        where: { id },
        data: { status: client_1.UserStatus.INACTIVE },
    });
});
exports.deleteUserById = deleteUserById;
