import express from "express";
import { download, emailDownload} from "../controllers/downloadControllers";
import { protect } from "../controllers/authController";


const router = express.Router();


router.get("/download/:filename",  download);
router.post("/emailDownload/:filename", emailDownload);



export default router;
