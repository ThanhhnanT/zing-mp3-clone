import { Request, Response } from "express"
import Users from "../../model/users.model"
import { random } from "../../helpers/randomNumber"
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import OTP from "../../model/otp.model"
import * as mail from "../../helpers/sendMail"
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne(
            {
                email: email,
                deleted: false,
                status: 'active'
            }
        )
        if (!user) {
            res.status(404).json(
                {
                    message: "Sai email hoặc mật khẩu"
                }
            )
            return
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
            return;
        }
        res.cookie("authToken", user.authToken);
        res.status(200).json(
            {
                message: "Login Successfully"
            }
        )
    } catch (e) {
        res.status(404).json(
            {
                error: e.message
            }
        )
    }
}

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName, gender } = req.body
        const user = await Users.findOne(
            {
                email: email,
                deleted: false,
                status: "active",
            }
        )
        if (user) {
            res.status(400).json(
                {
                    message: "Email đã tồn tại"
                }
            )
            return
        }
        // Mã hóa mật khẩu
        const passwordMH = await bcrypt.hash(password, 10)

        // Jwt tạo token
        const authToken = jwt.sign({ email }, process.env.JWT_SECRET)

        // Lưu vào database
        const newUser = {
            email: email,
            fullName: fullName,
            password: passwordMH,
            authToken: authToken,
            gender: gender,
        }
        res.cookie("authToken", authToken)
        const saveUser = new Users(newUser)
        await saveUser.save()
        res.status(200).json(
            {
                saveUser: saveUser,
                message: "ok"
            }
        )
    } catch (e) {
        res.status(404).json(
            {
                message: e.message
            }
        )
    }
}

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body
        const user = await Users.findOne(
            {
                email: email,
                deleted: false,
                status: 'active'
            }
        )
        if (!user) {
            res.status(400).json(
                { message: "Email không tồn tại" }
            )
            return
        }
        const otp = random(4)
        const modelOTP = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        }

        const saveOTP = new OTP(modelOTP)
        await saveOTP.save()

        mail.sendMail(email, "Xác thực OTP", `Mã OTP của bạn là: ${otp}`)
        res.status(200).json(
            {
                message: "Send Successfully"
            }
        )
    } catch (e) {
        res.status(404).json(
            {
                message: e.message
            }
        )
        return
    }
}

export const receiveOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body
        const checkOTP = await OTP.findOne(
            {
                email: email,
                otp: otp
            }
        )

        if (!checkOTP) {
            res.status(400).json(
                {
                    message: "Mã OTP không chính xác"
                }
            )
            return
        }

        res.status(200).json(
            {
                message: "Xác minh OTP thành công"
            }
        )
    } catch (e) {
        res.status(400).json(
            {
                message: e.message
            }
        )
    }

}

export const resetPass = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne(
            {
                email: email,
                status: "active",
                deleted: false
            }
        )
        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.updateOne(
            {
                email: email,
                status: "active",
                deleted: false
            },
            {
                password: hashedPassword
            }
        )
        res.cookie("authToken", user.authToken)
        res.status(200).json(
            {
                message: "Cập nhật mật khẩu mới thành công"
            }
        )
    } catch(e) {
        res.status(400).json(
            {
                message: e.message
            }
        )
    }
}

export const infor = async (req: Request, res: Response): Promise<void> => {
    try{
        const user = await Users.findOne(
            {
                authToken: req.cookies.authToken
            }
        ).select("fullName email avatar playlist")
        if(!user){
            res.status(400).json(
                {
                    message: ""
                }
            )
            return
        }
        res.status(200).json(
            {
                data: user
            }
        )
    } catch(e) {
        res.status(400).json(
            {
                message: e.message
            }
        )
    }
}

export const upAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
        // const userId = req.user.id; // Lấy ID user từ token (nếu có xác thực)
        const avatarUrl = req.body.avatar; // URL ảnh từ middleware Cloudinary
        console.log(avatarUrl)
        // // Cập nhật avatar vào database
        // await UserModel.findByIdAndUpdate(userId, { avatar: avatarUrl });

        res.json({ message: "Cập nhật avatar thành công!", avatar: avatarUrl });
    } catch (error) {
        console.error("Lỗi cập nhật avatar:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
}

export const changeInfor = async (req: Request, res: Response): Promise<void> => {
    try {
        // Lấy thông tin user từ token (nếu có middleware xác thực, nên lấy từ req.user)
        const user = await Users.findOne({ authToken: req.cookies.authToken });
        if (!user) {
            res.status(404).json({ message: "Người dùng không tồn tại!" });
            return;
        }

        // Cập nhật thông tin user
        const updatedUser = await Users.updateOne(
            { _id: user._id },
            { $set: req.body }
        );

        // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
        
        if (updatedUser.modifiedCount === 0) {
            res.status(400).json({ message: "Không có thông tin nào được cập nhật!" });
            return;
        }

        res.status(200).json({ message: "Cập nhật thông tin thành công!" });
    } catch (e) {
        res.status(500).json({ message: `Lỗi cập nhật thông tin: ${e.message}` });
    }
};