import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config({
  path:"./env"
})
import connectDb from "./Db/db_connect.js";

connectDb()
.then(() =>{
  const port = process.env.PORT || 6000

  app.listen(port, () => {
    console.log(`server at http://localhost:${port}`);
})

})
.catch((error) => {
  console.log("mongodb connection failed !!! :", error)
})







