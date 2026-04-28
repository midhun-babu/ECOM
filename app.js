import express from "express";
import connectDB from "./config/dbConnection.js";
import logger from "./config/logger.js";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";


//Routes
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import orderRoute from "./routes/orderRoute.js"
import addressRoute from "./routes/addressRoute.js"
import invitationRoute from "./routes/invitationRoute.js"
import stockRoute from "./routes/stockRoute.js";
import analyticsRoute from "./routes/analyticsRoute.js";
dotenv.config()
const app=express()


connectDB(process.env.MONGO_URL);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))




app.get("/", (req, res) => {
  res.send("Home...");
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/cart",cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/address",addressRoute);
app.use("/api/v1/invites", invitationRoute);
app.use("/api/v1/stocks", stockRoute);
app.use("/api/v1/analytics", analyticsRoute);

app.use(errorHandler);






//Logger

app.use((req, res) => {
  logger.warn(`404 - Page not found: ${req.originalUrl}`); 
  res.status(404).json({ title: "404", message: "Page not found" });
});

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`); 
  res.status(500).json({ title: "Error", message: "Internal Server Error" });
});

export default app;
