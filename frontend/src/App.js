import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import logo from './logo.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

mapboxgl.accessToken = '';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-95.0);
  const [lat, setLat] = useState(60.0);
  const [zoom, setZoom] = useState(3.0);
  const [colorby, setColorby] = useState("Gray");
  console.log(zoom);
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      height: window.innerHeight,
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('load', () => {
      addData(map);
    });
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

function JRadioGroup(props) {
  const [group, setGroup] = useState(Math.random().toString(36).replace(/[^a-z]+/g, ''));
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

function JRadio(props) {
  let id = props.group + "-" + props.value;
  return (<div>
            <input type="radio" id={id} value={props.value} name={props.group}
                   checked={props.checked} onChange={() => props.setter(props.value)}/>
            <label for={id}> {props.value} </label>
          </div>)
}


function JAccordian(props) {
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

async function addData(map) {
  const dataUrl = process.env.PUBLIC_URL + '/bike_data/loc';
  console.log("Fetching");
  let data = [];
  let response = await fetch(dataUrl);
  let blob = await response.blob();
  let arr = await blob.arrayBuffer();
  let floats = new Float32Array(arr);

  let lf = null;
  for (let f of floats) {
    if (lf === null) {
      lf = f;
    } else {
      data.push([f, lf]);
      lf = null;
    }

  }
  console.log("Got Data", data);
  addLineToMap(data, map);
  console.log("Drew Data", data);
  // return addExtraData();
}


function addLineToMap(data, map) {
  map.current.addSource('route', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': data
      }
    }
  });

  map.current.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
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
