"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Finance Dashboard API is running',
        version: '1.0.0',
        docs: 'Import postman_collection.json to test all endpoints',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            records: '/api/records',
            dashboard: '/api/dashboard'
        }
    });
});
app.use('/api', routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
