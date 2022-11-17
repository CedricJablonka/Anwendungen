import React, { useContext, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  MapConsumer,
} from "react-leaflet";
import GeoSearchBox from "../components/map-uis/GeoSearchBox";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MyPopup from "../components/map-uis/myPopup";
import MyGeoJson from "../components/map-uis/myGeoJson";
import GeneralContext from "../context/general-context/GeneralContext";
import StreetTypeSelection from "../components/streetTypeSelection";
import MyForm from "../components/container/myForm";

const MainPage = () => {
  const { streetData, showStreetDetailInformation, streetClickedPosition } =
    useContext(GeneralContext);
  const position = [51.4818111, 7.2196635];

  return (
    <>
      <StreetTypeSelection />

      <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoSearchBox provider={new OpenStreetMapProvider()} />
        {showStreetDetailInformation && (
          <MyPopup position={streetClickedPosition.latlng}>
            <MyForm streetId={streetClickedPosition.streetId} />
          </MyPopup>
        )}
        <Marker position={position}>
          <MyPopup>
            <MyForm />
          </MyPopup>
        </Marker>
        {streetData?.features?.map((singleFeature) => {
          return (
            <MyGeoJson
              data={singleFeature}
              key={singleFeature.id}
              streetId={singleFeature.id.split("/")[1]}
            ></MyGeoJson>
          );
        })}
      </MapContainer>
    </>
  );
};

export default MainPage;
