import { Popup, useMapEvents } from "react-leaflet";
import {useContext} from "react";
import GeneralContext from "../../context/general-context/GeneralContext";

const MyPopup = (props) => {
  const { position, children} = props;
 
  return (
    <>
      <Popup position={position}>{children}</Popup>
    </>
  );
};
export default MyPopup;
