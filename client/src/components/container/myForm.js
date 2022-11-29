import {
  Pane,
  Button,
  Spinner,
  ClipboardIcon,
  IconButton,
  majorScale,
  InsertIcon,
  Tooltip,
} from "evergreen-ui";
import { streetFormFieldData } from "../../constants/streetFormFieldData";
import MyInput from "../inputs/myInput";
import { useContext, useState, useEffect } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";
import { useMapEvents } from "react-leaflet";
import { MdOutlineAddRoad, MdOutlineContentCopy, MdOutlineContentPaste } from "react-icons/md";

const MyForm = (props) => {
  const { streetId } = props;
  const {
    streetDetailsData,
    isLoadingStreetDetailsData,
    sendStreetDetailsData,
    copyStreetDetailData,
    pasteStreetDetailData,
    changeGeoJsonColor,
    allEditedStreetsInCity,
    getOverpassCompleteWay,
    changeShowSideSheet,
  
  } = useContext(GeneralContext);

  const iconSize = 20;

  //these map events are used to highlight and dehighlight a street depending if it is selected or not
  const map = useMapEvents({
    popupopen: (e) => {
      changeGeoJsonColor({ streetId: streetId, color: "orange" });
    },
    popupclose: (e) => {
      streetId in allEditedStreetsInCity
        ? changeGeoJsonColor({ streetId: streetId, color: "green" })
        : changeGeoJsonColor({ streetId: streetId, color: "#3388ff" });
    },
  });

  const handleCopy = () => {
    copyStreetDetailData(streetDetailsData);
  };

  const handleGetCompleteStreet = async () => {
    const selectedCompleteStreet = await getOverpassCompleteWay(streetId);
    console.log(selectedCompleteStreet);
    changeShowSideSheet(true);

  }

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
            <Pane display="flex" flexWrap="wrap">
              <h3>{`${streetDetailsData.streetName} `}</h3>
              <h3>{`Abschnitt Id: ${streetId}`}</h3>
            </Pane>

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
            <Tooltip content="Copy Streetdata">
              <IconButton
                icon={<MdOutlineContentCopy size={iconSize} />}
                onClick={handleCopy}
                marginLeft={majorScale(2)}
              />
            </Tooltip>
            <Tooltip content="Paste Streetdata">
              <IconButton
                icon={<MdOutlineContentPaste size={iconSize} />}
                onClick={handlePaste}
                marginLeft={majorScale(2)}
              />
            </Tooltip>
            <Tooltip content="Get complete Street">
              <IconButton
                icon={<MdOutlineAddRoad size={iconSize} />}
                onClick={handleGetCompleteStreet}
                marginLeft={majorScale(2)}
              />
            </Tooltip>
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
