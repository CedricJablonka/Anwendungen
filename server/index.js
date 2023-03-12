import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import streetDataRouter from './routes/streetDataRoutes.js';

const app = express();
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));


app.use('/streetdata', streetDataRouter)





const CONNECTION_URL =
  "mongodb+srv://CedricJablonka:U6jyhf2qc3Ojewyy@infrastructuredata.gqcri26.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on Port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

