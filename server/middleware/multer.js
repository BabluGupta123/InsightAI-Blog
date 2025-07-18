// middleware/multer.js
import multer from "multer";

const storage = multer.memoryStorage(); // store in memory, not filesystem
const upload = multer({ storage });

export default upload;
