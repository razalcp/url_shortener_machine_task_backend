// import express from "express"
// import dotenv from "dotenv"
// import cookieParser from 'cookie-parser'
// import cors from "cors";
// import mongooseConnection from "./config/database_config";
// import userRouter from "./routes/userRoutes";
// const http = require('http');
// const app = express()
// app.use(cookieParser());

// dotenv.config();

// mongooseConnection();

// app.use(express.json());


// // app.use(
// //     cors({
// //         // origin: "http://localhost:1234",
// //         origin: "https://shortme-inky.vercel.app",
// //         methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
// //         credentials: true // Allow credentials (cookies, HTTP authentication)
// //     })
// // );
// app.use(
//   cors({
//     origin: [
//       "https://shortme-inky.vercel.app",
//       "https://shortme-j97fksm41-cprazalnazim-gmailcoms-projects.vercel.app",
//       "https://shortme-git-master-cprazalnazim-gmailcoms-projects.vercel.app"
//     ],
//     credentials: true
//   })
// );

// app.use("/", userRouter);

// const server = http.createServer(app);

// const PORT = process.env.PORT;

// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongooseConnection from "./config/database_config"
import userRouter from "./routes/userRoutes"
const http = require("http")

dotenv.config()
const app = express()
app.set("trust proxy", 1);
// ✅ 1. Set up CORS FIRST
app.use(
    cors({
        origin: [
            "https://shortme-inky.vercel.app",
            "https://shortme-j97fksm41-cprazalnazim-gmailcoms-projects.vercel.app",
            "https://shortme-git-master-cprazalnazim-gmailcoms-projects.vercel.app"
        ],
        credentials: true
    })
)

// ✅ 2. Then other middleware
app.use(cookieParser())
app.use(express.json())

// ✅ 3. Then DB & routes
mongooseConnection()
app.use("/", userRouter)

const server = http.createServer(app)
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
