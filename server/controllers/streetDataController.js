import StreetDetailData from "../models/streetAttributes.js";
import { streetDetailsDataStructure } from "../constants/streetDetailsDataStructure.js";
import CompleteStreetData from "../models/completeStreet.js";

export const getStreetDetailsData = async (req, res) => {
  /*this method fetches a single street detail data object by a given street id from the db */

  const streetId = req.params.streetid;

  /*if no document for a street id exists in the db return a default empty object if it exists return the document */
  // am empty standard object will be returned to avoid an object creation for each click on a street
  try {
    const streetDetails = await StreetDetailData.findOne({
      streetId: streetId,
    });
    if (streetDetails === null) {
      res.send(streetDetailsDataStructure);
    } else if (streetDetails !== null) {
      res.send(streetDetails);
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getCompleteStreetData = async (req, res) => {
  const completeStreetId = req.params.completestreetid;
  try {
    const completeStreetData = await CompleteStreetData.findOne({
      completeStreetId: completeStreetId,
    });
    console.log(completeStreetData);

    if (completeStreetData === null) {
      res.send({
        completeStreetId: completeStreetId,
        customStreetSections: [],
      });
    } else if (completeStreetData !== null) {
      res.send(completeStreetData);
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getAllEditedStreets = async (req, res) => {
  try {
    const city = req.params.city;
    const filteredCities = await StreetDetailData.find({ city: city }).select({
      city: 1,
      streetId: 1,
    });

    //convert array to object for faster retrieval in the frontend
    const filtertedCitiesObject = filteredCities.reduce(
      (obj, cur) => ({ ...obj, [cur.streetId]: cur }),
      {}
    );
    res.status(201);

    res.send(filtertedCitiesObject);
  } catch (error) {}
};

export const sendStreetDetailsData = async (req, res) => {
  console.log(req.body);
  /*set a flag to determine if a sent object was empty or not. this needed to be done
  in the backend. If done in the frontend it is not possible delete a streetdetailinformation completly */

  let sentStreetDetails = req.body.streetDetailsData;
  if (hasValues(sentStreetDetails)) {
    sentStreetDetails = { ...sentStreetDetails, hasValues: true };
  } else {
    sentStreetDetails = { ...sentStreetDetails, hasValues: false };
  }

  const streetId = sentStreetDetails.streetId;

  try {
    /*if a streetData docuemnt with the given id exists in the db update it */
    const updatedStreetDetailData = await StreetDetailData.findOneAndUpdate(
      { streetId: streetId },
      sentStreetDetails,
      { new: true, upsert: true }
    );
    res
      .status(201)
      .json({
        data: updatedStreetDetailData,
        message: "Street Data was added to database",
      });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const sendCompleteStreetData = async (req, res) => {
  let completeStreetData = req.body.completeStreetData;
  const completeStreetId = completeStreetData.completeStreetId;
 
  try {
    /*if a streetData docuemnt with the given id exists in the db update it */
    const updatedCompleteStreetData = await CompleteStreetData.findOneAndUpdate(
      { completeStreetId: completeStreetId },
      completeStreetData,
      { new: true, upsert: true }
    );
    console.log(updatedCompleteStreetData);
    res
      .status(201)
      .json({
        data: updatedCompleteStreetData,
        message: "Street Data was added to database",
      });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/*utility functions */

const hasValues = (object) => {
  /*this functions checks if a given object only has fields with values null, "" or empty objects */
  const isEmpty = Object.values(object).every(
    (field) =>
      field === null || field === "" || Object.values(field).length === 0
  );

  return !isEmpty;
};
