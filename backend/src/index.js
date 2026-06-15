import dotenv from "dotenv";
import connectDB from "./db/index_db.js";
import {app} from "./app.js";
import { generateAiReview } from "./utils/aiReviewGenerator.js";
dotenv.config({
  path: "./.env",
});

connectDB().then(()=>{
    app.listen(process.env.PORT||8000, ()=>{
        console.log(`Server is listening on the port:${process.env.PORT}`);
        
    })
}).catch((error)=>{
    console.log("MONGODB connection error/failed", error)
})
//testing
// const run = async () => {
//   const response = await generateAiReview(`
//     Return ONLY valid JSON:

//     {
//       "score":80,
//   "verdict":"pass"
//     }
//   `);

//   console.log(response);
// }
// run()