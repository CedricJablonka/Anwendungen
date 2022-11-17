import {useMapEvents} from "react-leaflet"

const MapEventHandler = () => {
    const map = useMapEvents({
        click(e) {
            console.log(e.latlng)
        },
      });


    return(<div></div>)
};export default MapEventHandler;