"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const unique_slug_1 = __importDefault(require("unique-slug"));
const adminSchema = new mongoose_1.default.Schema({
    fullName: String,
    avatar: String,
    gender: String,
    email: String,
    password: String,
    adminToken: String,
    slug: {
        type: String,
        unique: true
    },
    status: String,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Admin = mongoose_1.default.model('admin', adminSchema, "admin");
adminSchema.pre("save", function (next) {
    if (!this.slug && this.fullName) {
        this.slug = (0, unique_slug_1.default)(this.fullName);
    }
    next();
});
exports.default = Admin;
