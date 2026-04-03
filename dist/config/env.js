"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
if (process.env.NODE_ENV === 'production') {
    dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
}
else {
    dotenv_1.default.config();
}
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(1),
    PORT: zod_1.z.preprocess((val) => parseInt(String(val), 10), zod_1.z.number().positive()),
});
exports.config = envSchema.parse(process.env);
