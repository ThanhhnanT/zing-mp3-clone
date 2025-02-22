import Topic from "../../model/topics.model";
import Song from "../../model/song.model";
import Singer from "../../model/singers.model";
import {Request, Response} from "express";

interface SongData {
    title?: string;
    avatar?: string;
    singerId?: string;
    like?: number;
    singer?: string;
}
export const getTopics = async (req:Request, res: Response) => {
    try{
        const topic = await Topic.find(
            {
                deleted: false
            }
        )

        res.status(200).json(
            {
                code:200,
                message: "Get successfully",
                data: topic
            }
        )
    } catch(e){
        res.status(500).json({
            code: 500,
            message: "Get failed",
            error: e.message
        });
    }
}

export const getSongTopics = async (req: Request, res: Response): Promise<void> => {
    try {
        const songTopic = await Topic.findOne({
            slug: req.params.slugSongTopic,
            deleted: false,
            status: "active",
        }).select("_id title avatar description");

        if (!songTopic) {
            res.status(404).json({ code: 404, message: "Topic not found" });
            return;
        }

        const songs = await Song.find({
            topicId: songTopic._id, // Sửa songTopic.id thành songTopic._id
            deleted: false,
            status: "active",
        }).select("title avatar singerId like slug");

        // Convert Mongoose Documents -> Plain Objects để có thể chỉnh sửa
        const itemSong: SongData[] = songs.map((song) => song.toObject());

        for (const item of itemSong) {
            const singer = await Singer.findOne({
                _id: item.singerId,
                deleted: false,
                status: "active",
            }).select("fullName");

            if (singer) {
                item.singer = singer.fullName; 
            }
        }

        res.status(200).json({
            code: 200,
            topic: songTopic,
            song: itemSong,
        });
    } catch (e: any) {
        res.status(400).json({ code: 400, message: e.message });
    }
};