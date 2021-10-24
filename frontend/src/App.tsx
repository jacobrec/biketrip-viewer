import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled'
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {JRadio, JRadioGroup, JAccordian, JHRule} from './Components'
import * as d3 from "d3";

// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VqYW5jaGFrcmFib3J0eSIsImEiOiJja2Q5MzBuc3owenplMnBzY2I0eDYwdDhvIn0.imItePLDlYNF2BGVde_mkw';

type DataInfo = {
  locations: string[],
  provinces: [string, number][],
  days: number[],
  distances: number[],
  elevations: number[],
  times: number[],
  topspeeds: number[],
  averagespeeds: number[],
}

type DataPoint = {
  elevation: number,
  latitude: number,
  longtitude: number,
  speed: number,
  time: number,
}

function App() {
  const defaultInfo = {locations: [], provinces:[], days:[], distances:[], elevations:[], times:[], topspeeds:[], averagespeeds:[]};
  const mapContainer = useRef(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [info, setInfo] = useState<DataInfo>(defaultInfo);
  const [graphData, setGraphData] = useState<DataPoint[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || mapContainer.current === null) return;
    if (map) return; // initialize map only once

    const mc = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [-95, 60],
      zoom: 3.0
    });

    mc.on('load', () => {
      addData(mc, setInfo, setGraphData, setLoaded);
    });
    setMap(mc);
  }, [map]);

  const [graphType, setGraphType] = useState("None");
  return (
    <div>
      <div id="background">
        <div ref={mapContainer} className="map-container" />
      </div>

      <JHoverBox info={info} map={map} loaded={loaded} />
      <JGraphBox value={graphType} graphData={graphData} />
      <div className="card" id="panel">
        <h1>Jacob&rsquo;s bike ride</h1>
        <div style={{marginLeft: "10px"}}>
          <JAccordian title="Line Color">
            <JColorbyGroup info={info} map={map} />
          </JAccordian>
          <JHRule />
          <JAccordian title="Graph">
            <JGraphGroup value={graphType} setter={setGraphType} />
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

function JGraphBox(props: {graphData: DataPoint[], value: string}) {
  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 660 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    d3.select("#chartsvg").remove();
    const svg = d3.select("#chartdiv")
      .append("svg")
      .attr("id","chartsvg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`);



    const addData = async (value: string) => {
      const dGet = (d: DataPoint) => {
        switch(props.value) {
          case "Speed": return d.speed
          case "Elevation": return d.elevation
          default: return 0
        }
      }
      // Add X axis
      const x = d3.scaleTime()
        .domain(d3.extent(props.graphData, d => d.time*1000) as [number, number])
        .range([ 0, width ]);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, d3.max(props.graphData, d => dGet(d)) as number])
        .range([ height, 0 ]);

      svg.append("g")
        .call(d3.axisLeft(y));
      // Add the area
      svg.append("path")
        .datum(props.graphData)
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d",
              d3.area<DataPoint>()
                .x((d: DataPoint) => x(d.time*1000))
                .y0(y(0))
                .y1((d: DataPoint) => y(dGet(d)))
            )
    }
    switch(props.value) {
        case "Speed": addData('speed'); break;
        case "Elevation": addData('elevation'); break;
    }

  }, [props.graphData, props.value])
  if (props.value === "None") {
    return <div></div>
  }
  return (
    <div className="card" id="graphbox" style={{position: "absolute", right: "0px", top: "0px"}}>
      <div id="chartdiv"></div>
    </div>
  )
}

function JGraphGroup(props: {value: string, setter: (s: string) => void}) {
  return (
          <JRadioGroup value={props.value} setter={props.setter}>
            <JRadio value="None"/>
            <JRadio value="Speed"/>
            <JRadio value="Elevation"/>
          </JRadioGroup>
  )
}

function JHoverBox (props: {info: DataInfo, map?: mapboxgl.Map, loaded: boolean}) {
  const [hovered, setHovered] = useState(-1);
  useEffect(() => {
    for (let i = 0; i < props.info.days.length; i++) {
      let id = genMapId(i, props.info)
      props.map?.on('mouseenter', id, () => {
        if (props.map?.getPaintProperty(id, 'line-opacity') === 1) {
          setHovered(i-1)
        }
      })
    }
    console.log("Hover listeners setup: ", props.info.days.length, props.map)
  }, [props.map, props.loaded, props.info])
  if (hovered === -1) {
    return <div></div>
  }
  const P = styled.p`
    margin-bottom: 0px;
    margin-top: 2px;
  `
  return (
    <div className="card" id="hoverbox" style={{position: "absolute", left: "0px", bottom: "0px"}}>
      <h3> Day {hovered+1}: {genMapId(hovered+1, props.info)} </h3>
      <P> Distance: {(props.info.distances[hovered] / 1000).toFixed(3)}km </P>
      <P> Time: {(props.info.times[hovered] / 3600).toFixed(2)}h </P>
      <P> Ascent: {(props.info.elevations[hovered]).toFixed(0)}m </P>
      <P> Max Speed: {(props.info.topspeeds[hovered] * 3.6).toFixed(1)}km/h </P>
      <P> Average Speed: {(props.info.averagespeeds[hovered] * 3.6).toFixed(1)}km/h </P>
    </div>
  )

}

