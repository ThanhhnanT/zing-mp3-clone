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
exports.createSong2 = exports.getTopic = exports.getSinger = exports.createSong = exports.changeStatus = exports.getSong = void 0;
const song_model_1 = __importDefault(require("../../model/song.model"));
const singers_model_1 = __importDefault(require("../../model/singers.model"));
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const getSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield song_model_1.default.find({
            deleted: false
        }).select("title avatar singerId topicId status slug ");
        const data = yield Promise.all(song.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const singer = yield singers_model_1.default.findOne({
                _id: item.singerId,
                deleted: false,
            }).select("fullName avatar");
            const topic = yield topics_model_1.default.findOne({
                _id: item.topicId,
                deleted: false
            }).select("title");
            return Object.assign(Object.assign({}, item.toObject()), { singer,
                topic });
        })));
        res.status(200).json({
            data: data
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.getSong = getSong;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield song_model_1.default.updateOne({
            _id: req.body.id
        }, {
            status: req.body.status == "active" ? "non-active" : "active"
        });
        res.status(200).json({
            message: "Change successfully"
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.changeStatus = changeStatus;
const createSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            avatar: req.files.avatar[0].path,
            audio: req.files.audio[0].path,
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.createSong = createSong;
const getSinger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allSinger = yield singers_model_1.default.find({
            deleted: false,
            status: "active"
        }).select("fullName");
        res.status(200).json({
            data: allSinger
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.getSinger = getSinger;
const getTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTopic = yield topics_model_1.default.find({
            deleted: false,
            status: "active"
        }).select("title");
        res.status(200).json({
            data: allTopic
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.getTopic = getTopic;
const createSong2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSong = new song_model_1.default(req.body);
        yield newSong.save();
        res.status(200).json({
            message: "ok"
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.createSong2 = createSong2;
