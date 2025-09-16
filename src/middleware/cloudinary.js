import { v2 as cloudinary } from "cloudinary"
import fs from 'fs'


export default cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return console.log("path not found");
        //upload file on cloudinary
        const response = cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        //file is uploaded
        console.log("file is uploaded", response);
        return response

    } catch (error) {

        fs.unlinkSync(filePath) // remove the file which saved in temporary 
        return null
    }

}