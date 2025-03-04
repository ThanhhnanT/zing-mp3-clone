"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const unique_slug_1 = __importDefault(require("unique-slug"));
const songSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    singerId: String,
    topicId: String,
    like: Number,
    lyrics: String,
    audio: String,
    avatar: String,
    status: String,
    listen: {
        type: Number,
        default: 0
    },
    listenHistory: [
        {
            timestamp: { type: String, required: true },
            count: { type: Number, default: 0 }
        }
    ],
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
songSchema.pre("save", function (next) {
    if (!this.slug && this.title) {
        this.slug = (0, unique_slug_1.default)(this.title);
    }
    next();
});
const Song = mongoose_1.default.model("Song", songSchema, "songs");
exports.default = Song;
