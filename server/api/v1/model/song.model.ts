import mongoose from "mongoose";
import uniqueSlug from "unique-slug";

const songSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        singerId: String,
        topicId: String,
        like: Number,
        lyrics: String,
        audio: String,
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
    },
    {
        timestamps: true,
    }
);

// Middleware tạo slug trước khi lưu vào DB
songSchema.pre("save", function (next) {
    if (!this.slug && this.title) {
        this.slug = uniqueSlug(this.title); // Tạo slug từ fullName
    }
    next();
});

const Song = mongoose.model("Song", songSchema, "songs");

export default Song;
