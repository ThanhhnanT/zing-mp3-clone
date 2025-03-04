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
exports.uploadFields = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const getResourceType = (mimetype) => {
    if (mimetype.startsWith("image/"))
        return "image";
    if (mimetype.startsWith("video/"))
        return "video";
    return "raw";
};
const createStorage = (folder) => {
    return new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.default,
        params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
            const resourceType = getResourceType(file.mimetype);
            return {
                folder,
                resource_type: resourceType,
                format: resourceType === "image" ? "png" : "mp3",
                public_id: `upload-${Date.now()}`,
                transformation: resourceType === "image" ? [{ width: 500, height: 500, crop: "limit" }] : undefined,
            };
        }),
    });
};
const upload = (0, multer_1.default)({
    storage: createStorage("Uploads"),
});
const uploadFields = upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]);
exports.uploadFields = uploadFields;