function JHighlightGroup(props: {info: DataInfo, map?: mapboxgl.Map}) {
  const [highlight, setHighlight] = useState("All");
  useEffect(() => {
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
      case 'Top Average Speed': filterDays(topDays('averagespeeds')); break;
      case 'Top Max Speed': filterDays(topDays('topspeeds')); break;
      default: filterDays([]); break;
    }
  }, [highlight, props.info, props.map])
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

function JColorbyGroup(props: {map?: mapboxgl.Map, info: DataInfo}) {
  const [colorby, setColorby] = useState("Same");

  useEffect(() => {
    const info = props.info
    const map = props.map
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

    const hillys = info.elevations.map((e, i) => e / info.distances[i])
    const maxDistance = Math.max(...info.distances)
    const minDistance = Math.min(...info.distances)
    const maxElevation = Math.max(...info.elevations)
    const minElevation = Math.min(...info.elevations)
    const maxTop = Math.max(...info.topspeeds)
    const minTop = Math.min(...info.topspeeds)
    const maxAve = Math.max(...info.averagespeeds)
    const minAve = Math.min(...info.averagespeeds)
    const maxHill = Math.max(...hillys)
    const minHill = Math.min(...hillys)

    const colorByDistance = (day: number) =>
      lerpColor("#FFFFFF","#000000", (info.distances[day-1] - minDistance) / (maxDistance - minDistance))
    const colorByElevation = (day: number) =>
      lerpColor("#FFFFFF","#000000", (info.elevations[day-1] - minElevation) / (maxElevation - minElevation))
    const colorBySpeedTop = (day: number) =>
      lerpColor("#FFFFFF","#000000", (info.topspeeds[day-1] - minTop) / (maxTop - minTop))
    const colorBySpeedAve = (day: number) =>
      lerpColor("#FFFFFF","#000000", (info.averagespeeds[day-1] - minAve) / (maxAve - minAve))

    const hillyness = (day: number) => ((hillys[day-1] - minHill) / (maxHill - minHill))
    const colorByHills = (day: number) => {
      return lerpColor("#FFFFFF","#000000", hillyness(day))
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
      case "Top Speed": setLayersToColor(colorBySpeedTop); break;
      case "Average Speed": setLayersToColor(colorBySpeedAve); break;
    }
  }, [colorby, props.info, props.map])

  return (
          <JRadioGroup value={colorby} setter={setColorby}>
            <JRadio value="Same"/>
            <JRadio value="Province"/>
            <JRadio value="Day"/>
            <JRadio value="Distance"/>
            <JRadio value="Hilliness"/>
            <JRadio value="Elevation"/>
            <JRadio value="Top Speed"/>
            <JRadio value="Average Speed"/>
          </JRadioGroup>
  )
}

// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
function lerpColor(a: string, b: string, amount: number) {
    var ah = +a.replace(/#/g, '0x'),
        ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
        bh = +b.replace(/#/g, '0x'),
        br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
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
async function addRestOfData(locations: number[][], setGraphData: (d: DataPoint[])=>void) {
  async function getAData(loc: string) {
    const dataUrl = process.env.PUBLIC_URL + '/bike_data/' + loc;
    let response = await fetch(dataUrl);
    let blob = await response.blob();
    let arr = await blob.arrayBuffer();
    console.log("Finished Graph Data: " + loc)
    return arr;
  }

  const times = new Int32Array(await getAData('time'))
  const speeds = new Float32Array(await getAData('speed'))
  const elevations = new Float32Array(await getAData('ele'))

  const dataPoints: DataPoint[] = locations.map((l, i) => {
    return {
      latitude: l[0],
      longtitude: l[1],
      time: times[i],
      speed: speeds[i],
      elevation: elevations[i],
    }
  })
  console.log({locations, times, speeds, elevations})
  console.log("Finished Setting Graph Data", dataPoints)
  setGraphData(dataPoints)

}
async function addData(map: mapboxgl.Map, setInfo: (d: DataInfo)=>void, setGraphData: (d: DataPoint[])=>void, setLoaded: (b:boolean) => void) {
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
  let locations = [];
  for (let f of floats) {
    if (lf === null) {
      lf = f;
    } else {
      data.push([f, lf]);
      locations.push([f, lf])
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
  await addRestOfData(locations, setGraphData)
  setLoaded(true)
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
