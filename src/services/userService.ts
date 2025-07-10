import bcrypt from "bcryptjs";
import { createRefreshToken, createToken } from "../config/jwt_config";
import shortid from "shortid";

class userService {
    private userRepository
    constructor(userRepository: any) {
        this.userRepository = userRepository
    }

    register = async (userData: any) => {
        try {
            const { name, password, confirmPassword, email } = userData;

            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const alreadyExistingUser = await this.userRepository.findByEmail(email);
            if (alreadyExistingUser) {
                throw new Error("Email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);


            const newUser = {
                ...userData,
                password: hashedPassword,
            };
            delete newUser.confirmPassword; // Remove confirmPassword before saving

            // 5. Save user
            const response = await this.userRepository.register(newUser);
            return response;
        } catch (error) {
            throw error;
        }
    };

    login = async (email: string, password: string) => {


        try {

            const userData = await this.userRepository.login(email);

            if (!userData) throw new Error("Email not found");

            const comparePassword = await bcrypt.compare(password, userData.password as string);
            if (!comparePassword) throw new Error("Wrong password");
            if (userData.isUserBlocked) throw new Error("User is blocked");
            const userToken = createToken(userData._id as string, process.env.USER_ROLE as string);
            const userRefreshToken = createRefreshToken(userData._id as string, process.env.USER_ROLE as string);
            return { userData, userToken, userRefreshToken }

        } catch (error) {
            throw error
        }
    };

    shortenUrl = async (originalUrl: string, userId: string) => {
        const existing = await this.userRepository.findUrlByOriginalAndUser(originalUrl, userId);
        if (existing) {
            return `${process.env.BASE_URL}/${existing.shortCode}`;
        }

        const shortCode = shortid.generate();
        const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

        const savedUrl = await this.userRepository.createShortUrl(originalUrl, shortCode, shortUrl, userId);

        return savedUrl.shortUrl;
    };

    fetchUserUrls = async (userId: string) => {
        return await this.userRepository.getUrlsByUserId(userId)
    };

    getOriginalUrlForUser = async (shortCode: string) => {
        const urlDoc = await this.userRepository.findUrlByShortCodeAndUser(shortCode);

        if (!urlDoc) {
            throw new Error("URL not found or unauthorized");
        }

        return urlDoc.originalUrl;
    };

}


export default userService;