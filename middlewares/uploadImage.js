import multer from "multer";
import apiErrors from "../utils/apiErrors.js";

const uploadOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(new apiErrors("Not an image! Please upload only images"), false)
    }
  }
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload
};

const uploadSingleImage = (fieldName) => {
  return uploadOptions().single(fieldName);
};

const uploadMultipleImages = (fields) => {
  return uploadOptions().fields(fields);
};

export { uploadSingleImage, uploadMultipleImages };
