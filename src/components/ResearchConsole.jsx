import { useId, useRef } from "react";
import { ArrowUpRight, Orbit } from "lucide-react";
import { researchAreas } from "../content/profile";
import GlassSurface from "./GlassSurface";

// A schematic globe, deliberately not a cartographic dataset.
const LAND = [
  [
    [-17, 14],
    [-17, 25],
    [-5, 36],
    [10, 37],
    [33, 31],
    [43, 12],
    [51, 12],
    [41, -11],
    [33, -29],
    [20, -35],
    [12, -17],
    [9, -5],
    [5, 5],
    [-8, 4],
  ],
  [
    [-10, 36],
    [-9, 43],
    [3, 43],
    [4, 51],
    [-5, 58],
    [11, 59],
    [20, 70],
    [30, 70],
    [28, 60],
    [40, 54],
    [40, 40],
    [29, 36],
  ],
  [
    [30, 70],
    [60, 73],
    [100, 77],
    [140, 72],
    [180, 65],
    [180, 50],
    [140, 45],
    [130, 40],
    [122, 32],
    [110, 20],
    [100, 22],
    [92, 22],
    [80, 8],
    [72, 20],
    [68, 24],
    [55, 17],
    [43, 13],
    [35, 30],
    [40, 40],
    [40, 54],
  ],
  [
    [-81, 7],
    [-72, 11],
    [-60, 8],
    [-51, 4],
    [-47, -4],
    [-39, -4],
    [-38, -12],
    [-48, -26],
    [-58, -38],
    [-68, -55],
    [-75, -45],
    [-71, -29],
    [-76, -14],
  ],
  [
    [-130, 55],
    [-110, 65],
    [-90, 68],
    [-70, 73],
    [-60, 60],
    [-67, 47],
    [-81, 25],
    [-97, 26],
    [-117, 32],
    [-124, 43],
  ],
  [
    [-46, 60],
    [-22, 72],
    [-18, 80],
    [-46, 82],
    [-68, 80],
    [-58, 75],
  ],
  [
    [113, -22],
    [117, -35],
    [137, -34],
    [147, -44],
    [154, -28],
    [145, -15],
    [136, -12],
    [122, -18],
  ],
  [
    [44, -12],
    [50, -12],
    [50, -25],
    [44, -25],
  ],
];

function inPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}
function project(longitude, latitude) {
  const lon = ((longitude - 28) * Math.PI) / 180;
  const lat = (latitude * Math.PI) / 180;
  const tilt = 0.18;
  return {
    x: 240 + 118 * Math.cos(lat) * Math.sin(lon),
    y:
      166 -
      118 *
        (Math.cos(tilt) * Math.sin(lat) -
          Math.sin(tilt) * Math.cos(lat) * Math.cos(lon)),
    z:
      Math.sin(tilt) * Math.sin(lat) +
      Math.cos(tilt) * Math.cos(lat) * Math.cos(lon),
  };
}
const landDots = [];
for (let lat = -65; lat <= 80; lat += 4) {
  for (let lon = -180; lon < 180; lon += 4) {
    const point = project(lon, lat);
    if (point.z > 0 && LAND.some((polygon) => inPolygon(lon, lat, polygon)))
      landDots.push(point);
  }
}
const gridLines = [];
for (let lat = -60; lat <= 60; lat += 30)
  gridLines.push(
    Array.from({ length: 181 }, (_, i) => project(i * 2 - 180, lat)),
  );
for (let lon = -180; lon < 180; lon += 30)
  gridLines.push(
    Array.from({ length: 91 }, (_, i) => project(lon, i * 2 - 90)),
  );
