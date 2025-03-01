import mongoose from "mongoose";
import uniqueSlug from "unique-slug"

const adminSchema = new mongoose.Schema(
    {
        fullName: String,
        avatar: String,
        gender: String,
        email: String,
        password: String,
        adminToken: String,
        slug: {
            type: String,
            unique: true
        },
        status: String,
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Admin = mongoose.model('admin', adminSchema, "admin")

// Middleware tạo slug trước khi lưu vào DB
adminSchema.pre("save", function (next) {
    if (!this.slug && this.fullName) {
        this.slug = uniqueSlug(this.fullName); // Tạo slug từ fullName
    }
    next();
});

export default Admin