import { useEffect, useContext } from "react";
import { GeoSearchControl } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import GeneralContext from "../../context/general-context/GeneralContext";

/*this is an ui element that can be added to a react leaflet map inorder to display a search box */
const GeoSearchBox = (props) => {
  const map = useMap();
  const { provider } = props;
  const { changeUserLocationInfo } = useContext(GeneralContext);

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: provider,
      maxMarkers: 1,
      style: "button",
      keepResult: true,
    });

    function showLocation(e) {
      console.log(e);
      changeUserLocationInfo({
        lat: e.location.y,
        long: e.location.x,
        label: e.location.label,
        bounds: e.location.bounds
      });
    }

    map.addControl(searchControl);
    map.on("geosearch/showlocation", showLocation);
    return () => map.removeControl(searchControl);
  }, [props]);

  return null;
};

export default GeoSearchBox;
