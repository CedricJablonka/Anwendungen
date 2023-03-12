import mongoose from "mongoose";

const completeStreetDataSchema = mongoose.Schema({
  completeStreetId: {
    type: String,
    required: true,
  },
  geoJson: {},
  customStreetSections: {},
});

const CompleteStreetData = mongoose.model(
  "completeStreets",
  completeStreetDataSchema
);

export default CompleteStreetData;
