import { Router } from "express"
import { login, logout, getMe, refreshToken , changePassword} from "../controllers/auth.controllers"
import { requireAuth } from "../middlewares/requireAuth"
import { verifyAccessToken } from "../utils/auth"
import { requireOwnershipOrRole } from "../middlewares/ownership"

const router = Router()
router.post("/login", login)
router.post("/refresh", refreshToken)
router.post("/logout", logout)
router.get('/me',requireAuth,getMe);
router.put('/change-password',verifyAccessToken ,changePassword)


export default router
