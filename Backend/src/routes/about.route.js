import {Router} from "express"
import { addOrUpdateAboutSection, addOrUpdateTeamMember, getAbout } from "../controllers/about.controller.js"
import { upload } from "../middlewares/multer.js"

const router = Router()

router.post("/member", upload.single("image"), addOrUpdateTeamMember)
router.post("/content", addOrUpdateAboutSection)
router.get("/", getAbout)

export default router