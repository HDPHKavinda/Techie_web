const { useState, useRef, useCallback, useEffect } = React;

/* ================================================================
   TECHIE HESHAN — Circuit Lab v2
   Advanced drag-and-drop circuit simulator
   ================================================================ */

const C = {
  bg: "#0A0A0A", bg2: "#0E0E0E", sf: "#111", sf2: "#161616", sf3: "#1B1B1B",
  ln: "#232323", ln2: "#2E2E2E", ln3: "#3A3A3A",
  tx: "#F5F5F5", mt: "#9A9A9A", mt2: "#6B6B6B", sv: "#C8C8C8",
  gl: "rgba(255,255,255,.14)", gs: "rgba(255,255,255,.34)",
};
const F = {
  d: "'Space Grotesk',system-ui,sans-serif",
  b: "'Inter',system-ui,sans-serif",
  m: "'JetBrains Mono',ui-monospace,monospace",
};

// ─── Component Library ───
const DEFS = {
  esp32: {
    name: "ESP32 DevKit", w: 110, h: 170, cat: "Boards", icon: "⚡",
    pins: [
      { id:"3v3",x:0,y:28,s:"l",label:"3V3",type:"power" },
      { id:"gnd",x:0,y:46,s:"l",label:"GND",type:"gnd" },
      { id:"d2",x:0,y:72,s:"l",label:"D2",type:"dio" },
      { id:"d4",x:0,y:88,s:"l",label:"D4",type:"dio" },
      { id:"d5",x:0,y:104,s:"l",label:"D5",type:"dio" },
      { id:"d12",x:0,y:120,s:"l",label:"D12",type:"dio" },
      { id:"d13",x:0,y:136,s:"l",label:"D13",type:"dio" },
      { id:"d14",x:0,y:152,s:"l",label:"D14",type:"dio" },
      { id:"vin",x:110,y:28,s:"r",label:"VIN",type:"power" },
      { id:"gnd2",x:110,y:46,s:"r",label:"GND",type:"gnd" },
      { id:"d15",x:110,y:72,s:"r",label:"D15",type:"dio" },
      { id:"d16",x:110,y:88,s:"r",label:"D16",type:"dio" },
      { id:"d18",x:110,y:104,s:"r",label:"D18",type:"dio" },
      { id:"d19",x:110,y:120,s:"r",label:"D19",type:"dio" },
      { id:"d23",x:110,y:136,s:"r",label:"D23",type:"dio" },
      { id:"d25",x:110,y:152,s:"r",label:"D25",type:"aio" },
    ],
    draw:(s)=><g>
      <rect x={2} y={2} width={106} height={166} rx={7} fill={C.sf2} stroke={C.ln2} strokeWidth={1}/>
      <rect x={26} y={10} width={58} height={40} rx={5} fill={C.sf} stroke={C.ln3} strokeWidth={.7}/>
      <text x={55} y={28} textAnchor="middle" fill={C.sv} fontSize={8} fontFamily={F.m} letterSpacing=".06em">ESP32</text>
      <text x={55} y={40} textAnchor="middle" fill={C.mt2} fontSize={6} fontFamily={F.m}>WROOM-32</text>
      <rect x={40} y={0} width={30} height={7} rx={2} fill={C.sv}/>
      {s?.led2?<circle cx={84} cy={18} r={3.5} fill="#fff" filter="url(#glo)"/>:<circle cx={84} cy={18} r={3.5} fill={C.ln3}/>}
    </g>,
  },
  led: {
    name: "LED", w: 44, h: 56, cat: "Output", icon: "💡",
    pins: [
      { id:"a",x:13,y:56,s:"b",label:"+",type:"in" },
      { id:"k",x:31,y:56,s:"b",label:"−",type:"gnd" },
    ],
    draw:(s)=><g>
      <polygon points="8,12 36,12 22,38" fill={s?.on?"#fff":C.ln3} stroke={s?.on?"#fff":C.mt2} strokeWidth={.8} filter={s?.on?"url(#glo)":"none"}/>
      <line x1={8} y1={40} x2={36} y2={40} stroke={s?.on?"#fff":C.mt2} strokeWidth={1}/>
      <text x={22} y={8} textAnchor="middle" fill={C.mt2} fontSize={6} fontFamily={F.m}>LED</text>
    </g>,
  },
  rgb_led: {
    name: "RGB LED", w: 56, h: 60, cat: "Output", icon: "🌈",
    pins: [
      { id:"r",x:8,y:60,s:"b",label:"R",type:"in" },
      { id:"gnd",x:20,y:60,s:"b",label:"−",type:"gnd" },
      { id:"g",x:34,y:60,s:"b",label:"G",type:"in" },
      { id:"b",x:48,y:60,s:"b",label:"B",type:"in" },
    ],
    draw:(s)=>{
      const r=s?.r?255:0,g=s?.g?255:0,b=s?.b?255:0;
      const on=r||g||b;
      const col=on?`rgb(${Math.min(r+60,255)},${Math.min(g+60,255)},${Math.min(b+60,255)})`:"none";
      return <g>
        <circle cx={28} cy={26} r={16} fill={on?col:C.ln3} stroke={on?col:C.mt2} strokeWidth={.8} filter={on?"url(#glo)":"none"}/>
        <text x={28} y={8} textAnchor="middle" fill={C.mt2} fontSize={6} fontFamily={F.m}>RGB</text>
      </g>;
    },
  },
  resistor: {
    name: "Resistor", w: 66, h: 26, cat: "Passive", icon: "〰",
    props: { ohms: 330 },
    pins: [
      { id:"a",x:0,y:13,s:"l",label:"A",type:"pass" },
      { id:"b",x:66,y:13,s:"r",label:"B",type:"pass" },
    ],
    draw:(s,p)=><g>
      <line x1={0} y1={13} x2={10} y2={13} stroke={C.mt} strokeWidth={1.2}/>
      <path d="M10 13 l3-7 7 14 7-14 7 14 7-14 7 14 3-7" fill="none" stroke={C.sv} strokeWidth={1.2}/>
      <line x1={56} y1={13} x2={66} y2={13} stroke={C.mt} strokeWidth={1.2}/>
      <text x={33} y={7} textAnchor="middle" fill={C.mt2} fontSize={6.5} fontFamily={F.m}>{p?.ohms||330}Ω</text>
    </g>,
  },
  button: {
    name: "Push Button", w: 46, h: 46, cat: "Input", icon: "🔘",
    pins: [
      { id:"a",x:0,y:23,s:"l",label:"A",type:"in" },
      { id:"b",x:46,y:23,s:"r",label:"B",type:"out" },
    ],
    draw:(s)=><g>
      <rect x={6} y={6} width={34} height={34} rx={5} fill={s?.pressed?C.sv:C.sf2} stroke={C.ln2} strokeWidth={.8}/>
      <circle cx={23} cy={23} r={9} fill={s?.pressed?"#fff":C.ln3} stroke={C.mt2} strokeWidth={.7}/>
      <text x={23} y={46} textAnchor="middle" fill={C.mt2} fontSize={5.5} fontFamily={F.m}>BTN</text>
    </g>,
  },
  buzzer: {
    name: "Piezo Buzzer", w: 46, h: 48, cat: "Output", icon: "🔊",
    pins: [
      { id:"pos",x:13,y:48,s:"b",label:"+",type:"in" },
      { id:"neg",x:33,y:48,s:"b",label:"−",type:"gnd" },
    ],
    draw:(s)=><g>
      <circle cx={23} cy={20} r={14} fill={C.sf2} stroke={s?.on?"#fff":C.ln2} strokeWidth={.8}/>
      <circle cx={23} cy={20} r={3.5} fill={s?.on?"#fff":C.mt2}/>
      {s?.on&&<><path d="M40 14 Q46 10 40 6" fill="none" stroke="#fff" strokeWidth={.7} opacity={.5}/><path d="M42 16 Q50 10 42 4" fill="none" stroke="#fff" strokeWidth={.7} opacity={.3}/></>}
      <text x={23} y={8} textAnchor="middle" fill={C.mt2} fontSize={5.5} fontFamily={F.m}>BUZZ</text>
    </g>,
  },
  pot: {
    name: "Potentiometer", w: 56, h: 50, cat: "Input", icon: "🎛",
    props: { value: 512 },
    pins: [
      { id:"vcc",x:8,y:50,s:"b",label:"VCC",type:"power" },
      { id:"sig",x:28,y:50,s:"b",label:"SIG",type:"aout" },
      { id:"gnd",x:48,y:50,s:"b",label:"GND",type:"gnd" },
    ],
    draw:(s,p)=>{
      const v=(p?.value??512)/1023;
      const angle=-135+v*270;
      const rad=angle*Math.PI/180;
      return <g>
        <circle cx={28} cy={22} r={16} fill={C.sf2} stroke={C.ln2} strokeWidth={.8}/>
        <circle cx={28} cy={22} r={2} fill={C.mt2}/>
        <line x1={28} y1={22} x2={28+Math.cos(rad)*12} y2={22+Math.sin(rad)*12} stroke={C.sv} strokeWidth={1.4} strokeLinecap="round"/>
        <text x={28} y={8} textAnchor="middle" fill={C.mt2} fontSize={5.5} fontFamily={F.m}>POT</text>
        <text x={28} y={44} textAnchor="middle" fill={C.mt2} fontSize={5} fontFamily={F.m}>{Math.round(v*100)}%</text>
      </g>;
    },
  },
  ldr: {
    name: "LDR", w: 44, h: 46, cat: "Input", icon: "☀",
    props: { value: 700 },
    pins: [
      { id:"a",x:0,y:23,s:"l",label:"A",type:"aout" },
      { id:"b",x:44,y:23,s:"r",label:"B",type:"pass" },
    ],
    draw:(s,p)=>{
      const v=(p?.value??700)/1023;
      return <g>
        <circle cx={22} cy={20} r={13} fill={C.sf2} stroke={C.ln2} strokeWidth={.8}/>
        <path d="M12 20 l3-6 5 12 5-12 5 12 3-6" fill="none" stroke={C.sv} strokeWidth={1}/>
        <line x1={8} y1={10} x2={14} y2={14} stroke={C.mt2} strokeWidth={.7}/>
        <line x1={6} y1={14} x2={12} y2={18} stroke={C.mt2} strokeWidth={.7}/>
        <text x={22} y={40} textAnchor="middle" fill={C.mt2} fontSize={5} fontFamily={F.m}>{Math.round(v*100)}%</text>
      </g>;
    },
  },
  servo: {
    name: "Servo Motor", w: 70, h: 54, cat: "Output", icon: "⚙",
    pins: [
      { id:"sig",x:18,y:54,s:"b",label:"SIG",type:"in" },
      { id:"vcc",x:35,y:54,s:"b",label:"5V",type:"power" },
      { id:"gnd",x:52,y:54,s:"b",label:"GND",type:"gnd" },
    ],
    draw:(s)=>{
      const angle=s?.angle??0;
      const rad=(angle-90)*Math.PI/180;
      return <g>
        <rect x={4} y={10} width={62} height={30} rx={4} fill={C.sf2} stroke={C.ln2} strokeWidth={.8}/>
        <circle cx={22} cy={8} r={7} fill={C.sf} stroke={C.ln3} strokeWidth={.7}/>
        <line x1={22} y1={8} x2={22+Math.cos(rad)*6} y2={8+Math.sin(rad)*6} stroke={C.sv} strokeWidth={1.4} strokeLinecap="round"/>
        <text x={46} y={22} textAnchor="middle" fill={C.mt2} fontSize={6} fontFamily={F.m}>SERVO</text>
        <text x={46} y={34} textAnchor="middle" fill={C.sv} fontSize={7} fontFamily={F.m}>{Math.round(angle)}°</text>
      </g>;
    },
  },
  dht11: {
    name: "DHT11 Sensor", w: 50, h: 52, cat: "Input", icon: "🌡",
    props: { temp: 27, hum: 65 },
    pins: [
      { id:"vcc",x:10,y:52,s:"b",label:"VCC",type:"power" },
      { id:"data",x:25,y:52,s:"b",label:"DATA",type:"aout" },
      { id:"gnd",x:40,y:52,s:"b",label:"GND",type:"gnd" },
    ],
    draw:(s,p)=><g>
      <rect x={3} y={3} width={44} height={36} rx={4} fill={C.sf2} stroke={C.ln2} strokeWidth={.8}/>
      <text x={25} y={15} textAnchor="middle" fill={C.sv} fontSize={7} fontFamily={F.m}>DHT11</text>
      <text x={25} y={26} textAnchor="middle" fill={C.mt2} fontSize={6} fontFamily={F.m}>{p?.temp??27}°C</text>
      <text x={25} y={36} textAnchor="middle" fill={C.mt2} fontSize={6} fontFamily={F.m}>{p?.hum??65}%</text>
    </g>,
  },
  relay: {
    name: "Relay Module", w: 60, h: 50, cat: "Output", icon: "⏻",
    pins: [
      { id:"sig",x:0,y:15,s:"l",label:"IN",type:"in" },
      { id:"vcc",x:0,y:30,s:"l",label:"VCC",type:"power" },
      { id:"gnd",x:0,y:42,s:"l",label:"GND",type:"gnd" },
      { id:"com",x:60,y:15,s:"r",label:"COM",type:"out" },
      { id:"no",x:60,y:30,s:"r",label:"NO",type:"out" },
      { id:"nc",x:60,y:42,s:"r",label:"NC",type:"out" },
    ],
    draw:(s)=><g>
      <rect x={3} y={3} width={54} height={44} rx={4} fill={C.sf2} stroke={s?.on?"#fff":C.ln2} strokeWidth={s?.on?1.2:.8}/>
      <rect x={16} y={10} width={28} height={18} rx={3} fill={s?.on?C.sf3:C.sf} stroke={C.ln3} strokeWidth={.6}/>
      <text x={30} y={22} textAnchor="middle" fill={s?.on?"#fff":C.mt2} fontSize={7} fontFamily={F.m}>{s?.on?"ON":"OFF"}</text>
      <text x={30} y={42} textAnchor="middle" fill={C.mt2} fontSize={5.5} fontFamily={F.m}>RELAY</text>
    </g>,
  },
  oled: {
    name: "OLED 128×64", w: 80, h: 60, cat: "Output", icon: "🖥",
    pins: [
      { id:"vcc",x:14,y:60,s:"b",label:"VCC",type:"power" },
      { id:"gnd",x:30,y:60,s:"b",label:"GND",type:"gnd" },
      { id:"scl",x:48,y:60,s:"b",label:"SCL",type:"in" },
      { id:"sda",x:66,y:60,s:"b",label:"SDA",type:"in" },
    ],
    draw:(s)=><g>
      <rect x={2} y={2} width={76} height={46} rx={4} fill="#050505" stroke={C.ln2} strokeWidth={.8}/>
      {s?.lines?s.lines.map((l,i)=><text key={i} x={40} y={16+i*11} textAnchor="middle" fill={C.sv} fontSize={7} fontFamily={F.m}>{l.slice(0,16)}</text>)
      :<text x={40} y={28} textAnchor="middle" fill={C.ln3} fontSize={6} fontFamily={F.m}>128×64 OLED</text>}
      <text x={40} y={56} textAnchor="middle" fill={C.mt2} fontSize={5} fontFamily={F.m}>SSD1306 I2C</text>
    </g>,
  },
  cap: {
    name: "Capacitor", w: 40, h: 34, cat: "Passive", icon: "⊥",
    props: { uf: 1000 },
    pins: [
      { id:"pos",x:0,y:17,s:"l",label:"+",type:"pass" },
      { id:"neg",x:40,y:17,s:"r",label:"−",type:"pass" },
    ],
    draw:(s,p)=><g>
      <line x1={0} y1={17} x2={16} y2={17} stroke={C.mt} strokeWidth={1.2}/>
      <line x1={16} y1={5} x2={16} y2={29} stroke={C.sv} strokeWidth={1.6}/>
      <path d="M22 5 Q20 17 22 29" fill="none" stroke={C.sv} strokeWidth={1.6}/>
      <line x1={22} y1={17} x2={40} y2={17} stroke={C.mt} strokeWidth={1.2}/>
      <text x={20} y={34} textAnchor="middle" fill={C.mt2} fontSize={5.5} fontFamily={F.m}>{p?.uf??1000}µF</text>
    </g>,
  },
};

