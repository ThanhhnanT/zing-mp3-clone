import mongoose from "mongoose"

const settingSchema = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String,
        address: String,
        colorTheme: String,
        copyRight: String,
        avatar: String,
        icon: String,
    },
    {
        timestamps: true
    }
)

const ConfigPage = mongoose.model("config" ,settingSchema, "config")

export default ConfigPage