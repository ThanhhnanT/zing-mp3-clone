import cloudinary from "./cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Hàm xác định loại file dựa vào mimetype
const getResourceType = (mimetype: string): "image" | "video" | "raw" => {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("video/")) return "video";
    return "raw"; // Mặc định là raw (dành cho audio hoặc file khác)
};

// Hàm tạo storage động
const createStorage = (folder: string) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            const resourceType = getResourceType(file.mimetype);
            return {
                folder,
                resource_type: resourceType,
                format: resourceType === "image" ? "png" : "mp3",
                public_id: `upload-${Date.now()}`,
                transformation: resourceType === "image" ? [{ width: 500, height: 500, crop: "limit" }] : undefined,
            };
        },
    });
};

// Khởi tạo multer với storage chung
const upload = multer({
    storage: createStorage("Uploads"),
});

// Middleware upload nhiều field
const uploadFields = upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]);

export { uploadFields };
