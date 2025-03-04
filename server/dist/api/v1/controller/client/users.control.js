"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.changeInfor = exports.upAvatar = exports.infor = exports.resetPass = exports.receiveOTP = exports.sendOTP = exports.register = exports.login = void 0;
const users_model_1 = __importDefault(require("../../model/users.model"));
const randomNumber_1 = require("../../helpers/randomNumber");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const otp_model_1 = __importDefault(require("../../model/otp.model"));
const mail = __importStar(require("../../helpers/sendMail"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield users_model_1.default.findOne({
            email: email,
            deleted: false,
            status: 'active'
        });
        if (!user) {
            res.status(404).json({
                message: "Sai email hoặc mật khẩu"
            });
            return;
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
            return;
        }
        res.cookie("authToken", user.authToken);
        res.status(200).json({
            message: "Login Successfully"
        });
    }
    catch (e) {
        res.status(404).json({
            error: e.message
        });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullName, gender } = req.body;
        const user = yield users_model_1.default.findOne({
            email: email,
            deleted: false,
            status: "active",
        });
        if (user) {
            res.status(400).json({
                message: "Email đã tồn tại"
            });
            return;
        }
        const passwordMH = yield bcrypt.hash(password, 10);
        const authToken = jwt.sign({ email }, process.env.JWT_SECRET);
        const newUser = {
            email: email,
            fullName: fullName,
            password: passwordMH,
            authToken: authToken,
            gender: gender,
        };
        res.cookie("authToken", authToken);
        const saveUser = new users_model_1.default(newUser);
        yield saveUser.save();
        res.status(200).json({
            saveUser: saveUser,
            message: "ok"
        });
    }
    catch (e) {
        res.status(404).json({
            message: e.message
        });
    }
});
exports.register = register;
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield users_model_1.default.findOne({
            email: email,
            deleted: false,
            status: 'active'
        });
        if (!user) {
            res.status(400).json({ message: "Email không tồn tại" });
            return;
        }
        const otp = (0, randomNumber_1.random)(4);
        const modelOTP = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        };
        const saveOTP = new otp_model_1.default(modelOTP);
        yield saveOTP.save();
        mail.sendMail(email, "Xác thực OTP", `Mã OTP của bạn là: ${otp}`);
        res.status(200).json({
            message: "Send Successfully"
        });
    }
    catch (e) {
        res.status(404).json({
            message: e.message
        });
        return;
    }
});
exports.sendOTP = sendOTP;
const receiveOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const checkOTP = yield otp_model_1.default.findOne({
            email: email,
            otp: otp
        });
        if (!checkOTP) {
            res.status(400).json({
                message: "Mã OTP không chính xác"
            });
            return;
        }
        res.status(200).json({
            message: "Xác minh OTP thành công"
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.receiveOTP = receiveOTP;
const resetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield users_model_1.default.findOne({
            email: email,
            status: "active",
            deleted: false
        });
        const hashedPassword = yield bcrypt.hash(password, 10);
        yield users_model_1.default.updateOne({
            email: email,
            status: "active",
            deleted: false
        }, {
            password: hashedPassword
        });
        res.cookie("authToken", user.authToken);
        res.status(200).json({
            message: "Cập nhật mật khẩu mới thành công"
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.resetPass = resetPass;
const infor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_model_1.default.findOne({
            authToken: req.cookies.authToken
        }).select("fullName email avatar playlist");
        if (!user) {
            res.status(400).json({
                message: ""
            });
            return;
        }
        res.status(200).json({
            data: user
        });
    }
    catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});
exports.infor = infor;
const upAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const avatarUrl = req.body.avatar;
        console.log(avatarUrl);
        res.json({ message: "Cập nhật avatar thành công!", avatar: avatarUrl });
    }
    catch (error) {
        console.error("Lỗi cập nhật avatar:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});
exports.upAvatar = upAvatar;
const changeInfor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_model_1.default.findOne({ authToken: req.cookies.authToken });
        if (!user) {
            res.status(404).json({ message: "Người dùng không tồn tại!" });
            return;
        }
        const updatedUser = yield users_model_1.default.updateOne({ _id: user._id }, { $set: req.body });
        if (updatedUser.modifiedCount === 0) {
            res.status(400).json({ message: "Không có thông tin nào được cập nhật!" });
            return;
        }
        res.status(200).json({ message: "Cập nhật thông tin thành công!" });
    }
    catch (e) {
        res.status(500).json({ message: `Lỗi cập nhật thông tin: ${e.message}` });
    }
});
exports.changeInfor = changeInfor;
