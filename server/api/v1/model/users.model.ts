import mongoose from 'mongoose'
import uniqueSlug from 'unique-slug'

const usersSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        avatar: String,
        gender: String,
        authToken: String,
        password: String,
        playlists: [{ playlistId: String, name: String }],
        followers: [{ userId: String }], // Danh sách người đang theo dõi
        following: [{ userId: String }], // Danh sách người theo dõi bạn
        recentlyPlayed: [{ songId: String, playedAt: Date }], // Danh sách nghe nhạc gần đây
        friendList:[ 
            {
                friendId: String,
                roomChat: String,
            }
        ],
        waitAcceptFriend:[
            {
                acceptFriendId: String
            }
        ],
        waitResponseFriend:[
            {
                responseFriendId: String,
            }
        ],
        likeSong:[
            {
                songId: String,
                singerId: String,
            }
        ],
        status: {
            type: String,
            default: "active"
        },
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
usersSchema.pre("save", function (next) {
    if (!this.slug && this.fullName) {
        const randomString = Math.random().toString(36).substring(2, 8); 
        this.slug = uniqueSlug(`${this.fullName}-${randomString}`);
    }
    next();
});

const Users = mongoose.model("users", usersSchema, "users");

export default Users;
