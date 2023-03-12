import express from "express";
import {
  sendStreetDetailsData,
  getStreetDetailsData,
  getAllEditedStreets,
  sendCompleteStreetData,
  getCompleteStreetData,
} from "../controllers/streetDataController.js";
import bodyParser from "body-parser";
const streetDataRouter = express.Router();

streetDataRouter.post("/senddetails", bodyParser.json(), sendStreetDetailsData);
streetDataRouter.post(
  "/sendcompletestreet",
  bodyParser.json(),
  sendCompleteStreetData
);
streetDataRouter.get("/getall/:city", bodyParser.json(), getAllEditedStreets);
streetDataRouter.get(
  "/getdetails/:streetid",
  bodyParser.json(),
  getStreetDetailsData
);

streetDataRouter.get(
  
  "/getcompletestreet/:completestreetid",
  bodyParser.json(),
  getCompleteStreetData
);

export default streetDataRouter;
