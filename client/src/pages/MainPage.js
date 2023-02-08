import React, { useContext, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import GeoSearchBox from "../components/map-uis/GeoSearchBox";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MyPopup from "../components/map-uis/myPopup";
import MyGeoJson from "../components/map-uis/myGeoJson";
import GeneralContext from "../context/general-context/GeneralContext";
import CompleteStreetContext from "../context/complete-street-context/CompleteStreetContext";
import StreetTypeSelection from "../components/streetTypeSelection";
import MyForm from "../components/container/myForm";
import MyCompleteStreetForm from "../components/container/myCompleteStreetForm";
import MyStreetSections from "../components/map-uis/myStreetSections";
import MyCompleteStreetOptions from "../components/ui-elements/myCompleteStreetOptions";
import MyMapDrawer from "../components/map-uis/myMapDrawer";

const MainPage = () => {
  const {
    streetDetailsData,
    streetData,
    showStreetDetailInformation,
    streetClickedPosition,
    getAllEditedStreetsInCity,
    selectedCompleteStreet,
    hasValues,
    changeSelectedCompleteStreet,
    userLocationInfo,
    changeStreetClickedPosition,
    getStreetDetailsData,
    changePlainsDetailsData,
    changeStreetDetailsData,
    getOverpassCompleteWay,
    changeStreetMode,
    streetMode,
    changeShowStreetDetailInformation,
  } = useContext(GeneralContext);

  const {
    currentCustomStreetSectionId,
    getCompleteStreetData,
    changeShowCustomStreetSections,
    changeCurrentCustomStreetSectionId,
    changeCompleteStreetData,
    showCustomStreetSectionForm,
    completeStreetData,
    showCustomStreetSections
  } = useContext(CompleteStreetContext);

  let completeStreetId = "";
  useEffect(() => {
    getAllEditedStreetsInCity(userLocationInfo.position);
  }, [userLocationInfo.position]);

  useEffect(() => {
    console.log(completeStreetData);
  }, [completeStreetData]);

  const onUnselectCompleteStreet = () => {
    //perform a reset on most important complete section varaibles to prevent wrong variable values when switching back to complete street mode
    changeStreetMode("SINGLE");
    changeShowCustomStreetSections(false);
    changeCurrentCustomStreetSectionId("");
    changeSelectedCompleteStreet({});
    changeStreetClickedPosition({
      latlng: {},
      streetId: "",
    });
    //resetStreetData()
  };

  const onGeoJsonClick = (e, streetId) => {
    changeStreetClickedPosition({ latlng: e.latlng, streetId: streetId });
    changeShowStreetDetailInformation(true);
    getStreetDetailsData(streetId);
  };

  const onFormChange = (newValue, plainIndex, inputId) => {
    if (plainIndex !== undefined) {
      changePlainsDetailsData(plainIndex, inputId, newValue);
    } else {
      changeStreetDetailsData(inputId, newValue);
    }
  };

  const onGetCompleteStreet = async (streetId) => {
    completeStreetId = await getOverpassCompleteWay(streetId);
    const test = await getCompleteStreetData(completeStreetId);
    changeCompleteStreetData(test);
    console.log(completeStreetId);
    changeStreetMode("COMPLETE");
  };

  const onShowAllStreetSections = () => {
    changeShowCustomStreetSections(true);
  };

  const onHideAllStreetSections = () => {
    changeShowCustomStreetSections(false);
  };
  return (
    <>
      {streetMode === "SINGLE" && <StreetTypeSelection />}
      {/* <MySideSheet isShown={showSideSheet} />*/}
      {hasValues(selectedCompleteStreet) ? (
        <MyCompleteStreetOptions
          completeStreetId={selectedCompleteStreet.streetId}
          onUnselectCompleteStreet={onUnselectCompleteStreet}
          onShowAllStreetSections={onShowAllStreetSections}
          onHideAllStreetSections={onHideAllStreetSections}
        />
      ) : (
        <></>
      )}

      <MapContainer
        center={userLocationInfo.position}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
        closePopupOnClick={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoSearchBox provider={new OpenStreetMapProvider()} />
        {/*first case is the pop up behavior for street details second case for complete street operations*/}
        {showStreetDetailInformation &&
          (!hasValues(selectedCompleteStreet) ? (
            <MyPopup position={streetClickedPosition.latlng}>
              <MyForm
                streetId={streetClickedPosition.streetId}
                formData={streetDetailsData}
                onChange={onFormChange}
                onGetCompleteStreet={onGetCompleteStreet}
              />
            </MyPopup>
          ) : (
            <>
              {showCustomStreetSectionForm && (
                <MyCompleteStreetForm
                  streetId={currentCustomStreetSectionId}
                  position={streetClickedPosition.latlng}
                  completeStreetId={completeStreetId}
                />
              )}
              {streetMode === "COMPLETE" && (
                <MyMapDrawer completeStreetId={completeStreetId} />
              )}
            </>
          ))}
        {/*<Marker position={userLocationInfo.position}>
          <MyPopup>
            <MyForm />
          </MyPopup>
        </Marker> */}
        {/*first condition renders geo json for single street details mode second for complete street details mode */}
        {!hasValues(selectedCompleteStreet) ? (
          streetData?.features?.map((singleFeature) => {
            let streetId = singleFeature.id.split("/")[1];
            return (
              <MyGeoJson
                data={singleFeature}
                key={singleFeature.id}
                streetId={streetId}
                onClick={onGeoJsonClick}
              ></MyGeoJson>
            );
          })
        ) : (
          <MyGeoJson
            data={selectedCompleteStreet.data}
            streetId={selectedCompleteStreet.streetId}
          />
        )}
        <MyStreetSections />
      </MapContainer>
    </>
  );
};

export default MainPage;
