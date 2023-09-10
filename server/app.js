require("dotenv/config")

const express = require('express')
const cors = require('cors')
const {default:mongoose} = require("mongoose");
const app = express();
const winston = require('winston');
const expressWinston = require('express-winston');

app.use(cors({origin: true})) // Allow Cross Origin requests
app.use(express.json()); // Parse API Requests with form data to json data
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/example.log'
  })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));
//ROUTES
{
  //Authentication routes
  const userRoute = require("./routes/auth")
  app.use("/api/users", userRoute)
  //Artist routes -forwaded all requests to /routes/artist.js
  const artistRoute = require("./routes/artist")
  app.use("/api/artists/", artistRoute)
  //Songs routes-forwaded all requests to /routes/song.js
  const songRoute = require("./routes/song")
  app.use("/api/songs", songRoute)

}

mongoose.connect(process.env.DB_CONN_STRING, {useNewUrlParser: true})
mongoose.connection
    .once("open",()=>console.log("CONNECTED WITH DB SERVER"))
    .on("error", (error)=> console.log(error))

app.listen(9192)