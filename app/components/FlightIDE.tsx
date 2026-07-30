"use client";
import {useEffect,useMemo,useState} from "react";
import Editor from "@monaco-editor/react";
import {judgeLanguages,type JudgeLanguage} from "../../lib/judge0";
import {radarMission} from "../../lib/flightMission";

type JudgeResult={
 accepted:boolean;status:string;stdout:string;stderr:string;compileOutput:string;
 message:string;runtimeMs:number;memoryKb:number;
 mission:{passed:boolean;completed:number;total:number;progress:number;nextCheckpoint:string|null};
};
type FlightState="standby"|"compiling"|"grounded"|"taxi"|"airborne"|"destination"|"fault";
const languages=Object.entries(judgeLanguages) as [JudgeLanguage,(typeof judgeLanguages)[JudgeLanguage]][];

function starterFor(language:JudgeLanguage){
 if(language==="javascript")return `// Radar Blackout Recovery\nconst fs = require("fs");\nconst lines = fs.readFileSync(0,"utf8").trim().split(/\\r?\\n/);\nconst q = Number(lines[0]);\n// TODO: build a dynamic spatial index.\n// Print one answer for every COUNT and NEAREST command.\n`;
 if(language==="typescript")return `import * as fs from "fs";\nconst lines: string[] = fs.readFileSync(0,"utf8").trim().split(/\\r?\\n/);\nconst q = Number(lines[0]);\n// TODO: implement the dynamic radar index.\n`;
 if(language==="python")return `# Radar Blackout Recovery\nimport sys\n\ndef solve(lines):\n    q = int(lines[0])\n    # TODO: sqrt decomposition + rebuilt k-d tree\n    return []\n\nprint("\\n".join(solve(sys.stdin.read().strip().splitlines())))\n`;
 if(language==="java")return `import java.io.*;\nimport java.util.*;\npublic class Main {\n public static void main(String[] args) throws Exception {\n  BufferedReader br=new BufferedReader(new InputStreamReader(System.in));\n  int q=Integer.parseInt(br.readLine());\n  // TODO: implement the dynamic radar index.\n }\n}\n`;
 if(language==="c")return `#include <stdio.h>\nint main(void){\n int q; if(scanf("%d",&q)!=1) return 0;\n /* TODO: implement the dynamic radar index. */\n return 0;\n}\n`;
 if(language==="cpp")return `#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n ios::sync_with_stdio(false); cin.tie(nullptr);\n int q; cin>>q;\n // TODO: sqrt decomposition + rebuilt k-d tree.\n return 0;\n}\n`;
 if(language==="csharp")return `using System;\npublic class MainClass { public static void Main(){ int q=int.Parse(Console.ReadLine()!); /* TODO */ } }\n`;
 if(language==="go")return `package main\nimport("bufio";"fmt";"os")\nfunc main(){ in:=bufio.NewReader(os.Stdin); var q int; fmt.Fscan(in,&q); /* TODO */ }\n`;
 if(language==="rust")return `use std::io::{self, Read};\nfn main(){ let mut input=String::new(); io::stdin().read_to_string(&mut input).unwrap(); // TODO\n}\n`;
 if(language==="kotlin")return `fun main(){ val q=readLine()!!.trim().toInt(); // TODO: dynamic spatial index\n}\n`;
 if(language==="ruby")return `q = STDIN.readline.to_i\n# TODO: dynamic spatial index\n`;
 if(language==="php")return `<?php\n$q=(int)trim(fgets(STDIN));\n// TODO: dynamic spatial index\n`;
 return `import Foundation\nlet input=String(data:FileHandle.standardInput.readDataToEndOfFile(),encoding:.utf8) ?? ""\n// TODO: dynamic spatial index\n`;
}

