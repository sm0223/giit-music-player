require("dotenv/config")

const express = require('express')
const cors = require('cors')
const {default:mongoose} = require("mongoose");
const app = express();

app.use(cors({origin: true})) // Allow Cross Origin requests
app.use(express.json()); // Parse API Requests with form data to json data

//ROUTES
{
  //Authentication routes
  const userRoute = require("./routes/auth")
  app.use("/api/users", userRoute)
  //Artist routes
  const artistRoute = require("./routes/artist")
  app.use("/api/artists/", artistRoute)
  //Album routes
  const albumRoute = require("./routes/album")
  app.use("/api/albums", albumRoute)
  //Songs routes
  const songRoute = require("./routes/song")
  app.use("/api/songs", songRoute)

}

mongoose.connect(process.env.DB_CONN_STRING, {useNewUrlParser: true})
mongoose.connection
    .once("open",()=>console.log("CONNECTED WITH DB SERVER"))
    .on("error", (error)=> console.log(error))

app.listen(9192)