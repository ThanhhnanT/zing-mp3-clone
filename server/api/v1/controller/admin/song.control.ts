import { Request, Response } from "express"
import Song from "../../model/song.model"
import Singer from "../../model/singers.model"
import Topic from "../../model/topics.model"

export const getSong = async (req: Request, res: Response):Promise<void> => {
    try{
        const song = await Song.find(
            {
                deleted: false
            }
        ).select("title avatar singerId topicId status slug ") 
        const data =await Promise.all(
            song.map(async (item) => {
                const singer = await Singer.findOne(
                    {
                        _id:item.singerId,
                        deleted: false,
                    }
                ).select("fullName avatar")
                const topic = await Topic.findOne(
                    {
                        _id: item.topicId,
                        deleted: false
                    }
                ).select("title")
                return {
                    ...item.toObject(), 
                    singer,
                    topic
                }
            }) 
        )
        res.status(200).json(
            {
                data: data
            }
        )

    } catch(e){
        res.status(400).json(
            {
                message: e.message
            }
        )
    }
}

export const changeStatus = async (req: Request, res:Response):Promise<void> => {
    try{
        await Song.updateOne(
            {
                _id: req.body.id
            },
            {
                status : req.body.status == "active" ? "non-active" : "active"
            }
        )
        res.status(200).json(
            {
                message: "Change successfully"
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

export const createSong = async (req, res: Response):Promise<void> => {
    try{
        res.status(200).json(
            {
                avatar: req.files.avatar[0].path,
                audio: req.files.audio[0].path,
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

export const getSinger = async (req: Request, res: Response): Promise<void> => {
    try{
        const allSinger = await Singer.find(
            {
                deleted: false,
                status: "active"
            }
        ).select("fullName")

        res.status(200).json(
            {
                data: allSinger
            }
        )

    } catch(e){
        res.status(400).json(
            {
                message: e.message
            }
        )
    }
}

export const getTopic= async (req: Request, res: Response): Promise<void> => {
    try{
        const allTopic = await Topic.find(
            {
                deleted: false,
                status: "active"
            }
        ).select("title")

        res.status(200).json(
            {
                data: allTopic
            }
        )

    } catch(e){
        res.status(400).json(
            {
                message: e.message
            }
        )
    }
}

export const createSong2 = async (req: Request, res: Response): Promise<void> => {
    try{
        const newSong = new Song(req.body);
        await newSong.save()
        res.status(200).json(
            {
                message: "ok"
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