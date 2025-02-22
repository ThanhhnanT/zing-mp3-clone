import { Request, Response } from 'express';
import Topic from '../../model/topics.model';
import Song from '../../model/song.model';
import Singer from '../../model/singers.model'
export const getSongs = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug: String = req.params.slugSong
        const song = await Song.findOne(
            {
                slug: slug,
                deleted: false,
                status: "active"
            }
        ).select('title avatar description singerId topicId like lyrics audio')

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