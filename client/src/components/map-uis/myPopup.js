import {Popup} from "react-leaflet"

const MyPopup = (props) => {
   const {position, children} = props;
    return(<><Popup position= {position}>{children}</Popup></>)

};export default MyPopup;