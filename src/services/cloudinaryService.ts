import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResult = { secure_url: string; [key: string]: any };

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResult);
      }
    );
    uploadStream.end(buffer);
  });
};

// utils.ts

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const fileWithExtension = parts[parts.length - 1];
    const publicId = fileWithExtension.substring(
      0,
      fileWithExtension.lastIndexOf(".")
    ); // Remove extension
    const folderPath = parts.slice(parts.length - 2, parts.length - 1)[0]; // e.g., profile_pictures
    return `${folderPath}/${publicId}`;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  if (!publicId) {
    throw new Error('Public ID is required for image deletion');
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary deletion error:', error);
        return reject(new Error(`Failed to delete image: ${error.message}`));
      }
      
      if (!result) {
        console.error('No result returned from Cloudinary');
        return reject(new Error('No response from Cloudinary'));
      }

      if (result.result !== "ok") {
        console.error('Cloudinary deletion failed:', result);
        return reject(new Error(`Failed to delete image: ${result.result}`));
      }
      
      resolve();
    });
  });
};
