import UserController from "../controllers/userController";
import UserService from "../services/userService";
import UserRepository from "../repositories/userRepository";
import express from "express";
import { Router } from "express"
import UserModel from "../models/user/userModel";
import authMiddleware from "../middlewares/authMiddleware";
const userReprository = new UserRepository(UserModel);
const userService = new UserService(userReprository as any);
const userController = new UserController(userService);
const router = express.Router();

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/shorten', authMiddleware, userController.handleShortenUrl)
router.get("/urls", authMiddleware, userController.getUserUrls)
router.get("/:shortCode", userController.handleRedirect);
router.post('/userLogout', userController.logoutUser)

export default router