import React, { useRef, useEffect, useState, ReactNode } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import logo from './logo.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

mapboxgl.accessToken = '';

type DataInfo = {
  locations: string[],
  provinces: [string, number][],
  days: number[],
  distances: number[],
  elevations: number[],
  times: number[],
}

function App() {
  const defaultInfo = {locations: [], provinces:[], days:[], distances:[], elevations:[], times:[]};
  const mapContainer = useRef(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [lng, setLng] = useState(-95.0);
  const [lat, setLat] = useState(60.0);
  const [zoom, setZoom] = useState(3.0);
  const [colorby, setColorby] = useState("Gray");
  const [info, setInfo] = useState<DataInfo>(defaultInfo);
  useEffect(() => {
    if (typeof window === "undefined" || mapContainer.current === null) return;
    if (map) return; // initialize map only once

    const mc = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [lng, lat],
      zoom: zoom
    });

    mc.on('load', () => {
      addData(mc, setInfo);
    });
    setMap(mc);
  });

  const setLayersToColor = (color: (string|((i: number) => string))) => {
    for (let i = 1; i < info.days.length; i++) {
      let id = genMapId(i, info);
      let c = (typeof color === "string") ? color : color(i)
      map?.setPaintProperty(id, "line-color", c)
    }
  }

  const provinceColorOfDay = (day: number) => {
    let colors = ["#2196f3", "#ff9800", "#43a047", "#81d4fa", "#e53935", "#1a237e", "#00acc1", "#004d40", "#e65100", "#4e342e"]
    let provinces = ["BC", "Alberta", "Saskatchewan", "Manitoba", "Ontario", "Quebec", "New Brunswick", "Nova Scotia", "PEI", "Newfoundland"]
    let points = info.days[day]
    let npi = info.provinces.findIndex((x) => x[1] >= points)
    let p = npi===-1 ? 0 : npi - 1
    return colors[provinces.indexOf(info.provinces[p][0])]
  }

  const colorByDistance = (day: number) =>
    lerpColor("#efd9ce","#25283D", info.distances[day-1] / 1000 / 201)
  const colorByElevation = (day: number) =>
    lerpColor("#efd9ce","#25283D", info.elevations[day-1] / 2500)

  const hillyness = (day: number) => info.elevations[day-1] / (info.distances[day-1] / 1000)
  const colorByHills = (day: number) => {
    return lerpColor("#efd9ce","#25283D", hillyness(day)/15)
  }
  const colorByDay = (day: number) => {
    let colors = ["#2196f3", "#ff9800", "#43a047", "#e53935"]
    return colors[day % colors.length]
  }

  switch (colorby) {
    case "Same": setLayersToColor("#fc4c02"); break;
    case "Province": setLayersToColor(provinceColorOfDay); break;
    case "Day": setLayersToColor(colorByDay); break;
    case "Elevation": setLayersToColor(colorByElevation); break;
    case "Hillyness": setLayersToColor(colorByHills); break;
    case "Distance": setLayersToColor(colorByDistance); break;
  }

  return (
    <div>
      <div id="background">
        <div ref={mapContainer} className="map-container" />
      </div>
      <div id="panel">
        <h1>Jacob&rsquo;s bike ride</h1>
        <JAccordian title="Color rides by">
          <JRadioGroup value={colorby} setter={setColorby}>
            <JRadio value="Same"/>
            <JRadio value="Province"/>
            <JRadio value="Day"/>
            <JRadio value="Distance"/>
            <JRadio value="Hillyness"/>
            <JRadio value="Elevation"/>
          </JRadioGroup>
        </JAccordian>
      </div>
    </div>
  )
}

// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
function lerpColor(a: string, b: string, amount: number) {
    var ah = +a.replace(/#/g, '0x'),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = +b.replace(/#/g, '0x'),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
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
async function addData(map: mapboxgl.Map, setInfo: (d: DataInfo)=>void) {
  const info: DataInfo = await getDataInfo();
  const dataUrl = process.env.PUBLIC_URL + '/bike_data/loc';
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
      addLineToMap(data, map, genMapId(idx, info));
      idx += 1;
      data = [];
    }
  }
  setInfo(info);
  console.log("Fetching complete");
}

function genMapId(idx: number, info: DataInfo): string {
 return info.locations[idx-1]+ " to " +info.locations[idx]
}
function addLineToMap(data: number[][], map: mapboxgl.Map, id: string) {
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
