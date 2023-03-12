import mongoose from "mongoose";

const streetDetailsSchema = mongoose.Schema({
  streetId: { type: String, required: true, sparse: true },
  //guId: { type: String, dropDups: true, unique: true, required: true },
  plaines: [
    {
      area: { type: String, default: "" },
      thickness: { type: String, default: "" },
      layerType: { type: String, default: "" },
      mass: { type: String, default: "" },
    },
  ],
  usage: { type: String, default: "" },
  streetType: { type: String, default: "" },
  axleType: { type: String, default: "" },
  installationYear: { type: String, default: "" },
  state: { type: String, default: "" },
  latlng: { lat: Number, lng: Number, default: {} },
  hasValues: { type: Boolean, default: false },
  city: { type: String, default: "" },
  osmDetails: { type: Object, default: {} },
});

const StreetDetailData = mongoose.model("StreetDetails", streetDetailsSchema);

export default StreetDetailData;
