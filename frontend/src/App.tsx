import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {JRadio, JRadioGroup, JAccordian, JHRule} from './Components'

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VqYW5jaGFrcmFib3J0eSIsImEiOiJja2Q5MzBuc3owenplMnBzY2I0eDYwdDhvIn0.imItePLDlYNF2BGVde_mkw';

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

  return (
    <div>
      <div id="background">
        <div ref={mapContainer} className="map-container" />
      </div>
      <div className="card" id="panel">
        <h1>Jacob&rsquo;s bike ride</h1>
        <div style={{marginLeft: "10px"}}>
          <JAccordian title="Line Color">
            <JColorbyGroup info={info} map={map} />
          </JAccordian>
          <JHRule />
          <JAccordian title="Graph">
            <JGraphGroup info={info} />
          </JAccordian>
          <JHRule />
          <JAccordian title="Highlights">
            <JHighlightGroup info={info} map={map} />
          </JAccordian>
        </div>
      </div>
    </div>
  )
}

function JHighlightGroup(props: {info: DataInfo, map?: mapboxgl.Map}) {
  const [highlight, setHighlight] = useState("All");
  const filterDays = (days: number[]) => {
    for (let i = 1; i < props.info.days.length; i++) {
      props.map?.setPaintProperty(genMapId(i, props.info), 'line-opacity', days.includes(i) ? 1 : 0)
    }
  }
  const topDaysL = (srcList: number[]) => {
    let largest = [[0,0], [0,0], [0,0], [0,0], [0,0]]
    for (let i = 0; i < props.info.days.length; i++) {
      const l = srcList[i]
      if (largest[0][0] < l) {
        largest[0] = [l, i]
      }
      largest.sort((a, b) => a[0] - b[0])
    }
    console.log(largest.map((a) => a[1]+1))
    return largest.map((a) => a[1]+1)
  }
  const topDays = (p: string) => {
    let data: any = props.info
    let srcList = data[p]
    return topDaysL(srcList)
  }
  const hillyness = (day: number) => props.info.elevations[day] / (props.info.distances[day] / 1000)
  const hillinessList = props.info.distances.map((e, i) => hillyness(i))
  switch (highlight) {
    case 'All': filterDays([...Array(props.info.days.length+1).keys()]); break;
    case 'Top Distance': filterDays(topDays('distances')); break;
    case 'Top Elevation': filterDays(topDays('elevations')); break;
    case 'Top Time': filterDays(topDays('times')); break;
    case 'Top Hilliness': filterDays(topDaysL(hillinessList)); break;
    default: filterDays([]); break;
  }
  return (
          <JRadioGroup value={highlight} setter={setHighlight}>
            <JRadio value="All"/>
            <JRadio value="Top Average Speed"/>
            <JRadio value="Top Max Speed"/>
            <JRadio value="Top Distance"/>
            <JRadio value="Top Time"/>
            <JRadio value="Top Elevation"/>
            <JRadio value="Top Hilliness"/>
          </JRadioGroup>
  )
}


function JGraphGroup(props: {info: DataInfo}) {
  const [graphType, setGraphType] = useState("None");
  return (
          <JRadioGroup value={graphType} setter={setGraphType}>
            <JRadio value="None"/>
          </JRadioGroup>
  )
}

function JColorbyGroup(props: {map?: mapboxgl.Map, info: DataInfo}) {
  const info = props.info
  const map = props.map
  const [colorby, setColorby] = useState("Same");
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
    lerpColor("#FFFFFF","#000000", info.distances[day-1] / 1000 / 201)
  const colorByElevation = (day: number) =>
    lerpColor("#FFFFFF","#000000", info.elevations[day-1] / 2500)

  const hillyness = (day: number) => info.elevations[day-1] / (info.distances[day-1] / 1000)
  const colorByHills = (day: number) => {
    return lerpColor("#FFFFFF","#000000", hillyness(day)/24)
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
    case "Hilliness": setLayersToColor(colorByHills); break;
    case "Distance": setLayersToColor(colorByDistance); break;
  }

  return (
          <JRadioGroup value={colorby} setter={setColorby}>
            <JRadio value="Same"/>
            <JRadio value="Province"/>
            <JRadio value="Day"/>
            <JRadio value="Distance"/>
            <JRadio value="Hilliness"/>
            <JRadio value="Elevation"/>
          </JRadioGroup>
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
      'line-color': '#fc4c02',
      'line-width': 5
    }
  });
}

export default App;
