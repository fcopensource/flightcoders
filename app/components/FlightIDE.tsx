"use client";
import {useMemo,useState} from "react";
import Editor from "@monaco-editor/react";
import {judgeLanguages,type JudgeLanguage} from "../../lib/judge0";

type JudgeResult={
 accepted:boolean;status:string;stdout:string;stderr:string;compileOutput:string;
 message:string;runtimeMs:number;memoryKb:number;
};
type FlightState="standby"|"compiling"|"airborne"|"fault";
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
 const metrics=useMemo(()=>({lines:code.split("\n").length,characters:code.length}),[code]);
 const output=result?.stdout||result?.compileOutput||result?.stderr||result?.message||"Run your program to begin the takeoff sequence.";

 function changeLanguage(next:JudgeLanguage){
  setLanguage(next);const saved=localStorage.getItem(`fc_playground_${next}`);
  setCode(saved||starterFor(next));setResult(null);setFlightState("standby");setNotice(saved?"DRAFT RECOVERED":"RUNTIME READY");
 }
 function save(){localStorage.setItem(`fc_playground_${language}`,code);setNotice("DRAFT SECURED")}
 function reset(){setCode(starterFor(language));setResult(null);setFlightState("standby");setNotice("COCKPIT RESET")}
 async function run(){
  setFlightState("compiling");setNotice("ENGINES SPOOLING");setResult(null);
  try{
   const response=await fetch("/api/lab/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({language,sourceCode:code,stdin})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||"Execution service unavailable");
   const execution=data as JudgeResult;setResult(execution);
   setFlightState(execution.accepted?"airborne":"fault");setNotice(execution.accepted?"TAKEOFF COMPLETE":"SYSTEM FAULT");
  }catch(error){setFlightState("fault");setNotice(error instanceof Error?error.message.toUpperCase():"EXECUTION SERVICE UNAVAILABLE")}
 }

 return <div className={`flight-playground state-${flightState}`}>
  <aside className="sim-cockpit">
   <div className="sim-heading"><span>F/C SIMULATION DECK</span><b><i/> LIVE</b></div>
   <div className="sim-window" aria-label={`Flight simulation ${flightState}`}>
    <div className="sim-sky"><span className="sim-star s1"/><span className="sim-star s2"/><span className="sim-star s3"/></div>
    <div className="sim-horizon"><i/><i/><i/><i/><i/></div>
    <div className="sim-runway"><span/><span/><span/><span/><span/></div>
    <div className="sim-aircraft">✈<i/></div>
    <div className="hud-bracket left"/><div className="hud-bracket right"/>
    <div className="hud-status"><small>FLIGHT MODE</small><strong>{flightState.toUpperCase()}</strong></div>
    <div className="hud-reticle"><i/><i/><span>+</span></div>
    <div className="hud-altitude"><span>ALT</span><b>{flightState==="airborne"?"35,000":"00000"}</b><small>FT</small></div>
    <div className="hud-speed"><span>SPD</span><b>{flightState==="airborne"?"480":"000"}</b><small>KT</small></div>
   </div>
   <section className="cockpit-telemetry">
    <div><span>ENGINE</span><b>{flightState==="compiling"?"SPOOLING":flightState==="fault"?"FAULT":"NOMINAL"}</b></div>
    <div><span>RUNTIME</span><b>{result?`${result.runtimeMs} MS`:"--"}</b></div>
    <div><span>MEMORY</span><b>{result?`${result.memoryKb} KB`:"--"}</b></div>
    <div><span>SOURCE</span><b>{metrics.lines} LINES</b></div>
   </section>
   <section className="cockpit-message"><span>MISSION CONTROL</span><b>{notice}</b><p>{flightState==="standby"?"Write anything. Test ideas. Learn by flying.":flightState==="compiling"?"Your program is compiling inside the isolated judge.":flightState==="airborne"?"Program executed successfully. Flight systems are nominal.":"Inspect the compiler or runtime output and repair the system."}</p></section>
  </aside>

  <main className="playground-workspace">
   <header className="playground-toolbar">
    <div className="file-identity"><span>F/C</span><div><b>{judgeLanguages[language].file}</b><small>FREE-FLIGHT PLAYGROUND</small></div></div>
    <label className="language-picker"><span>Language</span><select aria-label="Programming language" value={language} onChange={event=>changeLanguage(event.target.value as JudgeLanguage)}>{languages.map(([key,item])=><option key={key} value={key}>{item.label}</option>)}</select></label>
    <div className="ide-actions"><button onClick={save}>Save draft</button><button onClick={reset}>Reset</button><button className="submit-code" onClick={run} disabled={flightState==="compiling"}>{flightState==="compiling"?"Starting engines…":"▶ Run & take off"}</button></div>
   </header>
   <div className="editor-shell monaco-flight-editor"><Editor height="100%" language={language==="cpp"?"cpp":language==="csharp"?"csharp":language} value={code} onChange={value=>{setCode(value||"");setNotice("UNSAVED CHANGES")}} theme="vs-dark" loading={<div className="editor-loading">INITIALIZING FLIGHT EDITOR…</div>} options={{fontFamily:"Manrope, Arial, sans-serif",fontSize:16,lineHeight:26,minimap:{enabled:true,scale:1},scrollBeyondLastLine:false,smoothScrolling:true,automaticLayout:true,tabSize:2,wordWrap:"off",padding:{top:18,bottom:18},renderLineHighlight:"all",cursorSmoothCaretAnimation:"on",bracketPairColorization:{enabled:true},guides:{bracketPairs:true,indentation:true},suggest:{showWords:true},quickSuggestions:true}} onMount={(editor,monaco)=>{editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.Enter,run);editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.KeyS,save)}}/></div>
   <section className="playground-console">
    <header><div><i/><span>FLIGHT TERMINAL</span></div><b>{result?.status||"READY"} · {metrics.characters} CHARACTERS</b></header>
    <div className="console-grid"><label><span>STANDARD INPUT</span><textarea value={stdin} onChange={event=>setStdin(event.target.value)} placeholder="Optional input for Scanner, stdin, cin…"/></label><section><span>PROGRAM OUTPUT</span><pre>{output}</pre></section></div>
   </section>
  </main>
 </div>
}
