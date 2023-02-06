import { Popup } from "react-leaflet";

const MyPopup = (props) => {
  const { position, children } = props;
  
  return (
    <>
      <Popup style={{width: "500ppx"}} position={position}>{children}</Popup>
    </>
  );
};
export default MyPopup;