const CATS = ["Boards","Input","Output","Passive"];
const PALETTE = Object.entries(DEFS).map(([t,d])=>({type:t,...d}));

const PIN_MAP = {2:"d2",4:"d4",5:"d5",12:"d12",13:"d13",14:"d14",15:"d15",16:"d16",18:"d18",19:"d19",23:"d23",25:"d25"};

// ─── Presets ───
const PRESETS = [
  { name: "Blink LED", desc: "ESP32 + LED + resistor on D2",
    comps: [
      { id:1,type:"esp32",x:60,y:80 },
      { id:2,type:"resistor",x:200,y:140 },
      { id:3,type:"led",x:310,y:110 },
    ],
    wires: [
      { id:10,from:{compId:1,pinId:"d2"},to:{compId:2,pinId:"a"} },
      { id:11,from:{compId:2,pinId:"b"},to:{compId:3,pinId:"a"} },
      { id:12,from:{compId:3,pinId:"k"},to:{compId:1,pinId:"gnd"} },
    ],
    code: `void setup() {\n  pinMode(2, OUTPUT);\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  digitalWrite(2, HIGH);\n  Serial.println("LED ON");\n  delay(500);\n  digitalWrite(2, LOW);\n  Serial.println("LED OFF");\n  delay(500);\n}`
  },
  { name: "RGB Fade", desc: "RGB LED on D13, D14, D15",
    comps: [
      { id:1,type:"esp32",x:50,y:60 },
      { id:2,type:"rgb_led",x:280,y:100 },
    ],
    wires: [
      { id:10,from:{compId:1,pinId:"d13"},to:{compId:2,pinId:"r"} },
      { id:11,from:{compId:1,pinId:"d14"},to:{compId:2,pinId:"g"} },
      { id:12,from:{compId:1,pinId:"d15"},to:{compId:2,pinId:"b"} },
      { id:13,from:{compId:2,pinId:"gnd"},to:{compId:1,pinId:"gnd"} },
    ],
    code: `void setup() {\n  pinMode(13, OUTPUT);\n  pinMode(14, OUTPUT);\n  pinMode(15, OUTPUT);\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  digitalWrite(14, LOW);\n  digitalWrite(15, LOW);\n  Serial.println("RED");\n  delay(800);\n  digitalWrite(13, LOW);\n  digitalWrite(14, HIGH);\n  Serial.println("GREEN");\n  delay(800);\n  digitalWrite(14, LOW);\n  digitalWrite(15, HIGH);\n  Serial.println("BLUE");\n  delay(800);\n}`
  },
  { name: "Servo Sweep", desc: "Servo on D18",
    comps: [
      { id:1,type:"esp32",x:50,y:60 },
      { id:2,type:"servo",x:260,y:100 },
    ],
    wires: [
      { id:10,from:{compId:1,pinId:"d18"},to:{compId:2,pinId:"sig"} },
      { id:11,from:{compId:1,pinId:"3v3"},to:{compId:2,pinId:"vcc"} },
      { id:12,from:{compId:2,pinId:"gnd"},to:{compId:1,pinId:"gnd"} },
    ],
    code: `void setup() {\n  Serial.begin(115200);\n  Serial.println("Servo sweep");\n}\n\nvoid loop() {\n  servoWrite(18, 0);\n  Serial.println("0 degrees");\n  delay(600);\n  servoWrite(18, 90);\n  Serial.println("90 degrees");\n  delay(600);\n  servoWrite(18, 180);\n  Serial.println("180 degrees");\n  delay(600);\n}`
  },
];

