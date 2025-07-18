// middleware/multer.js
import multer from "multer";

const storage = multer.memoryStorage(); // in-memory file storage
const upload = multer({ storage });

export default upload;