export function FlightIDE(){
 const [language,setLanguage]=useState<JudgeLanguage>("javascript");
 const [code,setCode]=useState(()=>starterFor("javascript"));
 const [stdin,setStdin]=useState(radarMission.defaultInput);
 const [result,setResult]=useState<JudgeResult|null>(null);
 const [flightState,setFlightState]=useState<FlightState>("standby");
 const [notice,setNotice]=useState("RADAR INCIDENT ACTIVE");
 const [nightVision,setNightVision]=useState(false);
 const [failedAttempts,setFailedAttempts]=useState(0);
 const [hintOpen,setHintOpen]=useState(false);
 const metrics=useMemo(()=>({lines:code.split("\n").length,characters:code.length}),[code]);
 const output=result?.stdout||result?.compileOutput||result?.stderr||result?.message||"Run the program to compare its output with the radar judge.";
 const hintUnlocked=failedAttempts>=5;

 useEffect(()=>{fetch("/api/lab/submissions").then(response=>response.ok?response.json():null).then(data=>{if(data)setFailedAttempts(Number(data.failedAttempts||0))}).catch(()=>{})},[]);

 function changeLanguage(next:JudgeLanguage){
  setLanguage(next);const saved=localStorage.getItem(`fc_radar_${next}`);
  setCode(saved||starterFor(next));setResult(null);setFlightState("standby");setNotice(saved?"RADAR DRAFT RECOVERED":"RUNTIME READY");
 }
 function save(){localStorage.setItem(`fc_radar_${language}`,code);setNotice("RADAR DRAFT SECURED")}
 function reset(){setCode(starterFor(language));setStdin(radarMission.defaultInput);setResult(null);setFlightState("standby");setNotice("MISSION RESET")}
 function animateSuccessfulMission(){
  setFlightState("taxi");setNotice("SPATIAL INDEX REBUILDING");
  window.setTimeout(()=>{setFlightState("airborne");setNotice("LIVE TRACKS REACQUIRED")},700);
  window.setTimeout(()=>{setFlightState("destination");setNotice("RADAR NETWORK RESTORED")},2600);
 }
 async function execute(submit:boolean){
  setFlightState("compiling");setNotice(submit?"SUBMITTING TO RADAR JUDGE":"RUNNING SAMPLE");setResult(null);
  try{
   const response=await fetch("/api/lab/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({language,sourceCode:code,stdin})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||"Execution service unavailable");
   const execution=data as JudgeResult;setResult(execution);
   if(!execution.accepted){setFlightState("fault");setNotice("COMPILER OR RUNTIME FAULT")}
   else if(execution.mission.passed){animateSuccessfulMission()}
   else{setFlightState("grounded");setNotice(`WRONG ANSWER · ${execution.mission.completed}/${execution.mission.total} OUTPUTS`)}
   if(submit){
    const saved=await fetch("/api/lab/submissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challengeSlug:radarMission.slug,language,code,passed:execution.accepted&&execution.mission.passed,testsPassed:execution.mission.completed,totalTests:execution.mission.total,runtimeMs:execution.runtimeMs})});
    const submission=await saved.json().catch(()=>null);
    if(saved.ok&&submission)setFailedAttempts(Number(submission.failedAttempts||0));
   }
  }catch(error){setFlightState("fault");setNotice(error instanceof Error?error.message.toUpperCase():"EXECUTION SERVICE UNAVAILABLE")}
 }

 const systemLogs=flightState==="compiling"?["INGESTING ADS-B FRAMES","ALLOCATING SANDBOX","COMPILING SOURCE","QUERYING SPATIAL INDEX"]:flightState==="fault"?["FAULT INTERRUPT","EXECUTION ABORTED","RADAR STILL DEGRADED","DIAGNOSTICS READY"]:flightState==="destination"?["PRIMARY RADAR LOCKED","SECONDARY TRACKS MERGED","CONFLICT ENGINE ONLINE","INCIDENT CLOSED"]:flightState==="airborne"?["TRACK TABLE CONSISTENT","SECTOR COUNTS VERIFIED","NEAREST TARGET VERIFIED","LIVE FEED STABLE"]:["RADAR CLUSTER DEGRADED","SPATIAL INDEX OFFLINE","CONTROLLERS ON FALLBACK","AWAITING ALGORITHM"];

 return <div className={`flight-playground state-${flightState} ${nightVision?"vision-green":""}`}>
  <aside className="sim-cockpit">
   <div className="sim-heading"><span>F/C RADAR INCIDENT LAB</span><div><button onClick={()=>setNightVision(value=>!value)}>{nightVision?"NORMAL HUD":"NVG MODE"}</button><b><i/> LIVE</b></div></div>
   <div className="sim-window" aria-label={`Radar simulation ${flightState}`}>
    <div className="hud-scanlines"/><div className="radar-sweep"/><div className="sim-sky"><span className="sim-star s1"/><span className="sim-star s2"/><span className="sim-star s3"/></div><div className="sim-horizon"><i/><i/><i/><i/><i/></div><div className="sim-runway"><span/><span/><span/><span/><span/></div>
    <div className="sim-aircraft"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 3c5 0 8 7 9 17l3 25 35 24c4 3 6 7 6 11v7L72 73l-2 25 14 10v7l-24-5-24 5v-7l14-10-2-25L7 87v-7c0-4 2-8 6-11l35-24 3-25C52 10 55 3 60 3Z"/></svg><i/><b/></div>
    <div className="hud-bracket left"/><div className="hud-bracket right"/><div className="hud-status"><small>RADAR MODE</small><strong>{flightState.toUpperCase()}</strong></div><div className="hud-reticle"><i/><i/><span>+</span></div><div className="hud-altitude"><span>TRACKS</span><b>{result?.mission.completed??0}</b><small>OK</small></div><div className="hud-speed"><span>FAIL</span><b>{failedAttempts}</b><small>/ 5</small></div>
   </div>
   <section className="cockpit-telemetry"><div><span>DIFFICULTY</span><b>OLYMPIAD</b></div><div><span>RUNTIME</span><b>{result?`${result.runtimeMs} MS`:"--"}</b></div><div><span>MEMORY</span><b>{result?`${result.memoryKb} KB`:"--"}</b></div><div><span>SOURCE</span><b>{metrics.lines} LINES</b></div></section>
   <section className="cockpit-message"><span>MISSION CONTROL · {radarMission.title}</span><b>{notice}</b><p>{radarMission.briefing}</p><h3>OPERATIONS</h3><ol className="mission-checkpoints">{radarMission.inputFormat.map((item,index)=><li key={item}><i>{index+1}</i><span>{item}</span></li>)}</ol>{result&&!result.mission.passed&&result.accepted&&<div className="next-command">FIRST MISMATCH <b>{result.mission.nextCheckpoint}</b></div>}</section>
   <section className="hardware-terminal"><header><span>RADAR KERNEL</span><b>TTY-24</b></header>{systemLogs.map((log,index)=><div key={log} style={{animationDelay:`${index*110}ms`}}><i>{index===systemLogs.length-1?"›":"✓"}</i><span>{log}</span><em>{index===systemLogs.length-1&&flightState==="compiling"?"RUNNING":"OK"}</em></div>)}</section>
  </aside>

  <main className="playground-workspace">
   <header className="playground-toolbar"><div className="file-identity"><span>F/C</span><div><b>{judgeLanguages[language].file}</b><small>{radarMission.difficulty}</small></div></div><label className="language-picker"><span>Language</span><select aria-label="Programming language" value={language} onChange={event=>changeLanguage(event.target.value as JudgeLanguage)}>{languages.map(([key,item])=><option key={key} value={key}>{item.label}</option>)}</select></label><div className="ide-actions"><button onClick={save}>Save draft</button><button onClick={reset}>Reset</button><button onClick={()=>execute(false)} disabled={flightState==="compiling"}>▶ Run</button><button className="submit-code" onClick={()=>execute(true)} disabled={flightState==="compiling"}>{flightState==="compiling"?"Judging…":"Submit solution"}</button></div></header>
   <div className="workspace-hardware"><span><i/> DYNAMIC 2D INDEX</span><span>LIMIT 200,000 OPS</span><span>DISTANCE INT64</span><span>FAILED {failedAttempts}</span><b>HINT {hintUnlocked?"UNLOCKED":"LOCKED"}</b></div>
   <section className="cockpit-message" style={{maxHeight:"none"}}><span>PROBLEM STATEMENT</span><b>{radarMission.contract}</b><p><strong>Constraints:</strong> {radarMission.constraints.join(" · ")}</p><button className="submit-code" onClick={()=>hintUnlocked&&setHintOpen(value=>!value)} disabled={!hintUnlocked}>{hintUnlocked?(hintOpen?"Hide detailed solution":"Open detailed solution"):`Detailed hint unlocks after ${Math.max(0,5-failedAttempts)} failed submissions`}</button>{hintOpen&&hintUnlocked&&<pre style={{whiteSpace:"pre-wrap",marginTop:14}}>{radarMission.detailedSolution}</pre>}</section>
   <div className="editor-shell monaco-flight-editor"><Editor height="100%" language={language==="cpp"?"cpp":language==="csharp"?"csharp":language} value={code} onChange={value=>{setCode(value||"");setNotice("UNSAVED CHANGES")}} theme="vs-dark" loading={<div className="editor-loading">INITIALIZING FLIGHT EDITOR…</div>} options={{fontFamily:"Manrope, Arial, sans-serif",fontSize:16,lineHeight:26,minimap:{enabled:true,scale:1},scrollBeyondLastLine:false,smoothScrolling:true,automaticLayout:true,tabSize:2,wordWrap:"off",padding:{top:18,bottom:18},renderLineHighlight:"all",cursorSmoothCaretAnimation:"on",bracketPairColorization:{enabled:true},guides:{bracketPairs:true,indentation:true},suggest:{showWords:true},quickSuggestions:true}} onMount={(editor,monaco)=>{editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.Enter,()=>execute(false));editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.KeyS,save)}}/></div>
   <section className="playground-console"><header><div><i/><span>RADAR TERMINAL</span></div><b>{result?`${result.mission.completed}/${result.mission.total} ANSWERS`:"MISSION READY"} · {metrics.characters} CHARACTERS</b></header><div className="console-grid"><label><span>MISSION INPUT</span><textarea value={stdin} onChange={event=>setStdin(event.target.value)} /></label><section><span>PROGRAM OUTPUT</span><pre>{output}</pre><small>Sample expected output</small><pre>{radarMission.sampleOutput}</pre></section></div></section>
  </main>
 </div>
}