const paths = gridLines.map((line) => {
  let visible = false;
  return line
    .map((point) => {
      if (point.z < 0) {
        visible = false;
        return "";
      }
      const command = visible ? "L" : "M";
      visible = true;
      return `${command}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");
});

function NeuralGlobe({ area }) {
  const id = useId();
  return (
    <svg className="neural-globe" viewBox="0 0 480 330" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-sphere`} cx="32%" cy="25%" r="75%">
          <stop offset="0%" stopColor="var(--globe-fill)" stopOpacity=".48" />
          <stop offset="65%" stopColor="var(--globe-fill)" stopOpacity=".05" />
          <stop offset="100%" stopColor="var(--globe-fill)" stopOpacity=".28" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="var(--glass-rim)" />
          <stop offset="45%" stopColor="var(--accent)" stopOpacity=".1" />
          <stop offset="100%" stopColor="var(--secondary)" stopOpacity=".7" />
        </linearGradient>
      </defs>
      <g className="globe-orbits" fill="none" stroke="currentColor">
        <ellipse
          cx="240"
          cy="166"
          rx="181"
          ry="61"
          transform="rotate(-24 240 166)"
        />
        <ellipse
          cx="240"
          cy="166"
          rx="166"
          ry="71"
          transform="rotate(40 240 166)"
        />
        <circle cx="240" cy="166" r="145" strokeDasharray="1 9" />
      </g>
      <circle
        cx="240"
        cy="166"
        r="119"
        fill={`url(#${id}-sphere)`}
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.6"
      />
      <g className="globe-grid">
        {paths.map((path, i) => (
          <path key={i} d={path} />
        ))}
      </g>
      <g className="globe-land">
        {landDots.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={1.25 + point.z * 0.55}
            opacity={0.3 + point.z * 0.65}
          />
        ))}
      </g>
      <g className="globe-signal" fill="none">
        <path d="M91 100 Q220 29 313 125 T407 209" />
        <path d="M107 234 Q238 287 343 77" />
      </g>
      <g className="orbital-beacon">
        <circle cx="92" cy="98" r="5" />
        <circle className="beacon-wave" cx="92" cy="98" r="10" />
      </g>
      <g className="orbital-beacon secondary">
        <circle cx="377" cy="234" r="4" />
        <circle className="beacon-wave" cx="377" cy="234" r="9" />
      </g>
      <g className="globe-label">
        <rect x="28" y="55" width="89" height="28" rx="14" />
        <text x="72.5" y="73" textAnchor="middle">
          {area.inputs[0]}
        </text>
        <path d="M90 83 L108 110" />
      </g>
      <g className="globe-label">
        <rect x="350" y="81" width="102" height="28" rx="14" />
        <text x="401" y="99" textAnchor="middle">
          {area.inputs[1]}
        </text>
        <path d="M357 109 L330 127" />
      </g>
      <g className="globe-label">
        <rect x="325" y="263" width="103" height="28" rx="14" />
        <text x="376.5" y="281" textAnchor="middle">
          {area.inputs[2]}
        </text>
        <path d="M345 263 L322 241" />
      </g>
      <g className="globe-crosshair">
        <path d="M235 166 H245 M240 161 V171" />
        <path d="M32 295 H43 M37.5 290 V300 M430 32 H441 M435.5 27 V37" />
      </g>
    </svg>
  );
}

export default function ResearchConsole({ lang, focus, setFocus, motion }) {
  const tabs = useRef([]);
  const area = researchAreas[focus];
  const onKeyDown = (event) => {
    let next;
    if (event.key === "ArrowRight") next = (focus + 1) % researchAreas.length;
    else if (event.key === "ArrowLeft")
      next = (focus + researchAreas.length - 1) % researchAreas.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = researchAreas.length - 1;
    else return;
    event.preventDefault();
    setFocus(next);
    tabs.current[next].focus();
  };
  return (
    <GlassSurface
      as="section"
      className="research-console enter"
      id="research"
      motion={motion}
      aria-label={
        lang === "zh" ? "研究方向交互面板" : "Interactive research directions"
      }
    >
      <div className="console-topline">
        <span>
          <Orbit size={14} />
          PLANETARY INTELLIGENCE
        </span>
        <span className="console-index">EXP. {area.code}</span>
      </div>
      <div className="globe-stage" data-focus={area.id}>
        <div className="globe-halo" />
        <NeuralGlobe area={area} />
        <span className="schematic-label">
          {lang === "zh" ? "研究概念示意" : "RESEARCH CONCEPT"}
        </span>
      </div>
      <div
        className="research-tabs"
        role="tablist"
        aria-label={lang === "zh" ? "研究方向" : "Research directions"}
        onKeyDown={onKeyDown}
        style={{ "--selected": focus }}
      >
        <span className="liquid-selection" aria-hidden="true" />
        {researchAreas.map((item, index) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            role="tab"
            aria-selected={focus === index}
            aria-controls={`panel-${item.id}`}
            tabIndex={focus === index ? 0 : -1}
            onClick={() => setFocus(index)}
          >
            {item.label[lang]}
          </button>
        ))}
      </div>
      {researchAreas.map((item, index) => (
        <div
          key={item.id}
          className="research-panel"
          id={`panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${item.id}`}
          hidden={index !== focus}
          tabIndex={0}
        >
          <h2>
            {item.title[lang]}
            <ArrowUpRight size={18} aria-hidden="true" />
          </h2>
          <p>{item.description[lang]}</p>
          <div className="data-pipeline" aria-hidden="true">
            <span>{item.inputs[0]}</span>
            <i />
            <span>{item.output}</span>
            <i />
            <span>EARTH</span>
          </div>
        </div>
      ))}
    </GlassSurface>
  );
}
