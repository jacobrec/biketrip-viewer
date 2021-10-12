(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{177:function(e,t,n){},200:function(e,t,n){},204:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),c=n(63),i=n.n(c),s=(n(177),n(5)),o=n(3),u=n(64),l=n(6),p=n.n(l),d=n(14),j=n(4),b=n(25),f=n(37),v=n.n(f),h=(n(199),n(200),n(212)),x=n(213),O=n(0);function m(e){return Object(O.jsx)("hr",{style:{border:"0",height:"1px",backgroundImage:"linear-gradient(to right, #CCCCCC66, #CCCCCCFF, #CCCCCC66)"}})}function g(e){var t=Object(a.useState)(Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,5)),n=Object(j.a)(t,1)[0],c=r.a.Children.map(e.children,(function(t){return r.a.isValidElement(t)?r.a.cloneElement(t,{group:n,checked:t.props.value===e.value,setter:e.setter}):t}));return Object(O.jsxs)("div",{style:{flexFlow:"column",display:"flex"},children:[" ",c," "]})}function y(e){var t,n,a=e.group+"-"+e.value,r=null!==(t=e.setter)&&void 0!==t?t:function(e){};return Object(O.jsxs)("div",{children:[Object(O.jsx)("input",{type:"radio",id:a,value:e.value,name:e.group,checked:null!==(n=e.checked)&&void 0!==n&&n,onChange:function(){return r(e.value)}}),Object(O.jsxs)("label",{htmlFor:a,children:[" ",e.value," "]})]})}function F(e){var t=Object(a.useState)(!1),n=Object(j.a)(t,2),r=n[0],c=n[1];return Object(O.jsxs)("div",{children:[Object(O.jsxs)("h2",{style:{cursor:"pointer"},onClick:function(){return c(!r)},children:[r?Object(O.jsx)(h.a,{}):Object(O.jsx)(x.a,{})," ",e.title]}),Object(O.jsx)("div",{style:{margin:"10px"},children:r?Object(O.jsx)("div",{children:e.children}):Object(O.jsx)("div",{style:{display:"none"},children:e.children})})]})}var k,w=n(9);function S(e){return Object(a.useEffect)((function(){var t=10,n=30,a=30,r=50,c=660-r-n,i=300-t-a;w.h("#chartsvg").remove();var s=w.h("#chartdiv").append("svg").attr("id","chartsvg").attr("width",c+r+n).attr("height",i+t+a).append("g").attr("transform","translate(".concat(r,",").concat(t,")")),o=function(){var t=Object(d.a)(p.a.mark((function t(n){var a,r,o;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=function(t){switch(e.value){case"Speed":return t.speed;case"Elevation":return t.elevation;default:return 0}},r=w.g().domain(w.d(e.graphData,(function(e){return 1e3*e.time}))).range([0,c]),s.append("g").attr("transform","translate(0,".concat(i,")")).call(w.b(r)),o=w.f().domain([0,w.e(e.graphData,(function(e){return a(e)}))]).range([i,0]),s.append("g").call(w.c(o)),s.append("path").datum(e.graphData).attr("fill","#cce5df").attr("stroke","#69b3a2").attr("stroke-width",1.5).attr("d",w.a().x((function(e){return r(1e3*e.time)})).y0(o(0)).y1((function(e){return o(a(e))})));case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();switch(e.value){case"Speed":o("speed");break;case"Elevation":o("elevation")}}),[e.graphData,e.value]),"None"===e.value?Object(O.jsx)("div",{}):Object(O.jsx)("div",{className:"card",id:"graphbox",style:{position:"absolute",right:"0px",top:"0px"},children:Object(O.jsx)("div",{id:"chartdiv"})})}function M(e){return Object(O.jsxs)(g,{value:e.value,setter:e.setter,children:[Object(O.jsx)(y,{value:"None"}),Object(O.jsx)(y,{value:"Speed"}),Object(O.jsx)(y,{value:"Elevation"})]})}function C(e){var t=Object(a.useState)(-1),n=Object(j.a)(t,2),r=n[0],c=n[1];if(Object(a.useEffect)((function(){for(var t=function(t){var n,a=L(t,e.info);null===(n=e.map)||void 0===n||n.on("mouseenter",a,(function(){var n;1===(null===(n=e.map)||void 0===n?void 0:n.getPaintProperty(a,"line-opacity"))&&c(t-1)}))},n=0;n<e.info.days.length;n++)t(n);console.log("Hover listeners setup: ",e.info.days.length,e.map)}),[e.map,e.loaded,e.info]),-1===r)return Object(O.jsx)("div",{});var i=b.a.p(k||(k=Object(u.a)(["\n    margin-bottom: 0px;\n    margin-top: 2px;\n  "])));return Object(O.jsxs)("div",{className:"card",id:"hoverbox",style:{position:"absolute",left:"0px",bottom:"0px"},children:[Object(O.jsxs)("h3",{children:[" Day ",r+1,": ",L(r+1,e.info)," "]}),Object(O.jsxs)(i,{children:[" Distance: ",(e.info.distances[r]/1e3).toFixed(3),"km "]}),Object(O.jsxs)(i,{children:[" Time: ",(e.info.times[r]/3600).toFixed(2),"h "]}),Object(O.jsxs)(i,{children:[" Ascent: ",e.info.elevations[r].toFixed(0),"m "]}),Object(O.jsxs)(i,{children:[" Max Speed: ",(3.6*e.info.topspeeds[r]).toFixed(1),"km/h "]}),Object(O.jsxs)(i,{children:[" Average Speed: ",(3.6*e.info.averagespeeds[r]).toFixed(1),"km/h "]})]})}function T(e){var t=Object(a.useState)("All"),n=Object(j.a)(t,2),r=n[0],c=n[1];return Object(a.useEffect)((function(){var t=function(t){for(var n=1;n<e.info.days.length;n++){var a;null===(a=e.map)||void 0===a||a.setPaintProperty(L(n,e.info),"line-opacity",t.includes(n)?1:0)}},n=function(t){for(var n=[[0,0],[0,0],[0,0],[0,0],[0,0]],a=0;a<e.info.days.length;a++){var r=t[a];n[0][0]<r&&(n[0]=[r,a]),n.sort((function(e,t){return e[0]-t[0]}))}return n.map((function(e){return e[1]+1}))},a=function(t){var a=e.info[t];return n(a)},c=e.info.distances.map((function(t,n){return a=n,e.info.elevations[a]/(e.info.distances[a]/1e3);var a}));switch(r){case"All":t(Object(o.a)(Array(e.info.days.length+1).keys()));break;case"Top Distance":t(a("distances"));break;case"Top Elevation":t(a("elevations"));break;case"Top Time":t(a("times"));break;case"Top Hilliness":t(n(c));break;case"Top Average Speed":t(a("averagespeeds"));break;case"Top Max Speed":t(a("topspeeds"));break;default:t([])}}),[r,e.info,e.map]),Object(O.jsxs)(g,{value:r,setter:c,children:[Object(O.jsx)(y,{value:"All"}),Object(O.jsx)(y,{value:"Top Average Speed"}),Object(O.jsx)(y,{value:"Top Max Speed"}),Object(O.jsx)(y,{value:"Top Distance"}),Object(O.jsx)(y,{value:"Top Time"}),Object(O.jsx)(y,{value:"Top Elevation"}),Object(O.jsx)(y,{value:"Top Hilliness"})]})}function D(e){var t=Object(a.useState)("Same"),n=Object(j.a)(t,2),r=n[0],c=n[1];return Object(a.useEffect)((function(){var t=e.info,n=e.map,a=function(e){for(var a=1;a<t.days.length;a++){var r=L(a,t),c="string"===typeof e?e:e(a);null===n||void 0===n||n.setPaintProperty(r,"line-color",c)}},c=t.elevations.map((function(e,n){return e/t.distances[n]})),i=Math.max.apply(Math,Object(o.a)(t.distances)),s=Math.min.apply(Math,Object(o.a)(t.distances)),u=Math.max.apply(Math,Object(o.a)(t.elevations)),l=Math.min.apply(Math,Object(o.a)(t.elevations)),p=Math.max.apply(Math,Object(o.a)(t.topspeeds)),d=Math.min.apply(Math,Object(o.a)(t.topspeeds)),j=Math.max.apply(Math,Object(o.a)(t.averagespeeds)),b=Math.min.apply(Math,Object(o.a)(t.averagespeeds)),f=Math.max.apply(Math,Object(o.a)(c)),v=Math.min.apply(Math,Object(o.a)(c));switch(r){case"Same":a("#fc4c02");break;case"Province":a((function(e){var n=t.days[e],a=t.provinces.findIndex((function(e){return e[1]>=n})),r=-1===a?0:a-1;return["#2196f3","#ff9800","#43a047","#81d4fa","#e53935","#1a237e","#00acc1","#004d40","#e65100","#4e342e"][["BC","Alberta","Saskatchewan","Manitoba","Ontario","Quebec","New Brunswick","Nova Scotia","PEI","Newfoundland"].indexOf(t.provinces[r][0])]}));break;case"Day":a((function(e){var t=["#2196f3","#ff9800","#43a047","#e53935"];return t[e%t.length]}));break;case"Elevation":a((function(e){return E("#FFFFFF","#000000",(t.elevations[e-1]-l)/(u-l))}));break;case"Hilliness":a((function(e){return E("#FFFFFF","#000000",function(e){return(c[e-1]-v)/(f-v)}(e))}));break;case"Distance":a((function(e){return E("#FFFFFF","#000000",(t.distances[e-1]-s)/(i-s))}));break;case"Top Speed":a((function(e){return E("#FFFFFF","#000000",(t.topspeeds[e-1]-d)/(p-d))}));break;case"Average Speed":a((function(e){return E("#FFFFFF","#000000",(t.averagespeeds[e-1]-b)/(j-b))}))}}),[r,e.info,e.map]),Object(O.jsxs)(g,{value:r,setter:c,children:[Object(O.jsx)(y,{value:"Same"}),Object(O.jsx)(y,{value:"Province"}),Object(O.jsx)(y,{value:"Day"}),Object(O.jsx)(y,{value:"Distance"}),Object(O.jsx)(y,{value:"Hilliness"}),Object(O.jsx)(y,{value:"Elevation"}),Object(O.jsx)(y,{value:"Top Speed"}),Object(O.jsx)(y,{value:"Average Speed"})]})}function E(e,t,n){var a=+e.replace(/#/g,"0x"),r=a>>16,c=a>>8&255,i=255&a,s=+t.replace(/#/g,"0x");return"#"+((1<<24)+(r+n*((s>>16)-r)<<16)+(c+n*((s>>8&255)-c)<<8)+(i+n*((255&s)-i))|0).toString(16).slice(1)}function A(){return I.apply(this,arguments)}function I(){return(I=Object(d.a)(p.a.mark((function e(){var t,n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"/biketrip-viewer/bike_data/info",e.next=3,fetch("/biketrip-viewer/bike_data/info");case 3:return t=e.sent,e.next=6,t.json();case 6:return n=e.sent,console.log(n),e.abrupt("return",n);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(e,t){return N.apply(this,arguments)}function N(){return N=Object(d.a)(p.a.mark((function e(t,n){var a,r,c,i,s,o;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=function(){return(r=Object(d.a)(p.a.mark((function e(t){var n,a,r,c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="/biketrip-viewer/bike_data/"+t,e.next=3,fetch(n);case 3:return a=e.sent,e.next=6,a.blob();case 6:return r=e.sent,e.next=9,r.arrayBuffer();case 9:return c=e.sent,console.log("Finished Graph Data: "+t),e.abrupt("return",c);case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)},a=function(e){return r.apply(this,arguments)},e.t0=Int32Array,e.next=5,a("time");case 5:return e.t1=e.sent,c=new e.t0(e.t1),e.t2=Float32Array,e.next=10,a("speed");case 10:return e.t3=e.sent,i=new e.t2(e.t3),e.t4=Float32Array,e.next=15,a("ele");case 15:e.t5=e.sent,s=new e.t4(e.t5),o=t.map((function(e,t){return{latitude:e[0],longtitude:e[1],time:c[t],speed:i[t],elevation:s[t]}})),console.log({locations:t,times:c,speeds:i,elevations:s}),console.log("Finished Setting Graph Data",o),n(o);case 21:case"end":return e.stop()}}),e)}))),N.apply(this,arguments)}function B(){return(B=Object(d.a)(p.a.mark((function e(t,n,a,r){var c,i,o,u,l,d,j,b,f,v,h,x,O;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A();case 2:return c=e.sent,"/biketrip-viewer/bike_data/loc",i=[],e.next=7,fetch("/biketrip-viewer/bike_data/loc");case 7:return o=e.sent,e.next=10,o.blob();case 10:return u=e.sent,e.next=13,u.arrayBuffer();case 13:l=e.sent,d=new Float32Array(l),j=null,b=1,f=0,v=[],h=Object(s.a)(d);try{for(h.s();!(x=h.n()).done;)O=x.value,null===j?j=O:(i.push([O,j]),v.push([O,j]),f+=1,j=null),c.days[b]<=f&&(H(i,t,L(b,c)),b+=1,i=[])}catch(p){h.e(p)}finally{h.f()}return n(c),console.log("Fetching complete"),e.next=25,P(v,a);case 25:r(!0);case 26:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(e,t){return t.locations[e-1]+" to "+t.locations[e]}function H(e,t,n){t.addSource(n,{type:"geojson",data:{type:"Feature",properties:{},geometry:{type:"LineString",coordinates:e}}}),t.addLayer({id:n,type:"line",source:n,layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":"#fc4c02","line-width":5}})}v.a.accessToken="pk.eyJ1Ijoic3VqYW5jaGFrcmFib3J0eSIsImEiOiJja2Q5MzBuc3owenplMnBzY2I0eDYwdDhvIn0.imItePLDlYNF2BGVde_mkw";var J=function(){var e=Object(a.useRef)(null),t=Object(a.useState)(),n=Object(j.a)(t,2),r=n[0],c=n[1],i=Object(a.useState)({locations:[],provinces:[],days:[],distances:[],elevations:[],times:[],topspeeds:[],averagespeeds:[]}),s=Object(j.a)(i,2),o=s[0],u=s[1],l=Object(a.useState)([]),p=Object(j.a)(l,2),d=p[0],b=p[1],f=Object(a.useState)(!1),h=Object(j.a)(f,2),x=h[0],g=h[1];Object(a.useEffect)((function(){if("undefined"!==typeof window&&null!==e.current&&!r){var t=new v.a.Map({container:e.current,style:"mapbox://styles/mapbox/outdoors-v11",center:[-95,60],zoom:3});t.on("load",(function(){!function(e,t,n,a){B.apply(this,arguments)}(t,u,b,g)})),c(t)}}),[r]);var y=Object(a.useState)("None"),k=Object(j.a)(y,2),w=k[0],E=k[1];return Object(O.jsxs)("div",{children:[Object(O.jsx)("div",{id:"background",children:Object(O.jsx)("div",{ref:e,className:"map-container"})}),Object(O.jsx)(C,{info:o,map:r,loaded:x}),Object(O.jsx)(S,{value:w,graphData:d}),Object(O.jsxs)("div",{className:"card",id:"panel",children:[Object(O.jsx)("h1",{children:"Jacob\u2019s bike ride"}),Object(O.jsxs)("div",{style:{marginLeft:"10px"},children:[Object(O.jsx)(F,{title:"Line Color",children:Object(O.jsx)(D,{info:o,map:r})}),Object(O.jsx)(m,{}),Object(O.jsx)(F,{title:"Graph",children:Object(O.jsx)(M,{value:w,setter:E})}),Object(O.jsx)(m,{}),Object(O.jsx)(F,{title:"Highlights",children:Object(O.jsx)(T,{info:o,map:r})})]})]})]})},_=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,215)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,c=t.getLCP,i=t.getTTFB;n(e),a(e),r(e),c(e),i(e)}))};i.a.render(Object(O.jsx)(r.a.StrictMode,{children:Object(O.jsx)(J,{})}),document.getElementById("root")),_()}},[[204,1,2]]]);
//# sourceMappingURL=main.91bc042f.chunk.js.map