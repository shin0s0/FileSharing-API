import express from "express";
import { connectDB } from "./data/database.js";
import { config } from "dotenv";
import filesRouter from "./routes/files.js";
import showRouter from "./routes/show.js";
import downloadRouter from "./routes/download.js";
import path from "path";
import cors from "cors";
import { scheduleTask } from "./cron.js";

const app = express();
const PORT = process.env.PORT || 3000;

config({
  path: "./.env"
});

connectDB();


const corsOptions={
  origin: process.env.ALLOWED_CLIENTS.split(",")
}

app.use(cors(corsOptions));
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "ejs"); 

app.use("/api/files", filesRouter);
app.use("/files", showRouter);
app.use("/files/download",downloadRouter);

scheduleTask();
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
