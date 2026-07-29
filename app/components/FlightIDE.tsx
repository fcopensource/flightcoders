"use client";
import {useMemo,useState} from "react";
import Editor from "@monaco-editor/react";
import {judgeLanguages,type JudgeLanguage} from "../../lib/judge0";
import {destinationMission} from "../../lib/flightMission";

type JudgeResult={
 accepted:boolean;status:string;stdout:string;stderr:string;compileOutput:string;
 message:string;runtimeMs:number;memoryKb:number;
 mission:{passed:boolean;completed:number;total:number;progress:number;nextCheckpoint:string|null};
};
type FlightState="standby"|"compiling"|"grounded"|"taxi"|"airborne"|"destination"|"fault";
const languages=Object.entries(judgeLanguages) as [JudgeLanguage,(typeof judgeLanguages)[JudgeLanguage]][];

function starterFor(language:JudgeLanguage){
 if(language==="javascript")return `// FlightCoders free-flight playground\nconst aircraft = { callSign: "FC-101", altitude: 35000, speed: 480 };\nconsole.log(\`\${aircraft.callSign} cleared for takeoff\`);\nconsole.log(\`Cruising at \${aircraft.altitude} ft · \${aircraft.speed} kt\`);\n`;
 if(language==="typescript")return `type Aircraft = { callSign: string; altitude: number; speed: number };\nconst aircraft: Aircraft = { callSign: "FC-101", altitude: 35000, speed: 480 };\nconsole.log(\`\${aircraft.callSign} cleared for takeoff\`);\n`;
 if(language==="python")return `# FlightCoders free-flight playground\naircraft = {"call_sign": "FC-101", "altitude": 35000, "speed": 480}\nprint(f"{aircraft['call_sign']} cleared for takeoff")\nprint(f"Cruising at {aircraft['altitude']} ft · {aircraft['speed']} kt")\n`;
 if(language==="java")return `public class Main {\n    public static void main(String[] args) {\n        String callSign = "FC-101";\n        int altitude = 35000;\n        int speed = 480;\n        System.out.println(callSign + " cleared for takeoff");\n        System.out.println("Cruising at " + altitude + " ft · " + speed + " kt");\n    }\n}\n`;
 if(language==="c")return `#include <stdio.h>\nint main(void) {\n    printf("FC-101 cleared for takeoff\\n");\n    printf("Cruising at 35000 ft · 480 kt\\n");\n    return 0;\n}\n`;
 if(language==="cpp")return `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "FC-101 cleared for takeoff" << '\\n';\n    cout << "Cruising at 35000 ft · 480 kt" << '\\n';\n    return 0;\n}\n`;
 if(language==="csharp")return `using System;\npublic class MainClass {\n    public static void Main() {\n        Console.WriteLine("FC-101 cleared for takeoff");\n        Console.WriteLine("Cruising at 35000 ft · 480 kt");\n    }\n}\n`;
 if(language==="go")return `package main\nimport "fmt"\nfunc main() {\n    fmt.Println("FC-101 cleared for takeoff")\n    fmt.Println("Cruising at 35000 ft · 480 kt")\n}\n`;
 if(language==="rust")return `fn main() {\n    println!("FC-101 cleared for takeoff");\n    println!("Cruising at 35000 ft · 480 kt");\n}\n`;
 if(language==="kotlin")return `fun main() {\n    println("FC-101 cleared for takeoff")\n    println("Cruising at 35000 ft · 480 kt")\n}\n`;
 if(language==="ruby")return `puts "FC-101 cleared for takeoff"\nputs "Cruising at 35000 ft · 480 kt"\n`;
 if(language==="php")return `<?php\necho "FC-101 cleared for takeoff\\n";\necho "Cruising at 35000 ft · 480 kt\\n";\n`;
 return `print("FC-101 cleared for takeoff")\nprint("Cruising at 35000 ft · 480 kt")\n`;
}

