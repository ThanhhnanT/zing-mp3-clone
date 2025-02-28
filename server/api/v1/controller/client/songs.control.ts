import { Request, Response } from 'express';
import Topic from '../../model/topics.model';
import Song from '../../model/song.model';
import Singer from '../../model/singers.model'
import moment from "moment"

export const getSongs = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug: String = req.params.slugSong
        const song = await Song.findOne(
            {
                slug: slug,
                deleted: false,
                status: "active"
            }
        ).select('title avatar description singerId topicId like lyrics audio listen')

        const singerId = song.singerId
        const singer = await Singer.findOne(
            {
                _id: singerId,
                deleted: false,
                status: 'active'
            }
        ).select(' fullName avatar')
        const topicId = song.topicId
        const topic = await Topic.findOne(
            {
                _id: topicId,
                deleted: false,
                status: 'active'
            }
        ).select('title')
        res.status(200).json(
            {
                song: song,
                singer: singer,
                topic: topic
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

export const addListen = async (req:Request, res: Response):Promise<void> => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ message: "Missing song ID" });
            return;
        }
        const currentHour = moment().format("DD:MM:YYYY HH:00")
        const song = await Song.findById(id);
        if (!song) {
            res.status(404).json({ message: "Song not found" });
            return;
        }
        const hourEntry = song.listenHistory.find(entry => entry.timestamp == currentHour)
        if(hourEntry){
            hourEntry.count += 1
        }
        else{
            song.listenHistory.push(
                {
                    timestamp: currentHour,
                    count: 1
                }
            )
        }
        song.listen +=1;
        await song.save()

        res.status(200).json({ message: "Listen count updated", song: song });
    } catch (error) {
        console.error("Error updating listen count:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const getTop3 = async (req:Request, res:Response):Promise<void> => {
    try {
        // Lấy thời gian 6 giờ trước
        const sixHoursAgo = moment().subtract(-1, "hours").format("YYYY-MM-DD HH:00:00");

        // Lấy danh sách top 3 bài hát
        const topSongs = await Song.aggregate([
            {
                $match: {
                    "listenHistory.timestamp": { $gte: sixHoursAgo }
                }
            },
            { $unwind: "$listenHistory" },
            {
                $match: {
                    "listenHistory.timestamp": { $gte: sixHoursAgo }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    singerId: { $first: "$singerId" },
                    totalListen: { $sum: "$listenHistory.count" },
                    listenByHour: {
                        $push: {
                            timestamp: "$listenHistory.timestamp",
                            count: "$listenHistory.count"
                        }
                    },
                    avatar: { $first: "$avatar" },
                    slug: { $first: "$slug" },
                    
                }
            },
            { $sort: { totalListen: -1 } },
            { $limit: 3 },
            // 🔥 Chuyển singerId thành ObjectId
            {
                $addFields: {
                    singerId: { $toObjectId: "$singerId" } // Chuyển từ String sang ObjectId
                }
            },
            {
                $lookup: {
                    from: "singers",
                    localField: "singerId",
                    foreignField: "_id",
                    as: "singer"
                }
            },
            { $unwind: "$singer" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    totalListen: 1,
                    listenByHour: 1,
                    "singer.fullName": 1,
                    "singer.avatar": 1,
                    avatar: 1,
                    slug: 1
                }
            }
        ]);
        

        res.status(200).json({
            message: "Top 3 most listened songs in the last 6 hours",
            data: topSongs
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}