import { Router } from "express";
import passport from "passport";
import { getUser } from "../controllers/users.controller.js";

const UserRouter = Router()

UserRouter.get('/', passport.authenticate('jwt', {session: false}), getUser)

export default UserRouter