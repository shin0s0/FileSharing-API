import mongoose from "mongoose";


export const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true}, {
        dbName:"File-sharing",
    })
    .then((c)=>console.log(`Database conected ${c.connection.host}`))
    .catch((e) => console.log(e));
}