import React, { useRef, useEffect, useState, ReactNode } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import logo from './logo.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

mapboxgl.accessToken = '';

function App() {
  const mapContainer = useRef(null);
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [lng, setLng] = useState(-95.0);
  const [lat, setLat] = useState(60.0);
  const [zoom, setZoom] = useState(3.0);
  const [colorby, setColorby] = useState("Gray");
  useEffect(() => {
    if (typeof window === "undefined" || mapContainer.current === null) return;
    if (map) return; // initialize map only once

    const mc = new mapboxgl.Map({
      // height: window.innerHeight,
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    mc.on('load', () => {
      addData(mc);
    });
    setMap(mc);
  });

  return (
    <div>
      <div id="background">
        <div ref={mapContainer} className="map-container" />
      </div>
      <div id="panel">
        <h1>Jacob's bike ride</h1>
        <JAccordian title="Color rides by">
          <JRadioGroup value={colorby} setter={setColorby}>
            <JRadio value="Gray"/>
            <JRadio value="Province"/>
            <JRadio value="Day"/>
            <JRadio value="Distance"/>
            <JRadio value="Elevation"/>
          </JRadioGroup>
        </JAccordian>
      </div>
    </div>
  );
}

function JRadioGroup(props: {value:string, setter: (a:string)=>void, children?: ReactNode}) {
  const [group, setGroup] = useState("colorby");
  const childrenWithProps = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        group,
        checked: child.props.value === props.value,
        setter: props.setter
      });
    }
    return child;
  });
  return <div style={{flexFlow: "column", display: "flex"}}> {childrenWithProps} </div>

}

function JRadio(props: {value: string, group?: string, checked?: boolean, setter?: (a:string)=>void}) {
  let id = props.group + "-" + props.value;
  let setter = props.setter ?? ((a) => {});
  return (<div>
            <input type="radio" id={id} value={props.value} name={props.group}
                   checked={props.checked ?? false} onChange={() => setter(props.value)}/>
            <label htmlFor={id}> {props.value} </label>
          </div>)
}


function JAccordian(props: {title: string, children: ReactNode}) {
  const [open, setOpen] = useState(false);
  return (<div>
    <h2 style={{cursor: "pointer"}} onClick={() => setOpen(!open)}>
      {open ? "v" : ">"} { props.title }
    </h2>
    <div style={{margin: "10px"}}>
      { open ? props.children : <div></div> }
    </div>
  </div>);
}

async function getDataInfo() {
  const dataUrl = process.env.PUBLIC_URL + '/bike_data/info';
  let response = await fetch(dataUrl);
  let jresponse = await response.json();
  console.log(jresponse);
  return jresponse;
}
async function addData(map: mapboxgl.Map) {
  const info = await getDataInfo();
  const dataUrl = process.env.PUBLIC_URL + '/bike_data/loc';
  console.log("Fetching");
  let data = [];
  let response = await fetch(dataUrl);
  let blob = await response.blob();
  let arr = await blob.arrayBuffer();
  let floats = new Float32Array(arr);

  let lf = null;
  let idx = 1;
  let c = 0;
  for (let f of floats) {
    if (lf === null) {
      lf = f;
    } else {
      data.push([f, lf]);
      c += 1;
      lf = null;
    }
    if (info.days[idx] <= c) {
      idx += 1;
      addLineToMap(data, map, info.locations[idx-1]+ " to " +info.locations[idx]);
      data = [];
    }
  }
}


function addLineToMap(data: number[][], map: mapboxgl.Map, id: string) {
  console.log(id);
  map.addSource(id, {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': data
      }
    }
  });

  map.addLayer({
    'id': id,
    'type': 'line',
    'source': id,
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#888',
      'line-width': 8
    }
  });
}

export default App;
