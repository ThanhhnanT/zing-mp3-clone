import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Hàm upload sử dụng Stream
const streamUpload = (buffer: Buffer): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Hàm upload ảnh chính
export const uploadImage = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await streamUpload(buffer);
    // console.log(result);
    return result.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Upload to Cloudinary failed");
  }
};