export function FlightIDE(){
 const [language,setLanguage]=useState<JudgeLanguage>("javascript");
 const [code,setCode]=useState(()=>starterFor("javascript"));
 const [stdin,setStdin]=useState("");
 const [result,setResult]=useState<JudgeResult|null>(null);
 const [flightState,setFlightState]=useState<FlightState>("standby");
 const [notice,setNotice]=useState("COCKPIT READY");
 const [nightVision,setNightVision]=useState(false);
 const metrics=useMemo(()=>({lines:code.split("\n").length,characters:code.length}),[code]);
 const output=result?.stdout||result?.compileOutput||result?.stderr||result?.message||"Run your program to begin the takeoff sequence.";

 function changeLanguage(next:JudgeLanguage){
  setLanguage(next);const saved=localStorage.getItem(`fc_playground_${next}`);
  setCode(saved||starterFor(next));setResult(null);setFlightState("standby");setNotice(saved?"DRAFT RECOVERED":"RUNTIME READY");
 }
 function save(){localStorage.setItem(`fc_playground_${language}`,code);setNotice("DRAFT SECURED")}
 function reset(){setCode(starterFor(language));setResult(null);setFlightState("standby");setNotice("COCKPIT RESET")}
 function animateSuccessfulMission(){
  setFlightState("taxi");setNotice("TAXIING TO RUNWAY");
  window.setTimeout(()=>{setFlightState("airborne");setNotice("AIRBORNE · MUMBAI BOUND")},900);
  window.setTimeout(()=>{setFlightState("destination");setNotice("DESTINATION REACHED")},3400);
 }
 async function run(){
  setFlightState("compiling");setNotice("ENGINES SPOOLING");setResult(null);
  try{
   const response=await fetch("/api/lab/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({language,sourceCode:code,stdin})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||"Execution service unavailable");
   const execution=data as JudgeResult;setResult(execution);
   if(!execution.accepted){setFlightState("fault");setNotice("SYSTEM FAULT")}
   else if(execution.mission.passed)animateSuccessfulMission();
   else{setFlightState("grounded");setNotice(`FLIGHT HOLD · ${execution.mission.completed}/${execution.mission.total} CHECKPOINTS`)}
  }catch(error){setFlightState("fault");setNotice(error instanceof Error?error.message.toUpperCase():"EXECUTION SERVICE UNAVAILABLE")}
 }

 const systemLogs=flightState==="compiling"
  ?["HANDSHAKE JUDGE0","ALLOCATING SANDBOX","COMPILING SOURCE","AWAITING TELEMETRY"]
  :flightState==="fault"
   ?["FAULT INTERRUPT","EXECUTION ABORTED","AIRCRAFT GROUNDED","DIAGNOSTICS READY"]
   :flightState==="destination"
    ?["MUMBAI TOWER LOCKED","RUNWAY 27 CAPTURED","TOUCHDOWN VERIFIED","MISSION ARCHIVED"]
    :flightState==="airborne"
     ?["NAV VECTOR LOCKED","AUTOPILOT ENGAGED","DATA LINK STABLE","DESTINATION TRACKING"]
     :["AVIONICS BUS ONLINE","NAV DATABASE LOADED","CONTROL SURFACES READY","AWAITING SOURCE CODE"];

 return <div className={`flight-playground state-${flightState} ${nightVision?"vision-green":""}`}>
  <aside className="sim-cockpit">
   <div className="sim-heading"><span>F/C HARDWARE SIMULATION DECK</span><div><button onClick={()=>setNightVision(value=>!value)}>{nightVision?"NORMAL HUD":"NVG MODE"}</button><b><i/> LIVE</b></div></div>
   <div className="sim-window" aria-label={`Flight simulation ${flightState}`}>
    <div className="hud-scanlines"/><div className="radar-sweep"/>
    <div className="sim-sky"><span className="sim-star s1"/><span className="sim-star s2"/><span className="sim-star s3"/></div>
    <div className="sim-horizon"><i/><i/><i/><i/><i/></div>
    <div className="sim-runway"><span/><span/><span/><span/><span/></div>
    <div className="sim-aircraft"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 3c5 0 8 7 9 17l3 25 35 24c4 3 6 7 6 11v7L72 73l-2 25 14 10v7l-24-5-24 5v-7l14-10-2-25L7 87v-7c0-4 2-8 6-11l35-24 3-25C52 10 55 3 60 3Z"/></svg><i/><b/></div>
    <div className="hud-bracket left"/><div className="hud-bracket right"/>
    <div className="hud-status"><small>FLIGHT MODE</small><strong>{flightState.toUpperCase()}</strong></div>
    <div className="hud-reticle"><i/><i/><span>+</span></div>
    <div className="hud-altitude"><span>ALT</span><b>{flightState==="airborne"?"35,000":"00000"}</b><small>FT</small></div>
    <div className="hud-speed"><span>SPD</span><b>{flightState==="airborne"?"480":flightState==="taxi"?"145":"000"}</b><small>KT</small></div>
    <div className="hardware-readout left"><span>BUS_A 28.4V</span><span>FCC_1 ONLINE</span><span>HYD 3000 PSI</span></div>
    <div className="hardware-readout right"><span>GPS SAT 12</span><span>NAV LOCK 98%</span><span>LINK 5.8 GHZ</span></div>
    <div className="route-vector">{destinationMission.checkpoints.slice(1,7).map((checkpoint,index)=><span key={checkpoint} className={result&&index<Math.max(0,result.mission.completed-1)?"complete":""}><i/>{["DEL","JAI","AMD","BOM","APP","RWY"][index]}</span>)}</div>
   </div>
   <section className="cockpit-telemetry">
    <div><span>ENGINE</span><b>{flightState==="compiling"?"SPOOLING":flightState==="fault"?"FAULT":flightState==="destination"?"SHUTDOWN":"NOMINAL"}</b></div>
    <div><span>RUNTIME</span><b>{result?`${result.runtimeMs} MS`:"--"}</b></div>
    <div><span>MEMORY</span><b>{result?`${result.memoryKb} KB`:"--"}</b></div>
    <div><span>SOURCE</span><b>{metrics.lines} LINES</b></div>
   </section>
   <section className="cockpit-message"><span>MISSION CONTROL · {destinationMission.title}</span><b>{notice}</b><p>{destinationMission.briefing}</p><ol className="mission-checkpoints">{destinationMission.checkpoints.map((checkpoint,index)=><li key={checkpoint} className={result&&index<result.mission.completed?"complete":result&&index===result.mission.completed?"next":""}><i>{result&&index<result.mission.completed?"✓":index+1}</i><span>{checkpoint}</span></li>)}</ol>{result&&!result.mission.passed&&result.accepted&&<div className="next-command">NEXT REQUIRED OUTPUT <b>{result.mission.nextCheckpoint}</b></div>}</section>
   <section className="hardware-terminal"><header><span>AVIONICS KERNEL</span><b>TTY-07</b></header>{systemLogs.map((log,index)=><div key={log} style={{animationDelay:`${index*110}ms`}}><i>{index===systemLogs.length-1?"›":"✓"}</i><span>{log}</span><em>{index===systemLogs.length-1&&flightState==="compiling"?"RUNNING":"OK"}</em></div>)}</section>
  </aside>

  <main className="playground-workspace">
   <header className="playground-toolbar">
    <div className="file-identity"><span>F/C</span><div><b>{judgeLanguages[language].file}</b><small>FREE-FLIGHT PLAYGROUND</small></div></div>
    <label className="language-picker"><span>Language</span><select aria-label="Programming language" value={language} onChange={event=>changeLanguage(event.target.value as JudgeLanguage)}>{languages.map(([key,item])=><option key={key} value={key}>{item.label}</option>)}</select></label>
    <div className="ide-actions"><button onClick={save}>Save draft</button><button onClick={reset}>Reset</button><button className="submit-code" onClick={run} disabled={flightState==="compiling"}>{flightState==="compiling"?"Starting engines…":"▶ Run & take off"}</button></div>
   </header>
   <div className="workspace-hardware"><span><i/> SECURE SANDBOX</span><span>CPU {flightState==="compiling"?"87":"21"}%</span><span>CORE TEMP {flightState==="compiling"?"68":"39"}°C</span><span>PACKETS {result?result.mission.completed*128:0}</span><b>ENCRYPTED LINK</b></div>
   <div className="editor-shell monaco-flight-editor"><Editor height="100%" language={language==="cpp"?"cpp":language==="csharp"?"csharp":language} value={code} onChange={value=>{setCode(value||"");setNotice("UNSAVED CHANGES")}} theme="vs-dark" loading={<div className="editor-loading">INITIALIZING FLIGHT EDITOR…</div>} options={{fontFamily:"Manrope, Arial, sans-serif",fontSize:16,lineHeight:26,minimap:{enabled:true,scale:1},scrollBeyondLastLine:false,smoothScrolling:true,automaticLayout:true,tabSize:2,wordWrap:"off",padding:{top:18,bottom:18},renderLineHighlight:"all",cursorSmoothCaretAnimation:"on",bracketPairColorization:{enabled:true},guides:{bracketPairs:true,indentation:true},suggest:{showWords:true},quickSuggestions:true}} onMount={(editor,monaco)=>{editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.Enter,run);editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.KeyS,save)}}/></div>
   <section className="playground-console">
    <header><div><i/><span>FLIGHT TERMINAL</span></div><b>{result?`${result.mission.completed}/${result.mission.total} CHECKPOINTS`:"MISSION READY"} · {metrics.characters} CHARACTERS</b></header>
    <div className="console-grid"><label><span>STANDARD INPUT</span><textarea value={stdin} onChange={event=>setStdin(event.target.value)} placeholder="Optional input for Scanner, stdin, cin…"/></label><section><span>PROGRAM OUTPUT</span><pre>{output}</pre></section></div>
   </section>
  </main>
 </div>
}
