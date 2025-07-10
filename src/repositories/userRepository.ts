import urlModel from "../models/user/urlModel";

class userRepository {
  private userModel;
  constructor(userModel: any) {
    this.userModel = userModel
  }
  findByEmail = async (email: string) => {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  };

  register = async (userData: any) => {
    try {
      return await this.userModel.create(userData);
    } catch (error) {
      throw error;
    }
  };


  login = async (email: string) => {
    try {
      const singleUser = await this.userModel.findOne({ email })
      if (singleUser) {
        return singleUser;
      } else {
        throw new Error("User not found")
      }

    } catch (error) {
      throw error
    }
  };

  findUrlByOriginalAndUser = async (originalUrl: string, userId: string) => {
    return await urlModel.findOne({ originalUrl, userId });
  };

  createShortUrl = async (originalUrl: string, shortCode: string, shortUrl: string, userId: string) => {
    const newUrl = new urlModel({
      originalUrl,
      shortCode,
      shortUrl,
      userId,
    });
    return await newUrl.save();
  };



  getUrlsByUserId = async (userId: string) => {
    return await urlModel.find({ userId }).sort({ createdAt: -1 })
  }

  findUrlByShortCodeAndUser = async (shortCode: string, userId: string) => {
    return await urlModel.findOne({ shortCode, userId });
  };
}


export default userRepository;