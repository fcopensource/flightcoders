export type FlightChallenge = {
  slug:string; title:string; difficulty:"Jet"|"Supersonic"; system:string; xp:number;
  brief:string; contract:string; constraints:string[]; starter:string;
  tests:{name:string;code:string}[];
};

export const flightChallenges:FlightChallenge[]=[
  {slug:"redundant-power-grid",title:"Redundant Aircraft Power Grid",difficulty:"Jet",system:"ELECTRICAL / ATA 24",xp:1200,
   brief:"An aircraft has duplicated generators, buses, contactors, and safety-critical loads. Route every demanded load while surviving any single generator failure. Minimize total cable loss; no bus may exceed capacity and essential loads must remain energized in each failure scenario.",
   contract:"Implement routePowerGrid(generators, buses, loads). Return { assignments, worstCaseLoss }. assignments maps every load id to two distinct generator ids.",
   constraints:["2 ≤ generators ≤ 18; 1 ≤ loads ≤ 120","Each load requires two independent supply paths","All single-generator-out scenarios must remain within remaining capacity","Return the minimum possible worst-case squared cable loss"],
   starter:`function routePowerGrid(generators, buses, loads) {\n  // Build two independent paths for every load.\n  // Hint: model capacity + loss as a min-cost flow state.\n  return { assignments: {}, worstCaseLoss: Infinity };\n}`,
   tests:[
    {name:"dual essential bus",code:`const g=[{id:'G1',capacity:8,x:0},{id:'G2',capacity:8,x:10}]; const b=[]; const l=[{id:'FCC',demand:3,x:4,essential:true},{id:'RAD',demand:2,x:7,essential:true}]; const r=routePowerGrid(g,b,l); if(!r||Object.keys(r.assignments||{}).length!==2) throw Error('all loads need routes'); for(const x of Object.values(r.assignments)){if(!Array.isArray(x)||x.length!==2||x[0]===x[1]) throw Error('routes must be independent')} return true;`},
    {name:"capacity under failure",code:`const g=[{id:'L',capacity:12,x:0},{id:'C',capacity:12,x:5},{id:'R',capacity:12,x:10}]; const l=[{id:'A',demand:4,x:1},{id:'B',demand:4,x:5},{id:'C',demand:4,x:9}]; const r=routePowerGrid(g,[],l); if(!r||!Number.isFinite(r.worstCaseLoss)) throw Error('finite loss required'); for(const v of Object.values(r.assignments||{})){if(new Set(v).size!==2) throw Error('single point of failure')} return true;`}
   ]},
  {slug:"surface-conflict-planner",title:"Surface Conflict-Free Planner",difficulty:"Supersonic",system:"AIRPORT OPS / A-SMGCS",xp:1800,
   brief:"Schedule aircraft through a directed airport surface graph. Each edge is an exclusive taxi segment; wake separation applies at shared nodes. Find the earliest conflict-free arrival plan for all aircraft without deadlock.",
   contract:"Implement planSurface(graph, flights). Return an array of { id, route, enterTimes }. Consecutive route nodes must form valid edges and no protected segment may overlap.",
   constraints:["Up to 70 aircraft and 220 directed segments","Edge traversal is half-open [enter, exit)","Node wake separation depends on the leading aircraft category","Minimize the final aircraft arrival time, then total taxi time"],
   starter:`function planSurface(graph, flights) {\n  // Combine time-expanded A* with reservation-table backtracking.\n  // Never reserve a segment until the whole candidate path is viable.\n  return [];\n}`,
   tests:[
    {name:"head-on exclusion",code:`const graph={edges:[['A','B',2],['B','A',2],['B','C',2],['C','B',2]]}; const flights=[{id:'F1',from:'A',to:'C',ready:0,wake:1},{id:'F2',from:'C',to:'A',ready:0,wake:1}]; const r=planSurface(graph,flights); if(!Array.isArray(r)||r.length!==2) throw Error('schedule both aircraft'); for(const p of r){if(!p.route||p.route[0]!==flights.find(f=>f.id===p.id).from) throw Error('invalid origin'); if(p.enterTimes.length!==p.route.length-1) throw Error('one time per segment')} return true;`},
    {name:"deterministic output",code:`const g={edges:[['G','R',1],['R','P',1]]}; const f=[{id:'J7',from:'G',to:'P',ready:3,wake:2}]; const a=JSON.stringify(planSurface(g,f)); const b=JSON.stringify(planSurface(g,f)); if(a!==b) throw Error('planner must be deterministic'); const p=JSON.parse(a)[0]; if(!p||p.route.join('')!=='GRP'||p.enterTimes[0]<3) throw Error('invalid route/timing'); return true;`}
   ]},
  {slug:"byzantine-sensor-fusion",title:"Byzantine Sensor Consensus",difficulty:"Supersonic",system:"FLIGHT CONTROLS / ATA 27",xp:2200,
   brief:"Fuse asynchronous air-data readings when up to f sensors may be faulty, frozen, delayed, or malicious. Produce a bounded estimate and identify channels that cannot be trusted—without discarding valid maneuver transients.",
   contract:"Implement fuseAirData(frames, f, maxSkewMs). Return { estimate, rejected }. estimate contains altitude, airspeed, aoa and confidence in [0,1].",
   constraints:["3f + 1 or more independent channels","Timestamps are unordered and clocks may skew","A valid estimate must lie inside the non-faulty convex envelope","O(n log n) target; input may contain non-finite values"],
   starter:`function fuseAirData(frames, f, maxSkewMs) {\n  // Align time, remove impossible values, then use a trimmed quorum.\n  // Confidence must fall as channel agreement degrades.\n  return { estimate: null, rejected: [] };\n}`,
   tests:[
    {name:"reject malicious channel",code:`const frames=[{id:'A',t:1000,altitude:10000,airspeed:250,aoa:4},{id:'B',t:1001,altitude:10004,airspeed:251,aoa:4.1},{id:'C',t:999,altitude:9998,airspeed:249,aoa:3.9},{id:'X',t:1000,altitude:-90000,airspeed:9999,aoa:80}]; const r=fuseAirData(frames,1,10); if(!r||!r.estimate) throw Error('estimate required'); if(r.estimate.altitude<9998||r.estimate.altitude>10004) throw Error('outside honest envelope'); if(!r.rejected.includes('X')) throw Error('fault not isolated'); return true;`},
    {name:"confidence contract",code:`const fs=['A','B','C','D'].map((id,i)=>({id,t:50+i,altitude:2000+i,airspeed:140+i*.2,aoa:2+i*.1})); const r=fuseAirData(fs,1,8); if(!r.estimate||r.estimate.confidence<0||r.estimate.confidence>1) throw Error('confidence must be bounded'); for(const k of ['altitude','airspeed','aoa']) if(!Number.isFinite(r.estimate[k])) throw Error('finite '+k+' required'); return true;`}
   ]}
];
