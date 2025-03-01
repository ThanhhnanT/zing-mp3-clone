import { Request, Response } from "express";
import Admin from "../../model/admin/admin.model";
export const login = async (req: Request, res: Response):Promise<void> => {
    try{
        // console.log(req.body)
        const {email} = req.body 
        const userInfor = await Admin.findOne(
            {
                email: email
            }
        )
        console.log(userInfor)
        res.cookie("adminToken", userInfor.adminToken)
        res.status(200).json(
            {
                message: "oke"
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