import { uploadImage } from "../helpers/upToCloud";

export const upload = async (req, res, next) => {
    if(!req.file){
        return next();
    }
    const result = await uploadImage(req.file.buffer)
    // console.log(req.file)

    req.body[req.file.fieldname] = result
    next()
}