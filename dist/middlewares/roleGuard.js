"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const AppError_1 = require("../utils/AppError");
const requireRole = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return next(new AppError_1.AppError('FORBIDDEN', 'You do not have permission to perform this action'));
        }
        next();
    };
};
exports.requireRole = requireRole;
