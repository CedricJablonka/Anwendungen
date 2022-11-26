import React, { useContext, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import GeoSearchBox from "../components/map-uis/GeoSearchBox";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MyPopup from "../components/map-uis/myPopup";
import MyGeoJson from "../components/map-uis/myGeoJson";
import GeneralContext from "../context/general-context/GeneralContext";
import StreetTypeSelection from "../components/streetTypeSelection";
import MyForm from "../components/container/myForm";

const MainPage = () => {
  const {
    streetData,
    showStreetDetailInformation,
    streetClickedPosition,
    getAllEditedStreetsInCity,
    allEditedStreetsInCity,
  } = useContext(GeneralContext);
  const position = [51.4818111, 7.2196635];

  useEffect(() => {
    
    getAllEditedStreetsInCity([51.4818111, 7.2196635]);
  }, []);

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
        {streetData?.features?.map((singleFeature) => {
          let streetId = singleFeature.id.split("/")[1];
          return (
            <MyGeoJson
              data={singleFeature}
              key={singleFeature.id}
              streetId={streetId}
              style={streetId in allEditedStreetsInCity ? { color: "green" } : {}}
            ></MyGeoJson>
          );
        })}
      </MapContainer>
    </>
  );
};

export default MainPage;
