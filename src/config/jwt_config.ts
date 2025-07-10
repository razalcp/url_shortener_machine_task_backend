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

import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import type { StringValue } from 'ms'  

dotenv.config()

const secret_key: Secret = process.env.JWT_SECRET || 'default_secret'


const accessTokenTime = (process.env.ACCESS_TOKEN_EXPIREY_TIME || '15m') as StringValue
const refreshTokenTime = (process.env.REFRESH_TOKEN_EXPIREY_TIME || '7d') as StringValue

const createToken = (user_id: string, role: string): string => {
  const payload = { user_id, role }
  const options: SignOptions = { expiresIn: accessTokenTime }

  return jwt.sign(payload, secret_key, options)
}

const createRefreshToken = (user_id: string, role: string): string => {
  const payload = { user_id, role }
  const options: SignOptions = { expiresIn: refreshTokenTime }

  return jwt.sign(payload, secret_key, options)
}

export { createToken, createRefreshToken }
