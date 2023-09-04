import express from "express";
import path from "path";
import { File } from "../models/files.js";

const router = express.Router();

router.get("/:uuid", async(req,res)=>{
    const file= await File.findOne({ uuid: req.params.uuid });
    if(!file) return res.render("download", {error: "Link has been expired"});

    const filePath= `${path.join(path.resolve(),"uploads")}/../${file.path}`;
    res.download(filePath);

});

export default router;