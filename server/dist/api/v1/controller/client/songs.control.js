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
exports.getTop3 = exports.addListen = exports.getSongs = void 0;
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const singers_model_1 = __importDefault(require("../../model/singers.model"));
const moment_1 = __importDefault(require("moment"));
const getSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slugSong;
        const song = yield song_model_1.default.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        }).select('title avatar description singerId topicId like lyrics audio listen');
        const singerId = song.singerId;
        const singer = yield singers_model_1.default.findOne({
            _id: singerId,
            deleted: false,
            status: 'active'
        }).select(' fullName avatar');
        const topicId = song.topicId;
        const topic = yield topics_model_1.default.findOne({
            _id: topicId,
            deleted: false,
            status: 'active'
        }).select('title');
        res.status(200).json({
            song: song,
            singer: singer,
            topic: topic
        });
    }
    catch (e) {
        res.status(404).json({
            message: e.message
        });
    }
});
exports.getSongs = getSongs;
const addListen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).json({ message: "Missing song ID" });
            return;
        }
        const currentHour = (0, moment_1.default)().format("DD:MM:YYYY HH:00");
        const song = yield song_model_1.default.findById(id);
        if (!song) {
            res.status(404).json({ message: "Song not found" });
            return;
        }
        const hourEntry = song.listenHistory.find(entry => entry.timestamp == currentHour);
        if (hourEntry) {
            hourEntry.count += 1;
        }
        else {
            song.listenHistory.push({
                timestamp: currentHour,
                count: 1
            });
        }
        song.listen += 1;
        yield song.save();
        res.status(200).json({ message: "Listen count updated", song: song });
    }
    catch (error) {
        console.error("Error updating listen count:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addListen = addListen;
const getTop3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sixHoursAgo = (0, moment_1.default)().subtract(-1, "hours").format("YYYY-MM-DD HH:00:00");
        const topSongs = yield song_model_1.default.aggregate([
            {
                $match: {
                    "listenHistory.timestamp": { $gte: sixHoursAgo }
                }
            },
            { $unwind: "$listenHistory" },
            {
                $match: {
                    "listenHistory.timestamp": { $gte: sixHoursAgo }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    singerId: { $first: "$singerId" },
                    totalListen: { $sum: "$listenHistory.count" },
                    listenByHour: {
                        $push: {
                            timestamp: "$listenHistory.timestamp",
                            count: "$listenHistory.count"
                        }
                    },
                    avatar: { $first: "$avatar" },
                    slug: { $first: "$slug" },
                }
            },
            { $sort: { totalListen: -1 } },
            { $limit: 3 },
            {
                $addFields: {
                    singerId: { $toObjectId: "$singerId" }
                }
            },
            {
                $lookup: {
                    from: "singers",
                    localField: "singerId",
                    foreignField: "_id",
                    as: "singer"
                }
            },
            { $unwind: "$singer" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    totalListen: 1,
                    listenByHour: 1,
                    "singer.fullName": 1,
                    "singer.avatar": 1,
                    avatar: 1,
                    slug: 1
                }
            }
        ]);
        res.status(200).json({
            message: "Top 3 most listened songs in the last 6 hours",
            data: topSongs
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getTop3 = getTop3;
