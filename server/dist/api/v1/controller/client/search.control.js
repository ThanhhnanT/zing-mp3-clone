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
exports.search = void 0;
const song_model_1 = __importDefault(require("../../model/song.model"));
const singers_model_1 = __importDefault(require("../../model/singers.model"));
const searchSlug_1 = require("../../helpers/searchSlug");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { keyword } = req.body;
        if (!keyword || typeof keyword !== "string") {
            res.status(400).json({ message: "Invalid keyword" });
            return;
        }
        let slug = (0, searchSlug_1.slugSearch)(keyword);
        keyword = new RegExp(keyword, "i");
        let slugReg = new RegExp(slug, "i");
        const result = yield song_model_1.default.find({
            $or: [
                { title: keyword },
                { slug: slugReg }
            ]
        }).select("title avatar singerId slug");
        if (!result) {
            res.status(404).json({
                message: "Không tồn tại bài hát"
            });
        }
        const data = yield Promise.all(result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const singerIds = Array.isArray(item.singerId) ? item.singerId : [item.singerId];
            const singers = yield singers_model_1.default.find({ _id: { $in: singerIds } }).select("fullName");
            return Object.assign(Object.assign({}, item.toObject()), { listSinger: singers });
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
exports.search = search;
