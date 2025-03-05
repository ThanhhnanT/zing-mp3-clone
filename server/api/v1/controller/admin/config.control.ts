import { Request, Response } from "express"
import ConfigPage from "../../model/admin/configPage.model"

export const setConfig = async (req: Request, res: Response):Promise<void> => {
    try{
        const config = await ConfigPage.findOne({})
        if (!config){
            const newConfig = new ConfigPage(req.body)
            newConfig.save()
            res.status(200).json(
                {
                    message: "ok"
                }
            )
            return
        }
        await ConfigPage.updateOne(
            {
                _id: config.id
            },
            req.body
        )
        res.status(200).json(
            {
                message: "Ok"
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

export const getConfig = async (req:Request, res:Response):Promise<void> => {
    try{
        const config = await ConfigPage.findOne({}).select("avatar colorTheme icon")
        if(!config){
            res.status(404).json(
                {
                    message: "Not Found"
                }
            )
            return
        }
        res.status(200).json(
            {
                config: config
            }
        )
        return
    } catch(e) {
        res.status(400).json(
            {
                message: e.message
            }
        )
    }
}