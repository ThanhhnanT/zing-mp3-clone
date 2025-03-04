"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const unique_slug_1 = __importDefault(require("unique-slug"));
const usersSchema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    avatar: String,
    gender: String,
    authToken: String,
    password: String,
    playlists: [{ playlistId: String, name: String }],
    followers: [{ userId: String }],
    following: [{ userId: String }],
    recentlyPlayed: [{ songId: String, playedAt: Date }],
    friendList: [
        {
            friendId: String,
            roomChat: String,
        }
    ],
    waitAcceptFriend: [
        {
            acceptFriendId: String
        }
    ],
    waitResponseFriend: [
        {
            responseFriendId: String,
        }
    ],
    likeSong: [
        {
            songId: String,
            singerId: String,
        }
    ],
    status: {
        type: String,
        default: "active"
    },
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
usersSchema.pre("save", function (next) {
    if (!this.slug && this.fullName) {
        const randomString = Math.random().toString(36).substring(2, 8);
        this.slug = (0, unique_slug_1.default)(`${this.fullName}-${randomString}`);
    }
    next();
});
const Users = mongoose_1.default.model("users", usersSchema, "users");
exports.default = Users;
