import { File } from "../models/files.js";
import fs from "fs";
import { connectDB } from "../data/database.js";

connectDB();

 const deleteData= async()=>{
    const files = await File.find({ createdAt: { $lt:new Date(Date.now() - 24 * 60* 60 * 1000 )} });
    if(files.length){
        for(const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`Error while deleting file ${err}`);
            }
        } 
    } 
    console.log(`done !`);
}

deleteData().then(process.exit);