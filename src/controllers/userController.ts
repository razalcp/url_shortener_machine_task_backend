import { Request, Response } from "express";
import HTTP_statusCode from "../enums/httpStatusCode";

class userController {
    private userService
    constructor(userService: any) {
        this.userService = userService
    }

    register = async (req: Request, res: Response) => {
        try {
            const { data } = req.body

            await this.userService.register(data);
            res.status(HTTP_statusCode.OK).send("registration successful");
        } catch (error: any) {
            if (error.message === "Email already exists") {
                res
                    .status(HTTP_statusCode.Conflict)
                    .json({ message: "Email already exists" });
            } else {
                res
                    .status(HTTP_statusCode.InternalServerError)
                    .json({ message: "Something wrong please try again later" });
            }


        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const serviceResponse = await this.userService.login(email, password);
            res.cookie("debug", "set", {
                httpOnly: false,
                sameSite: "none",
                secure: true
            });


            res.cookie("UserRefreshToken", serviceResponse.userRefreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.cookie("UserAccessToken", serviceResponse.userToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 48 * 60 * 60 * 1000,
            });

            res.json({ userData: serviceResponse.userData });
        } catch (error: any) {
            if (error.message === "Email not found") {
                res.status(HTTP_statusCode.NotFound).json({ message: "Email not found" });
            } else if (error.message === "Wrong password") {
                res.status(HTTP_statusCode.Unauthorized).json({ message: "Wrong password" });
            } else {
                res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
            };
        };
    }

    handleShortenUrl = async (req: Request, res: Response) => {
        const { originalUrl, userId } = req.body;

        if (!originalUrl || !originalUrl.startsWith("http")) {
            res.status(400).json({ message: "Invalid or missing URL" });
        }

        try {
            const shortUrl = await this.userService.shortenUrl(originalUrl, userId);
            res.status(201).json({ shortUrl });
        } catch (err) {
            console.error("Error shortening URL:", err);
            res.status(500).json({ message: "Server error" });
        }
    };

    getUserUrls = async (req: Request, res: Response) => {
        try {

            const userId = req.query.userId as string

            if (!userId) {
                res.status(400).json({ message: "Missing userId" })
            }

            const urls = await this.userService.fetchUserUrls(userId)

            res.status(200).json({ urls })
        } catch (error) {
            console.error("Error fetching user URLs:", error)
            res.status(500).json({ message: "Server error" })
        }
    };


    handleRedirect = async (req: Request, res: Response) => {
        const { shortCode } = req.params;
        const userId = req.user?.user_id

        if (!userId || typeof userId !== "string") {
            res.status(400).json({ message: "userId is required" });
        }

        try {
            const originalUrl = await this.userService.getOriginalUrlForUser(shortCode, userId);
            res.redirect(originalUrl);
        } catch (err) {
            console.error("Redirect error:", err);
            res.status(404).json({ message: "Short URL not found or unauthorized" });
        }
    };


    logoutUser = async (req: Request, res: Response) => {

        try {
            res.clearCookie("UserAccessToken", { httpOnly: true, secure: true, sameSite: 'none' });
            res.clearCookie("UserRefreshToken", { httpOnly: true, secure: true, sameSite: 'none' });
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something went wrong", error });
        }
    };

}




export default userController;