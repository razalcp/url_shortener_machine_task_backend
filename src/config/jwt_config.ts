// import jwt from 'jsonwebtoken'
// import dotenv from 'dotenv';
// dotenv.config();

// const secret_key = process.env.jwt_secret as string;
// const accessTokenTime = process.env.Access_Token_Expirey_Time as string;
// const refreshTokenTime = process.env.Refresh_Token_Expirey_Time as string;

// const createToken = (user_id: string, role: string): string => {
//     return jwt.sign({ user_id, role }, secret_key, { expiresIn: accessTokenTime });

// };

// const createRefreshToken = (user_id: string, role: string): string => {
//     return jwt.sign({ user_id, role }, secret_key, { expiresIn: refreshTokenTime });
// };

// export { createToken, createRefreshToken }

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secret_key = process.env.JWT_SECRET || 'default_secret'
const accessTokenTime = process.env.ACCESS_TOKEN_EXPIREY_TIME || '1h'
const refreshTokenTime = process.env.REFRESH_TOKEN_EXPIREY_TIME || '7d'

const createToken = (user_id: string, role: string): string => {
  return jwt.sign({ user_id, role }, secret_key, { expiresIn: accessTokenTime })
}

const createRefreshToken = (user_id: string, role: string): string => {
  return jwt.sign({ user_id, role }, secret_key, { expiresIn: refreshTokenTime })
}

export { createToken, createRefreshToken }
