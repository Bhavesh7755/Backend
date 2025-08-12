import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;  //if path is not found then return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary",
            response.url
        );
        return response;   //returning the response to the user
    } catch (error) {
        fs.unlinkedSync(localFilePath) //if error occurs then delete the file from local storage. or remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary };