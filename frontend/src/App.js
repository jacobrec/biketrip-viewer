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
      <div ref={mapContainer} className="map-container" />
    </div>
  );
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
  console.log("Added Data", data);
  addLineToMap(data, map);
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
