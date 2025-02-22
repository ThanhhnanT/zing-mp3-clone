import mongoose from "mongoose";
import uniqueSlug from "unique-slug";

const singerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
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
singerSchema.pre("save", function (next) {
    if (!this.slug && this.fullName) {
        this.slug = uniqueSlug(this.fullName); // Tạo slug từ fullName
    }
    next();
});

const Singer = mongoose.model("Singer", singerSchema, "singers");

export default Singer;
