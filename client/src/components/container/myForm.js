import {
  Pane,
  Button,
  Spinner,
  ClipboardIcon,
  IconButton,
  majorScale,
  InsertIcon,
} from "evergreen-ui";
import { streetFormFieldData } from "../../constants/streetFormFieldData";
import MyInput from "../inputs/myInput";
import { useContext, useState, useEffect } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";
import { useMapEvents } from "react-leaflet";

const MyForm = (props) => {
  const { streetId } = props;
  const {
    streetDetailsData,
    isLoadingStreetDetailsData,
    sendStreetDetailsData,
    copyStreetDetailData,
    pasteStreetDetailData,
    getOsmStreetName,
    changeGeoJsonColor,
    geoJsonColorMap,
    allEditedStreetsInCity,
  } = useContext(GeneralContext);

  const [streetName, setStreetName] = useState("");

  //these map events are used to highlight and dehighlight a street depending if it is selected or not
  const map = useMapEvents({
    popupopen: (e) => {
      changeGeoJsonColor({ streetId: streetId, color: "orange" });
      console.log("open");
    },
    popupclose: (e) => {
      streetId in allEditedStreetsInCity
        ? changeGeoJsonColor({ streetId: streetId, color: "green" })
        : changeGeoJsonColor({ streetId: streetId, color: "#3388ff" });

      console.log("close");
    },
  });

  const handleCopy = () => {
    copyStreetDetailData(streetDetailsData);
  };

  const handlePaste = () => {
    pasteStreetDetailData();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendStreetDetailsData(streetId);
  };
  return (
    <>
      {!isLoadingStreetDetailsData ? (
        <Pane>
          <Pane display="flex" flexWrap="wrap">
            <h3>{`Street Id: ${streetId}`}</h3>
            {streetFormFieldData.map((formField) => {
              return (
                <MyInput
                  label={formField.name}
                  key={formField.name}
                  inputId={formField.id}
                  initialValue={streetDetailsData[formField.id]}
                />
              );
            })}
          </Pane>
          <Pane display="flex" justifyContent="center" marginTop={10}>
            <Button appearance="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <IconButton
              icon={ClipboardIcon}
              onClick={handleCopy}
              marginLeft={majorScale(2)}
            />
            <IconButton
              icon={InsertIcon}
              onClick={handlePaste}
              marginLeft={majorScale(2)}
            />
          </Pane>
        </Pane>
      ) : (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={400}
        >
          <Spinner />
        </Pane>
      )}
    </>
  );
};
export default MyForm;
