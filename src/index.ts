import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from "cors";
import mongooseConnection from "./config/database_config";
import userRouter from "./routes/userRoutes";
const http = require('http');

dotenv.config();

mongooseConnection();
const app = express()
app.use(cookieParser());
app.use(express.json());


app.use(
    cors({
        origin: "http://localhost:1234",
        methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        credentials: true // Allow credentials (cookies, HTTP authentication)
    })
);

app.use("/", userRouter);

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});