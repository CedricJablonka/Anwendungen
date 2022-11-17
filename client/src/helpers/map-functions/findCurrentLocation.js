import { useMapEvents, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import { useContext } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";

const FindCurrentLocation = () => {
  const { changeUserLocationInfo } = useContext(GeneralContext);
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    mousemove() {
      map.locate();
    },
    locationfound(e) {
      var result = Object.entries(e.bounds)
      changeUserLocationInfo({
        x: e.latitude,
        y: e.longitude,
        label: "",
        bounds: [[...e._northEast], [...e._southWest]],
      });
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default FindCurrentLocation;
