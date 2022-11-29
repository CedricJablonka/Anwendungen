import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import GeoSearchBox from "../components/map-uis/GeoSearchBox";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MyPopup from "../components/map-uis/myPopup";
import MyGeoJson from "../components/map-uis/myGeoJson";
import GeneralContext from "../context/general-context/GeneralContext";
import StreetTypeSelection from "../components/streetTypeSelection";
import MyForm from "../components/container/myForm";
import MySideSheet from "../components/mySideSheet";

const MainPage = () => {
  const {
    streetData,
    showStreetDetailInformation,
    streetClickedPosition,
    getAllEditedStreetsInCity,
    allEditedStreetsInCity,
    selectedCompleteStreet,
    showSideSheet,
    hasValues
  } = useContext(GeneralContext);
  const position = [51.4818111, 7.2196635];

  useEffect(() => {
    getAllEditedStreetsInCity(position);
  }, []);

  return (
    <>
      <StreetTypeSelection />
      {/* <MySideSheet isShown={showSideSheet} />*/}
      <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoSearchBox provider={new OpenStreetMapProvider()} />
        {showStreetDetailInformation && (
          <MyPopup
            position={streetClickedPosition.latlng}
            streetId={streetClickedPosition.streetId}
          >
            <MyForm streetId={streetClickedPosition.streetId} />
          </MyPopup>
        )}
        <Marker position={position}>
          <MyPopup>
            <MyForm />
          </MyPopup>
        </Marker>
        {console.log(selectedCompleteStreet)}
        {Object.keys(selectedCompleteStreet).length === 0?streetData?.features?.map((singleFeature) => {
          let streetId = singleFeature.id.split("/")[1];
          return (
            <MyGeoJson
              data={singleFeature}
              key={singleFeature.id}
              streetId={streetId}
              style={
                streetId in allEditedStreetsInCity ? { color: "green" } : {}
              }
            ></MyGeoJson>
          );
        }):<MyGeoJson data={selectedCompleteStreet} streetId={selectedCompleteStreet?.id}/>}
      </MapContainer>
    </>
  );
};

export default MainPage;
