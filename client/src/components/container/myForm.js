import {
  Pane,
  Button,
  Spinner,
  IconButton,
  majorScale,
  Tooltip,
} from "evergreen-ui";
import { streetFormFieldData } from "../../constants/streetFormFieldData";
import MyInput from "../inputs/myInput";
import MyPlainInputForm from "../inputs/myPlainInputForm";
import { useContext } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";
import { useMapEvents } from "react-leaflet";
import {
  MdOutlineAddRoad,
  MdOutlineContentCopy,
  MdOutlineContentPaste,
} from "react-icons/md";

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
      var px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
      px.y -= e.target._popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
      map.panTo(map.unproject(px), { animate: true }); // pan to new center

      //https://stackoverflow.com/questions/22538473/leaflet-center-popup-and-marker-to-the-map
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
        <Pane style={{ overflow: "auto" }}>
          <Pane display="flex" flexWrap="wrap">
            <Pane display="flex" flexWrap="wrap">
              <h3>{`${streetDetailsData.streetName} `}</h3>
              <h3>{`|Abschnitt Id: ${streetId}`}</h3>
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
          <MyPlainInputForm />
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
          width={327}
        >
          <Spinner />
        </Pane>
      )}
    </>
  );
};
export default MyForm;
