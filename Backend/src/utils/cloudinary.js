import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const aboutFolder = "beyond-the-margin/about"

// Upload File on Cloudinary inside a specified folder
const uploadOnCloudinary = async (localFilepath) => {
    try {
        if (!localFilepath) return null

        // Upload File to Cloudinary
        const response = await cloudinary.uploader.upload(localFilepath, {
            aboutFolder,
            resource_type: "image"
        });

        // console.log(`File uploaded to ${folder}!! URL: `, response.url);
        fs.unlinkSync(localFilepath);

        return response;
    } catch (error) {
        console.error("Upload failed:", error);
        fs.unlinkSync(localFilepath);
        return null;
    }
}

// Delete File from Cloudinary
const deleteFromCloudinary = async (url) => {
    const parts = url.split("/")
    const fileNameWithExt = parts[parts.length - 1]

    const [public_id, ext] = fileNameWithExt.split(".")

    const response = await cloudinary.uploader.destroy(
        `beyond-the-margin/about/${public_id}`,
        { resource_type: "image" }
    );

    // if (response.result === "ok") console.log("✅ File deleted:", public_id)
    // if (response.result === "not found") console.log("⚠️ File not found")
    return response
};

export { uploadOnCloudinary, deleteFromCloudinary }