const DEFAULT_CODE = `// Circuit Lab — Techie Heshan
// Drag components → wire pins → run

void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(115200);
  Serial.println("Ready!");
}

void loop() {
  digitalWrite(2, HIGH);
  Serial.println("LED ON");
  delay(500);
  digitalWrite(2, LOW);
  Serial.println("LED OFF");
  delay(500);
}`;

let nid = 100;

function CircuitLab() {
  const [comps, setComps] = useState([]);
  const [wires, setWires] = useState([]);
  const [ws, setWs] = useState(null); // wire start
  const [code, setCode] = useState(DEFAULT_CODE);
  const [serial, setSerial] = useState([]);
  const [run, setRun] = useState(false);
  const [sim, setSim] = useState({});
  const [drag, setDrag] = useState(null);
  const [dOff, setDOff] = useState({x:0,y:0});
  const [sel, setSel] = useState(null);
  const [hPin, setHPin] = useState(null);
  const [tab, setTab] = useState("code");
  const compsRef = useRef(comps);
  const wiresRef = useRef(wires); // code | presets | props
  const [hist, setHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  useEffect(() => { compsRef.current = comps; }, [comps]);
  useEffect(() => { wiresRef.current = wires; }, [wires]);
  const cvRef = useRef(null);
  const tmRef = useRef(null);
  const tRef = useRef(0);
  const srRef = useRef(null);

  // History
  const snap = useCallback(() => {
    const s = JSON.stringify({ comps, wires });
    setHist(p => [...p.slice(0, hIdx + 1), s].slice(-30));
    setHIdx(p => Math.min(p + 1, 29));
  }, [comps, wires, hIdx]);

  const undo = useCallback(() => {
    if (hIdx <= 0) return;
    const s = JSON.parse(hist[hIdx - 1]);
    setComps(s.comps); setWires(s.wires);
    setHIdx(p => p - 1);
  }, [hist, hIdx]);

  const redo = useCallback(() => {
    if (hIdx >= hist.length - 1) return;
    const s = JSON.parse(hist[hIdx + 1]);
    setComps(s.comps); setWires(s.wires);
    setHIdx(p => p + 1);
  }, [hist, hIdx]);

  // Drop
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const t = e.dataTransfer.getData("ct");
    if (!t || !DEFS[t]) return;
    const r = cvRef.current.getBoundingClientRect();
    const d = DEFS[t];
    const x = Math.round((e.clientX - r.left - d.w/2) / 14) * 14;
    const y = Math.round((e.clientY - r.top - d.h/2) / 14) * 14;
    const nc = { id: nid++, type: t, x: Math.max(0,x), y: Math.max(0,y), props: d.props ? {...d.props} : {} };
    setComps(p => [...p, nc]);
    setTimeout(snap, 0);
  }, [snap]);

  // Move
  const onCmpDown = useCallback((e, c) => {
    if (e.target.closest(".ph")) return;
    e.stopPropagation();
    const r = cvRef.current.getBoundingClientRect();
    setDrag(c.id);
    setDOff({ x: e.clientX - r.left - c.x, y: e.clientY - r.top - c.y });
    setSel(c.id);
  }, []);

  const onMove = useCallback((e) => {
    if (drag == null) return;
    const r = cvRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - r.left - dOff.x) / 14) * 14;
    const y = Math.round((e.clientY - r.top - dOff.y) / 14) * 14;
    setComps(p => p.map(c => c.id === drag ? { ...c, x: Math.max(0,x), y: Math.max(0,y) } : c));
  }, [drag, dOff]);

  const onUp = useCallback(() => { if (drag != null) { setDrag(null); snap(); } }, [drag, snap]);

  // Wire
  const onPin = useCallback((cid, pid) => {
    if (!ws) { setWs({ compId: cid, pinId: pid }); }
    else {
      if (ws.compId !== cid || ws.pinId !== pid) {
        setWires(p => [...p, { id: nid++, from: ws, to: { compId: cid, pinId: pid } }]);
        setTimeout(snap, 0);
      }
      setWs(null);
    }
  }, [ws, snap]);

  // Keys
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      if ((e.key === "Delete" || e.key === "Backspace") && sel != null) {
        setComps(p => p.filter(c => c.id !== sel));
        setWires(p => p.filter(w => w.from.compId !== sel && w.to.compId !== sel));
        setSel(null); snap();
      }
      if (e.key === "Escape") setWs(null);
      if (e.ctrlKey && e.key === "z") { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [sel, snap, undo, redo]);

  // Pin pos
  const pinPos = useCallback((cid, pid) => {
    const c = comps.find(x => x.id === cid);
    if (!c) return null;
    const d = DEFS[c.type];
    const pin = d.pins.find(p => p.id === pid);
    if (!pin) return null;
    return { x: c.x + pin.x, y: c.y + pin.y };
  }, [comps]);

  // Serial
  const addS = useCallback((msg, hot = false) => {
    const t = (tRef.current / 1000).toFixed(1).padStart(5, "0");
    setSerial(p => [...p.slice(-18), { t: t + "s", msg, hot }]);
  }, []);

  useEffect(() => {
    if (srRef.current) srRef.current.scrollTop = srRef.current.scrollHeight;
  }, [serial]);

  // Simulator
  const startSim = useCallback(() => {
    if (run) {
      clearInterval(tmRef.current); setRun(false); addS("Sketch halted.", true); setSim({}); return;
    }
    setRun(true); tRef.current = 0; setSerial([]);
    addS("Compiling sketch…"); addS("Upload → ESP32", true);

    const actions = [];
    const lines = code.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("//"));
    let inLoop = false, inSetup = false, brace = 0;

    for (const line of lines) {
      if (line.includes("void setup")) { inSetup = true; inLoop = false; brace = 0; continue; }
      if (line.includes("void loop")) { inLoop = true; inSetup = false; brace = 0; continue; }
      if (line.includes("{")) brace++;
      if (line.includes("}")) { brace--; if (brace < 0) { inLoop = false; inSetup = false; } }

      const target = inSetup ? "setup" : inLoop ? "loop" : null;
      if (!target) continue;

      let m;
      if ((m = line.match(/digitalWrite\((\d+),\s*(HIGH|LOW)\)/))) {
        actions.push({ phase: target, type: "dw", pin: +m[1], val: m[2] === "HIGH" });
      }
      if ((m = line.match(/Serial\.println\("([^"]*)"\)/))) {
        actions.push({ phase: target, type: "pr", msg: m[1] });
      }
      if ((m = line.match(/delay\((\d+)\)/))) {
        actions.push({ phase: target, type: "dl", ms: +m[1] });
      }
      if ((m = line.match(/servoWrite\((\d+),\s*(\d+)\)/))) {
        actions.push({ phase: target, type: "sv", pin: +m[1], angle: +m[2] });
      }
    }

    // Build timeline
    const timeline = [];
    let t = 0;
    // Setup
    for (const a of actions.filter(a => a.phase === "setup")) {
      if (a.type === "dl") t += a.ms; else timeline.push({ time: t, ...a });
    }
    // Loop x20
    const loopActs = actions.filter(a => a.phase === "loop");
    for (let rep = 0; rep < 20; rep++) {
      for (const a of loopActs) {
        if (a.type === "dl") t += a.ms; else timeline.push({ time: t, ...a });
      }
    }

    const esp = comps.find(c => c.type === "esp32");
    const iv = 80;
    tmRef.current = setInterval(() => {
      tRef.current += iv;
      const due = timeline.filter(s => s.time <= tRef.current && s.time > tRef.current - iv);
      for (const s of due) {
        if (s.type === "pr") addS(s.msg);
        if (s.type === "dw" && esp) {
          const ep = PIN_MAP[s.pin];
          if (!ep) continue;
          setSim(prev => {
            const next = { ...prev, [`pin${s.pin}`]: s.val };
            if (s.pin === 2) next.led2 = s.val;
            // Propagate through wires
            const cw = wiresRef.current.filter(w =>
              (w.from.compId === esp.id && w.from.pinId === ep) ||
              (w.to.compId === esp.id && w.to.pinId === ep));
            for (const wire of cw) {
              const oe = wire.from.compId === esp.id ? wire.to : wire.from;
              const oc = compsRef.current.find(c => c.id === oe.compId);
              if (!oc) continue;
              if (oc.type === "led") next[`led_${oc.id}`] = s.val;
              if (oc.type === "buzzer") next[`buzz_${oc.id}`] = s.val;
              if (oc.type === "relay") next[`relay_${oc.id}`] = s.val;
              if (oc.type === "rgb_led") {
                if (oe.pinId === "r") next[`rgbr_${oc.id}`] = s.val;
                if (oe.pinId === "g") next[`rgbg_${oc.id}`] = s.val;
                if (oe.pinId === "b") next[`rgbb_${oc.id}`] = s.val;
              }
            }
            return next;
          });
        }
        if (s.type === "sv" && esp) {
          const ep = PIN_MAP[s.pin];
          if (!ep) continue;
          const cw2 = wiresRef.current.filter(w =>
            (w.from.compId === esp.id && w.from.pinId === ep) ||
            (w.to.compId === esp.id && w.to.pinId === ep));
          for (const wire of cw2) {
            const oe = wire.from.compId === esp.id ? wire.to : wire.from;
            const oc = compsRef.current.find(c => c.id === oe.compId);
            if (oc?.type === "servo") setSim(prev => ({ ...prev, [`servo_${oc.id}`]: s.angle }));
          }
        }
      }
      if (tRef.current > t + 1000) { clearInterval(tmRef.current); setRun(false); addS("Simulation complete.", true); }
    }, iv);
  }, [run, code, comps, wires, addS]);

  useEffect(() => () => clearInterval(tmRef.current), []);

  // Component state
  const cState = useCallback((c) => {
    const s = {};
    if (c.type === "esp32") s.led2 = sim.led2;
    if (c.type === "led") s.on = sim[`led_${c.id}`];
    if (c.type === "rgb_led") { s.r = sim[`rgbr_${c.id}`]; s.g = sim[`rgbg_${c.id}`]; s.b = sim[`rgbb_${c.id}`]; }
    if (c.type === "buzzer") s.on = sim[`buzz_${c.id}`];
    if (c.type === "relay") s.on = sim[`relay_${c.id}`];
    if (c.type === "servo") s.angle = sim[`servo_${c.id}`] ?? 0;
    if (c.type === "oled") s.lines = sim[`oled_${c.id}`];
    if (c.type === "button") s.pressed = sim[`btn_${c.id}`];
    return s;
  }, [sim]);

  // Load preset
  const loadPreset = useCallback((p) => {
    if (run) { clearInterval(tmRef.current); setRun(false); }
    setComps(p.comps.map(c => ({...c, props: DEFS[c.type]?.props ? {...DEFS[c.type].props} : {}}))); setWires([...p.wires]); setCode(p.code);
    setSim({}); setSerial([]); addS("Loaded: " + p.name, true); setTab("code");
    nid = Math.max(...p.comps.map(c=>c.id), ...p.wires.map(w=>w.id)) + 10;
  }, [run, addS]);

  // Selected component
  const selComp = comps.find(c => c.id === sel);
  const selDef = selComp ? DEFS[selComp.type] : null;

  const sty = {
    panel: { background: C.bg2, borderRight: `1px solid ${C.ln}`, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 },
    pHead: { padding: "10px 14px", borderBottom: `1px solid ${C.ln}`, fontFamily: F.m, fontSize: 9, letterSpacing: ".14em", color: C.mt2, textTransform: "uppercase" },
    pItem: { margin: "0 8px 5px", padding: "8px 10px", background: C.sf, border: `1px solid ${C.ln}`, borderRadius: 8, cursor: "grab", display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: F.d, fontWeight: 600, transition: "border-color .15s" },
    tab: (active) => ({ flex: 1, background: active ? C.sf : "transparent", border: "none", borderBottom: active ? `2px solid ${C.tx}` : `2px solid transparent`, color: active ? C.tx : C.mt2, fontFamily: F.m, fontSize: 9, letterSpacing: ".1em", padding: "10px 0", textTransform: "uppercase" }),
    topBtn: { background: "none", border: `1px solid ${C.ln2}`, borderRadius: 6, padding: "4px 10px", color: C.mt, fontFamily: F.m, fontSize: 9, letterSpacing: ".06em", cursor: "pointer" },
    runBtn: (r) => ({ background: r ? C.mt : C.tx, border: "none", borderRadius: 6, padding: "4px 14px", color: C.bg, fontFamily: F.m, fontWeight: 600, fontSize: 9, letterSpacing: ".06em", cursor: "pointer" }),
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.bg, color: C.tx, fontFamily: F.b, overflow: "hidden" }}>
      {/* LEFT: Palette */}
      <div style={{ ...sty.panel, width: 180 }}>
        <div style={sty.pHead}>Components</div>
        <div style={{ flex: 1, overflow: "auto", padding: "6px 0" }}>
          {CATS.map(cat => (
            <div key={cat}>
              <div style={{ padding: "8px 14px 3px", fontFamily: F.m, fontSize: 8, letterSpacing: ".16em", color: C.mt2, textTransform: "uppercase" }}>{cat}</div>
              {PALETTE.filter(p => p.cat === cat).map(item => (
                <div key={item.type} draggable onDragStart={e => e.dataTransfer.setData("ct", item.type)}
                  style={sty.pItem}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.gs}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.ln}>
                  <span style={{ fontSize: 11, filter: "grayscale(1)" }}>{item.icon}</span>
                  <span style={{ fontSize: 11 }}>{item.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: `1px solid ${C.ln}` }}>
          <div style={{ fontFamily: F.m, fontSize: 7, letterSpacing: ".08em", color: C.mt2, lineHeight: 1.9, textTransform: "uppercase" }}>
            Drag → place · Click pins → wire<br/>Del → remove · Ctrl+Z → undo<br/>Esc → cancel wire
          </div>
        </div>
      </div>

      {/* CENTER: Canvas */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: 42, borderBottom: `1px solid ${C.ln}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, background: C.bg2 }}>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 13, letterSpacing: ".04em" }}>CIRCUIT LAB</span>
          <span style={{ fontFamily: F.m, fontSize: 8, color: C.mt2, letterSpacing: ".12em" }}>TECHIE HESHAN</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontFamily: F.m, fontSize: 8, color: C.mt2 }}>{comps.length} components · {wires.length} wires</span>
          <button onClick={undo} style={sty.topBtn} title="Undo (Ctrl+Z)">↩</button>
          <button onClick={redo} style={sty.topBtn} title="Redo (Ctrl+Y)">↪</button>
          <button onClick={() => { setComps([]); setWires([]); setSim({}); setSerial([]); if(run){clearInterval(tmRef.current);setRun(false);} }} style={sty.topBtn}>CLEAR</button>
          <button onClick={startSim} style={sty.runBtn(run)}>{run ? "■ STOP" : "▶ RUN"}</button>
        </div>

        <div ref={cvRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: C.bg, cursor: ws ? "crosshair" : drag ? "grabbing" : "default" }}
          onDrop={onDrop} onDragOver={e => e.preventDefault()}
          onMouseMove={onMove} onMouseUp={onUp}
          onClick={() => { setSel(null); setWs(null); }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <defs>
              <pattern id="gd" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r=".5" fill={C.ln}/></pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gd)"/>
          </svg>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <defs><filter id="glo"><feGaussianBlur in="SourceGraphic" stdDeviation="4"/></filter></defs>
            {wires.map(w => {
              const p1 = pinPos(w.from.compId, w.from.pinId);
              const p2 = pinPos(w.to.compId, w.to.pinId);
              if (!p1 || !p2) return null;
              const dx = Math.abs(p2.x - p1.x) * 0.45;
              return <path key={w.id} d={`M${p1.x} ${p1.y} C${p1.x+dx} ${p1.y} ${p2.x-dx} ${p2.y} ${p2.x} ${p2.y}`}
                fill="none" stroke={C.mt} strokeWidth={1.4} strokeLinecap="round"/>;
            })}
            {ws && (() => {
              const p = pinPos(ws.compId, ws.pinId);
              if (!p) return null;
              return <circle cx={p.x} cy={p.y} r={8} fill="none" stroke="#fff" strokeWidth={.8} strokeDasharray="3 3" opacity={.5}>
                <animate attributeName="r" values="8;14;8" dur="1.2s" repeatCount="indefinite"/>
              </circle>;
            })()}
            {comps.map(c => {
              const d = DEFS[c.type];
              const isSel = sel === c.id;
              return <g key={c.id} transform={`translate(${c.x},${c.y})`}
                onMouseDown={e => onCmpDown(e, c)} style={{ cursor: drag === c.id ? "grabbing" : "grab" }}>
                {isSel && <rect x={-3} y={-3} width={d.w+6} height={d.h+6} rx={8} fill="none" stroke={C.gs} strokeWidth={.8} strokeDasharray="3 3"/>}
                {d.draw(cState(c), c.props)}
                {d.pins.map(pin => {
                  const k = `${c.id}-${pin.id}`;
                  const isSt = ws?.compId === c.id && ws?.pinId === pin.id;
                  const isH = hPin === k;
                  return <g key={pin.id} className="ph" style={{ cursor: "crosshair" }}
                    onClick={e => { e.stopPropagation(); onPin(c.id, pin.id); }}
                    onMouseEnter={() => setHPin(k)} onMouseLeave={() => setHPin(null)}>
                    <circle cx={pin.x} cy={pin.y} r={9} fill="transparent"/>
                    <circle cx={pin.x} cy={pin.y} r={isSt||isH?4.5:3}
                      fill={isSt?"#fff":isH?C.sv:C.mt2}
                      filter={isSt?"url(#glo)":"none"}/>
                    <text x={pin.x+(pin.s==="l"?9:pin.s==="r"?-9:0)}
                      y={pin.y+(pin.s==="b"?-8:0)+3}
                      textAnchor={pin.s==="l"?"start":pin.s==="r"?"end":"middle"}
                      fill={isH?C.tx:C.mt2} fontSize={6} fontFamily={F.m}
                      style={{ pointerEvents: "none" }}>{pin.label}</text>
                  </g>;
                })}
              </g>;
            })}
          </svg>
          {comps.length === 0 && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, pointerEvents: "none" }}>
            <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: ".16em", color: C.mt2, textTransform: "uppercase" }}>Drag components here</span>
            <span style={{ fontFamily: F.m, fontSize: 8, color: C.ln3 }}>Or load a preset from the right panel →</span>
          </div>}
        </div>
      </div>

      {/* RIGHT: Code / Presets / Props */}
      <div style={{ ...sty.panel, width: 300, borderLeft: `1px solid ${C.ln}`, borderRight: "none" }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.ln}` }}>
          <button onClick={() => setTab("code")} style={sty.tab(tab==="code")}>Code</button>
          <button onClick={() => setTab("presets")} style={sty.tab(tab==="presets")}>Presets</button>
          <button onClick={() => setTab("props")} style={sty.tab(tab==="props")}>Properties</button>
        </div>

        {tab === "code" && <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderBottom: `1px solid ${C.ln}`, background: C.sf }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4A4A4A" }}/>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6B6B6B" }}/>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8C8C8C" }}/>
            <span style={{ fontFamily: F.m, fontSize: 10, color: C.mt, marginLeft: 4 }}>sketch.ino</span>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
            style={{ flex: 1, resize: "none", background: "#080808", border: "none", padding: 12, color: C.tx, fontFamily: F.m, fontSize: 11, lineHeight: 1.7, outline: "none", width: "100%" }}/>
        </div>}

        {tab === "presets" && <div style={{ flex: 1, overflow: "auto", padding: 10 }}>
          <div style={{ fontFamily: F.m, fontSize: 8, color: C.mt2, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10, padding: "0 4px" }}>Load a pre-wired circuit</div>
          {PRESETS.map((p, i) => (
            <div key={i} onClick={() => loadPreset(p)}
              style={{ padding: "12px 14px", background: C.sf, border: `1px solid ${C.ln}`, borderRadius: 10, marginBottom: 8, cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.gs}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.ln}>
              <div style={{ fontFamily: F.d, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontFamily: F.m, fontSize: 9, color: C.mt2 }}>{p.desc}</div>
            </div>
          ))}
        </div>}

        {tab === "props" && <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
          {selComp && selDef ? <>
            <div style={{ fontFamily: F.d, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{selDef.name}</div>
            <div style={{ fontFamily: F.m, fontSize: 8, color: C.mt2, letterSpacing: ".1em", marginBottom: 16 }}>ID: {selComp.id} · PINS: {selDef.pins.length}</div>
            {selComp.props && Object.entries(selComp.props).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={{ fontFamily: F.m, fontSize: 8, letterSpacing: ".1em", color: C.mt2, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{k}</label>
                {typeof v === "number" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="range" min={k.includes("angle")?0:0} max={k.includes("angle")?180:k==="ohms"?10000:1023}
                      value={v} onChange={e => setComps(p => p.map(c => c.id === sel ? { ...c, props: { ...c.props, [k]: +e.target.value } } : c))}
                      style={{ flex: 1, accentColor: C.sv }}/>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: C.sv, minWidth: 40, textAlign: "right" }}>{v}</span>
                  </div>
                ) : (
                  <input type="text" value={v}
                    onChange={e => setComps(p => p.map(c => c.id === sel ? { ...c, props: { ...c.props, [k]: e.target.value } } : c))}
                    style={{ width: "100%", background: "#080808", border: `1px solid ${C.ln2}`, borderRadius: 6, padding: "6px 10px", color: C.tx, fontFamily: F.m, fontSize: 10, outline: "none" }}/>
                )}
              </div>
            ))}
            <button onClick={() => { setComps(p=>p.filter(c=>c.id!==sel)); setWires(p=>p.filter(w=>w.from.compId!==sel&&w.to.compId!==sel)); setSel(null); }}
              style={{ ...sty.topBtn, marginTop: 10, width: "100%", textAlign: "center", color: C.mt, padding: "8px 0" }}>
              DELETE COMPONENT
            </button>
          </> : <div style={{ color: C.mt2, fontFamily: F.m, fontSize: 9, textAlign: "center", paddingTop: 40 }}>
            Select a component<br/>to view properties
          </div>}
        </div>}

        {/* Serial always visible at bottom */}
        <div style={{ height: 180, borderTop: `1px solid ${C.ln}`, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderBottom: `1px solid ${C.ln}`, background: C.sf }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: run ? "#fff" : C.mt2, boxShadow: run ? "0 0 6px #fff" : "none" }}/>
            <span style={{ fontFamily: F.m, fontSize: 8, letterSpacing: ".1em", color: C.mt2, textTransform: "uppercase" }}>Serial — 115200</span>
            <span style={{ flex: 1 }}/>
            <button onClick={() => setSerial([])} style={{ ...sty.topBtn, fontSize: 8, padding: "2px 8px" }}>CLR</button>
          </div>
          <div ref={srRef} style={{ flex: 1, overflow: "auto", padding: "6px 12px", fontFamily: F.m, fontSize: 10, lineHeight: 1.7, background: "#080808" }}>
            {serial.map((s, i) => (
              <div key={i} style={{ color: s.hot ? C.tx : C.mt, animation: "fadeIn .2s ease" }}>
                <span style={{ color: C.sv, marginRight: 8 }}>{s.t}</span>{s.msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-3px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<CircuitLab />);
