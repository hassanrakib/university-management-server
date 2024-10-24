import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import { promises as fs } from 'fs';

// Configuration
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = async (imageName: string, path: string) => {
    // Upload an image
    const { secure_url: profile_img_url } = await cloudinary.uploader.upload(path, {
        public_id: imageName,
    });

    // delete the image from server's local storage
    await fs.unlink(path);

    // finally return profile image url that you get after everything goes well
    return profile_img_url;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

export const upload = multer({ storage: storage });
