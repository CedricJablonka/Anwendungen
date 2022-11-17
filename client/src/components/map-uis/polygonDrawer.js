import "leaflet-draw/dist/leaflet.draw.css";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useState } from "react";
import { DivIcon} from "leaflet";

const PolygonDrawer = () => {
  const [polygonInput, setPolygonInput] = useState([]);
  const [polygonId, setPolygonId] = useState(null);

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setPolygonId(_leaflet_id);
      console.log(layer.getLatLngs()[0]);
      console.log(layer)
      setPolygonInput(layer.getLatLngs()[0]);
    }
  };

  const _onEdited = (e) => {
    console.log(e);
  };

  const _onDeleted = (e) => {
    console.log(e);
  };
  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={_onCreate}
        onEdited={_onEdited}
        onDeleted={_onDeleted}
        draw={{
          polygon: { showArea: true, showLength: true, precision: { km: 2 } },
          rectangle: false,
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false
        }}
      />
    </FeatureGroup>
  );
};

export default PolygonDrawer;
