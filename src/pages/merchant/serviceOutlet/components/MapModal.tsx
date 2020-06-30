import React, {FC} from "react";
import {Map,Marker} from "react-amap";

interface MapModalProps {
  gps: [] | undefined;
  markerPosition: {} | undefined
}


const MapModal: FC<MapModalProps> = (props) => {
  return (
    <div id="map" style={{width: '100%', height: '250px'}}>
      <Map amapkey={"309d27a9a912a6011ecf07aff92e8e2d"}
           center={props.gps}
           zoom={16}>
        <Marker position={props.markerPosition} />
      </Map>
    </div>

  );

};
export default MapModal;
