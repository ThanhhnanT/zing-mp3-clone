import { Request, Response } from "express"
import Song from "../../model/song.model"
import Singer from "../../model/singers.model"
import { slugSearch } from "../../helpers/searchSlug"

export const search = async (req: Request, res: Response): Promise<void> => {
    try{
        let { keyword } = req.body;
        if (!keyword || typeof keyword !== "string"){
            res.status(400).json({ message: "Invalid keyword" });
            return;
        } 
        
        let slug = slugSearch(keyword);
        keyword = new RegExp(keyword, "i"); 
        let slugReg = new RegExp(slug, "i"); 
        
        const result = await Song.find({
            $or: [
                { title: keyword },
                { slug: slugReg }
            ]
        }).select("title avatar singerId slug");

        if(!result) {
            res.status(404).json(
                {
                    message: "Không tồn tại bài hát"
                }
            )
        }
        
        const data = await Promise.all(
            result.map(async (item) => {
                const singerIds = Array.isArray(item.singerId) ? item.singerId : [item.singerId];
                const singers = await Singer.find({ _id: { $in: singerIds } }).select("fullName");
        
                return { ...item.toObject(), listSinger: singers };
            })
        );
        res.status(200).json(
            {
                data: data
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