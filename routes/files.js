import express from "express";
import multer from "multer";
import path from "path";
import {v4 as uuid4} from "uuid";
import { File } from "../models/files.js";
import { sendMail } from "../services/emailservice.js";
import { emailTemplate } from "../services/emailtemplate.js";

 const router = express.Router();
 

let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb) => {
        const uniqueName= `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
});

let upload= multer({
    storage,
    limit:{ fileSize: 1000000 * 100 },

}).single("myfile");

router.post("/",(req,res)=>{
    
    
    upload(req,res, async (err)=>{
        if(!req.file){
            return res.json({ error: "All fields are required"});
        }
    
        if(err) return res.status(500).send({error: err.message})

        const file= new File({
            filename:req.file.filename,
            uuid: uuid4(),
            path:req.file.path,
            size:req.file.size
        });

        const response= await file.save();
        return res.json({ file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
    });

});

router.get("/send",async (req,res)=>{
        const  { uuid, emailTo , emailFrom} =req.body;
        if( !uuid ||!emailTo || !emailFrom) return res.status(422).send({ error: "All fields are required"});

        const file= await File.findOne({ uuid: uuid});
        if(file.sender) return res.status(422).send({ error: "Email already sent"});

        file.sender = emailFrom;
        file.reciever= emailTo;
        const response = await file.save();

        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: "File Sharing",
            text:`${emailFrom} shared a file with you`,
            html: emailTemplate({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size/1000) + "KB",
                expires: "24 hours"
            })
           
        });
        return res.send({success:true});
});

export default router;