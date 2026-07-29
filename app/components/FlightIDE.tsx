"use client";
import {useState} from "react";
import Editor from "@monaco-editor/react";
import {flightChallenges} from "../../lib/flightChallenges";
import {judgeLanguages,type JudgeLanguage} from "../../lib/judge0";

type JudgeResult={
 accepted:boolean;status:string;stdout:string;stderr:string;compileOutput:string;
 message:string;runtimeMs:number;memoryKb:number;
};
type HistoryItem={challenge_slug:string;language:string;passed:number;tests_passed:number;total_tests:number;runtime_ms:number;created_at:string};

const languages=Object.entries(judgeLanguages) as [JudgeLanguage,(typeof judgeLanguages)[JudgeLanguage]][];

function starterFor(language:JudgeLanguage,index:number){
 const challenge=flightChallenges[index];
 if(language==="javascript")return `${challenge.starter}\n\n// Standard input is available through the FlightCoders judge harness.\nconsole.log("Flight program ready");\n`;
 if(language==="python")return `# ${challenge.title}\n# Read input, implement the flight contract, then print the result.\nimport sys\n\ndef solve(data: str):\n    # TODO: implement mission logic\n    return "Flight program ready"\n\nif __name__ == "__main__":\n    print(solve(sys.stdin.read()))\n`;
 if(language==="cpp")return `// ${challenge.title}\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // TODO: parse stdin and implement the flight contract.\n    string line;\n    while (getline(cin, line)) { /* ingest telemetry */ }\n    cout << "Flight program ready" << '\\n';\n    return 0;\n}\n`;
 return `// ${challenge.title}\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader input = new BufferedReader(new InputStreamReader(System.in));\n        // TODO: parse stdin and implement the flight contract.\n        while (input.readLine() != null) { /* ingest telemetry */ }\n        System.out.println("Flight program ready");\n    }\n}\n`;
}

