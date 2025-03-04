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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongTopics = exports.getTopics = void 0;
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const singers_model_1 = __importDefault(require("../../model/singers.model"));
const getTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield topics_model_1.default.find({
            deleted: false
        });
        res.status(200).json({
            code: 200,
            message: "Get successfully",
            data: topic
        });
    }
    catch (e) {
        res.status(500).json({
            code: 500,
            message: "Get failed",
            error: e.message
        });
    }
});
exports.getTopics = getTopics;
const getSongTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songTopic = yield topics_model_1.default.findOne({
            slug: req.params.slugSongTopic,
            deleted: false,
            status: "active",
        }).select("_id title avatar description");
        if (!songTopic) {
            res.status(404).json({ code: 404, message: "Topic not found" });
            return;
        }
        const songs = yield song_model_1.default.find({
            topicId: songTopic._id,
            deleted: false,
            status: "active",
        }).select("title avatar singerId like slug");
        const itemSong = songs.map((song) => song.toObject());
        for (const item of itemSong) {
            const singer = yield singers_model_1.default.findOne({
                _id: item.singerId,
                deleted: false,
                status: "active",
            }).select("fullName");
            if (singer) {
                item.singer = singer.fullName;
            }
        }
        res.status(200).json({
            code: 200,
            topic: songTopic,
            song: itemSong,
        });
    }
    catch (e) {
        res.status(400).json({ code: 400, message: e.message });
    }
});
exports.getSongTopics = getSongTopics;
