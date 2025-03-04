"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const unique_slug_1 = __importDefault(require("unique-slug"));
const singerSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: String,
    status: String,
    slug: {
        type: String,
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date,
}, {
    timestamps: true,
});
singerSchema.pre("save", function (next) {
    if (!this.slug && this.fullName) {
        this.slug = (0, unique_slug_1.default)(this.fullName);
    }
    next();
});
const Singer = mongoose_1.default.model("Singer", singerSchema, "singers");
exports.default = Singer;