export function FlightIDE({initialSolved}:{initialSolved:string[]}){
 const [index,setIndex]=useState(0),challenge=flightChallenges[index];
 const [language,setLanguage]=useState<JudgeLanguage>("javascript");
 const [code,setCode]=useState(()=>starterFor("javascript",0));
 const [stdin,setStdin]=useState("");
 const [result,setResult]=useState<JudgeResult|null>(null);
 const [running,setRunning]=useState(false);
 const [consoleText,setConsoleText]=useState("Judge online. Select a language and run your flight program.");
 const [solved,setSolved]=useState(new Set(initialSolved)),[filter,setFilter]=useState("");
 const [history,setHistory]=useState<HistoryItem[]>([]),[historyOpen,setHistoryOpen]=useState(false),[draftNotice,setDraftNotice]=useState("");
 const visibleChallenges=flightChallenges.filter(item=>(item.title+item.system+item.difficulty).toLowerCase().includes(filter.toLowerCase()));
 const draftKey=(slug=challenge.slug,lang=language)=>`fc_draft_${slug}_${lang}`;

 function loadEditor(nextIndex:number,nextLanguage:JudgeLanguage){
  const nextChallenge=flightChallenges[nextIndex];
  const saved=localStorage.getItem(`fc_draft_${nextChallenge.slug}_${nextLanguage}`);
  setCode(saved||starterFor(nextLanguage,nextIndex));setResult(null);
  setDraftNotice(saved?"Recovered saved draft":"");
  setConsoleText(`${judgeLanguages[nextLanguage].label} runtime selected. Ready to compile.`);
 }
 function selectMission(i:number){setIndex(i);loadEditor(i,language)}
 function selectLanguage(next:JudgeLanguage){setLanguage(next);loadEditor(index,next)}
 function saveDraft(){localStorage.setItem(draftKey(),code);setDraftNotice("Draft secured on this device")}
 function reset(){setCode(starterFor(language,index));setResult(null);localStorage.removeItem(draftKey());setDraftNotice("");setConsoleText("Starter program restored.")}
 async function openHistory(){const response=await fetch("/api/lab/submissions");const data=await response.json();setHistory(data.submissions||[]);setHistoryOpen(true)}

 async function run(submit=false){
  setRunning(true);setResult(null);setConsoleText(`Compiling ${judgeLanguages[language].label} in the isolated flight judge…`);
  try{
   const response=await fetch("/api/lab/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({language,sourceCode:code,stdin})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Execution service unavailable");
   const execution=data as JudgeResult;setResult(execution);
   setConsoleText(execution.accepted?"PROGRAM COMPLETED — inspect stdout and runtime telemetry.":`${execution.status.toUpperCase()} — inspect compiler and runtime output.`);
   if(submit){
    await fetch("/api/lab/submissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challengeSlug:challenge.slug,language,code,passed:execution.accepted,testsPassed:execution.accepted?1:0,totalTests:1,runtimeMs:execution.runtimeMs})});
    if(execution.accepted)setSolved(current=>new Set([...current,challenge.slug]));
   }
  }catch(error){setConsoleText(error instanceof Error?error.message:"Execution service unavailable")}
  finally{setRunning(false)}
 }

 return <div className="flight-ide">
  <aside className="mission-rail"><div className="rail-heading"><span>MISSION BANK</span><b>{solved.size}/{flightChallenges.length}</b></div><label className="mission-search"><span>⌕</span><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter systems" aria-label="Filter coding missions"/></label>{visibleChallenges.map(item=>{const i=flightChallenges.indexOf(item);return <button key={item.slug} className={i===index?"active":""} onClick={()=>selectMission(i)}><i>{solved.has(item.slug)?"✓":String(i+1).padStart(2,"0")}</i><span><b>{item.title}</b><small>{item.system}</small></span><em>{item.difficulty}</em></button>})}<button className="history-trigger" onClick={openHistory}><i>↺</i><span><b>Submission telemetry</b><small>Review recent attempts</small></span></button><div className="rail-signal"><i/><span>MULTI-LANGUAGE JUDGE</span><small>Isolated execution · 3s CPU</small></div></aside>
  <section className="mission-brief"><header><span>MISSION {String(index+1).padStart(2,"0")} / {challenge.system}</span><b>{challenge.difficulty} · {challenge.xp} XP</b></header><h1>{challenge.title}</h1><p>{challenge.brief}</p><h2>Flight contract</h2><code>{challenge.contract}</code><h2>Operational constraints</h2><ul>{challenge.constraints.map(x=><li key={x}>{x}</li>)}</ul><div className="architecture-map" aria-label="System architecture"><span>SENSORS</span><i>→</i><span>FLIGHT CORE</span><i>→</i><span>ACTUATORS</span><b>REDUNDANCY BUS / LIVE</b></div></section>
  <section className="ide-panel"><header><div><i/><i/><i/><span>{judgeLanguages[language].file} {draftNotice&&<b>· {draftNotice}</b>}</span></div><nav aria-label="Programming language">{languages.map(([key,item])=><button key={key} className={language===key?"active":""} onClick={()=>selectLanguage(key)}>{item.label}</button>)}</nav><div className="ide-actions"><button onClick={saveDraft}>Save</button><button onClick={reset}>Reset</button><button onClick={()=>run(false)} disabled={running}>▶ Run</button><button className="submit-code" onClick={()=>run(true)} disabled={running}>{running?"Executing…":"Submit flight plan"}</button></div></header>
   <div className="editor-shell monaco-flight-editor"><Editor height="100%" language={language==="cpp"?"cpp":language} value={code} onChange={value=>{setCode(value||"");setDraftNotice("")}} theme="vs-dark" loading={<div className="editor-loading">INITIALIZING FLIGHT EDITOR…</div>} options={{fontFamily:"var(--font-flight-mono), JetBrains Mono, monospace",fontSize:15,lineHeight:24,minimap:{enabled:true,scale:1},scrollBeyondLastLine:false,smoothScrolling:true,automaticLayout:true,tabSize:2,wordWrap:"off",padding:{top:18,bottom:18},renderLineHighlight:"all",cursorSmoothCaretAnimation:"on",bracketPairColorization:{enabled:true},guides:{bracketPairs:true,indentation:true},suggest:{showWords:true},quickSuggestions:true}} onMount={(editor,monaco)=>{editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.Enter,()=>run(false));editor.addCommand(monaco.KeyMod.CtrlCmd|monaco.KeyCode.KeyS,()=>saveDraft())}}/></div>
   <div className="judge-console"><header><span>EXECUTION CONSOLE · CTRL/⌘ + ENTER TO RUN</span><b>{result?`${result.runtimeMs}MS · ${result.memoryKb}KB`:"READY"}</b></header><div className="judge-io"><label><span>STANDARD INPUT</span><textarea value={stdin} onChange={e=>setStdin(e.target.value)} placeholder="Optional stdin for your program"/></label><section><span>PROGRAM OUTPUT</span><pre>{result?.stdout||result?.compileOutput||result?.stderr||result?.message||consoleText}</pre></section></div>{result&&<div className={result.accepted?"pass":"fail"}><b>{result.accepted?"DONE":"ERROR"}</b><span>{result.status}</span><small>{result.stderr||result.compileOutput||`${result.runtimeMs}ms · ${result.memoryKb}KB`}</small></div>}</div>
  </section>
  {historyOpen&&<div className="history-layer" role="dialog" aria-modal="true" aria-label="Submission telemetry"><section><header><div><span>FLIGHT RECORDER</span><h2>Submission telemetry</h2></div><button onClick={()=>setHistoryOpen(false)} aria-label="Close submission history">×</button></header><div className="history-list">{history.map((item,i)=><article key={`${item.created_at}-${i}`}><b className={item.passed?"passed":"failed"}>{item.passed?"PASSED":"FAILED"}</b><span><strong>{flightChallenges.find(x=>x.slug===item.challenge_slug)?.title||item.challenge_slug}</strong><small>{judgeLanguages[item.language as JudgeLanguage]?.label||item.language} · {new Date(item.created_at).toLocaleString()}</small></span><em>{item.tests_passed}/{item.total_tests} gates · {item.runtime_ms}ms</em></article>)}{!history.length&&<p>No flight programs submitted yet.</p>}</div></section></div>}
 </div>
}
