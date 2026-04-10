const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const DEFAULT_FOLDER = process.env.CLOUDINARY_FOLDER || "civil-web";

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => {
		const baseUrl = (req.baseUrl || "").replace("/api/", "").replace(/\//g, "-");
		const folderSuffix = baseUrl ? `/${baseUrl}` : "";

		return {
			folder: `${DEFAULT_FOLDER}${folderSuffix}`,
			resource_type: "image",
			allowed_formats: ["jpg", "jpeg", "png", "webp"],
			transformation: [{ fetch_format: "auto", quality: "auto" }],
		};
	},
});

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const fileFilter = (req, file, cb) => {
	if (allowedMimeTypes.has(file.mimetype)) {
		cb(null, true);
		return;
	}

	const error = new Error("Only JPEG, PNG, or WebP images are allowed");
	error.statusCode = 400;
	cb(error);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

module.exports = upload;
