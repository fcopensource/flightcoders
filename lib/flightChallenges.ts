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
    {name:"capacity under failure",code:`const g=[{id:'L',capacity:12,x:0},{id:'C',capacity:12,x:5},{id:'R',capacity:12,x:10}]; const l=[{id:'A',demand:4,x:1},{id:'B',demand:4,x:5},{id:'C',demand:4,x:9}]; const r=routePowerGrid(g,[],l); if(!r||!Number.isFinite(r.worstCaseLoss)) throw Error('finite loss required'); for(const v of Object.values(r.assignments||{})){if(new Set(v).size!==2) throw Error('single point of failure')} return true;`},
    {name:"single essential load",code:`const r=routePowerGrid([{id:'A',capacity:5,x:0},{id:'B',capacity:5,x:2}],[],[{id:'NAV',demand:2,x:1,essential:true}]); if(!r.assignments.NAV||new Set(r.assignments.NAV).size!==2)throw Error('NAV requires two feeds');`},
    {name:"known generator ids",code:`const g=[{id:'A',capacity:9,x:0},{id:'B',capacity:9,x:5},{id:'C',capacity:9,x:10}],l=[{id:'X',demand:2,x:3}];const r=routePowerGrid(g,[],l);if(r.assignments.X.some(id=>!g.some(x=>x.id===id)))throw Error('unknown generator');`},
    {name:"all load ids returned",code:`const g=[{id:'A',capacity:30,x:0},{id:'B',capacity:30,x:9}],l=[1,2,3,4].map(i=>({id:'L'+i,demand:2,x:i}));const r=routePowerGrid(g,[],l);if(l.some(x=>!r.assignments[x.id]))throw Error('missing load');`},
    {name:"finite nonnegative loss",code:`const r=routePowerGrid([{id:'A',capacity:10,x:-2},{id:'B',capacity:10,x:7}],[],[{id:'L',demand:1,x:0}]);if(!Number.isFinite(r.worstCaseLoss)||r.worstCaseLoss<0)throw Error('invalid loss');`},
    {name:"deterministic routing",code:`const g=[{id:'A',capacity:12,x:0},{id:'B',capacity:12,x:4}],l=[{id:'L',demand:3,x:2}];if(JSON.stringify(routePowerGrid(g,[],l))!==JSON.stringify(routePowerGrid(g,[],l)))throw Error('nondeterministic');`},
    {name:"input remains immutable",code:`const g=[{id:'A',capacity:8,x:0},{id:'B',capacity:8,x:5}],l=[{id:'L',demand:2,x:2}],before=JSON.stringify([g,l]);routePowerGrid(g,[],l);if(JSON.stringify([g,l])!==before)throw Error('mutated input');`},
    {name:"three generator redundancy",code:`const g=['A','B','C'].map((id,i)=>({id,capacity:20,x:i*5})),l=[{id:'P',demand:3,x:2},{id:'Q',demand:3,x:8}];const r=routePowerGrid(g,[],l);for(const x of Object.values(r.assignments))if(new Set(x).size!==2)throw Error('not redundant');`},
    {name:"scaled load fleet",code:`const g=[{id:'A',capacity:100,x:0},{id:'B',capacity:100,x:20}],l=Array.from({length:12},(_,i)=>({id:'L'+i,demand:2,x:i}));const r=routePowerGrid(g,[],l);if(Object.keys(r.assignments).length!==12)throw Error('scale failure');`}
   ]},
  {slug:"surface-conflict-planner",title:"Surface Conflict-Free Planner",difficulty:"Supersonic",system:"AIRPORT OPS / A-SMGCS",xp:1800,
   brief:"Schedule aircraft through a directed airport surface graph. Each edge is an exclusive taxi segment; wake separation applies at shared nodes. Find the earliest conflict-free arrival plan for all aircraft without deadlock.",
   contract:"Implement planSurface(graph, flights). Return an array of { id, route, enterTimes }. Consecutive route nodes must form valid edges and no protected segment may overlap.",
   constraints:["Up to 70 aircraft and 220 directed segments","Edge traversal is half-open [enter, exit)","Node wake separation depends on the leading aircraft category","Minimize the final aircraft arrival time, then total taxi time"],
   starter:`function planSurface(graph, flights) {\n  // Combine time-expanded A* with reservation-table backtracking.\n  // Never reserve a segment until the whole candidate path is viable.\n  return [];\n}`,
   tests:[
    {name:"head-on exclusion",code:`const graph={edges:[['A','B',2],['B','A',2],['B','C',2],['C','B',2]]}; const flights=[{id:'F1',from:'A',to:'C',ready:0,wake:1},{id:'F2',from:'C',to:'A',ready:0,wake:1}]; const r=planSurface(graph,flights); if(!Array.isArray(r)||r.length!==2) throw Error('schedule both aircraft'); for(const p of r){if(!p.route||p.route[0]!==flights.find(f=>f.id===p.id).from) throw Error('invalid origin'); if(p.enterTimes.length!==p.route.length-1) throw Error('one time per segment')} return true;`},
    {name:"deterministic output",code:`const g={edges:[['G','R',1],['R','P',1]]}; const f=[{id:'J7',from:'G',to:'P',ready:3,wake:2}]; const a=JSON.stringify(planSurface(g,f)); const b=JSON.stringify(planSurface(g,f)); if(a!==b) throw Error('planner must be deterministic'); const p=JSON.parse(a)[0]; if(!p||p.route.join('')!=='GRP'||p.enterTimes[0]<3) throw Error('invalid route/timing'); return true;`},
    {name:"single direct taxi",code:`const r=planSurface({edges:[['A','B',3]]},[{id:'F',from:'A',to:'B',ready:2,wake:1}]);if(r.length!==1||r[0].route.join('')!=='AB'||r[0].enterTimes[0]<2)throw Error('direct route');`},
    {name:"honors ready time",code:`const r=planSurface({edges:[['A','B',1]]},[{id:'F',from:'A',to:'B',ready:20,wake:1}]);if(r[0].enterTimes[0]<20)throw Error('departed early');`},
    {name:"preserves flight ids",code:`const f=[{id:'X1',from:'A',to:'B',ready:0,wake:1}],r=planSurface({edges:[['A','B',2]]},f);if(r[0].id!=='X1')throw Error('id lost');`},
    {name:"reaches destination",code:`const r=planSurface({edges:[['A','B',1],['B','C',1]]},[{id:'F',from:'A',to:'C',ready:0,wake:1}]);if(r[0].route.at(-1)!=='C')throw Error('wrong destination');`},
    {name:"monotonic entry times",code:`const r=planSurface({edges:[['A','B',2],['B','C',3]]},[{id:'F',from:'A',to:'C',ready:0,wake:1}])[0];if(r.enterTimes.some((x,i,a)=>i&&x<a[i-1]))throw Error('time reversal');`},
    {name:"no input mutation",code:`const g={edges:[['A','B',1]]},f=[{id:'F',from:'A',to:'B',ready:0,wake:1}],before=JSON.stringify([g,f]);planSurface(g,f);if(JSON.stringify([g,f])!==before)throw Error('mutated input');`},
    {name:"parallel departures",code:`const g={edges:[['A','B',2],['C','D',2]]},f=[{id:'F1',from:'A',to:'B',ready:0,wake:1},{id:'F2',from:'C',to:'D',ready:0,wake:1}],r=planSurface(g,f);if(r.length!==2)throw Error('missing flight');`},
    {name:"valid route lengths",code:`const r=planSurface({edges:[['A','B',1],['B','C',1]]},[{id:'F',from:'A',to:'C',ready:0,wake:1}])[0];if(r.enterTimes.length!==r.route.length-1)throw Error('invalid timing shape');`}
   ]},
  {slug:"byzantine-sensor-fusion",title:"Byzantine Sensor Consensus",difficulty:"Supersonic",system:"FLIGHT CONTROLS / ATA 27",xp:2200,
   brief:"Fuse asynchronous air-data readings when up to f sensors may be faulty, frozen, delayed, or malicious. Produce a bounded estimate and identify channels that cannot be trusted—without discarding valid maneuver transients.",
   contract:"Implement fuseAirData(frames, f, maxSkewMs). Return { estimate, rejected }. estimate contains altitude, airspeed, aoa and confidence in [0,1].",
   constraints:["3f + 1 or more independent channels","Timestamps are unordered and clocks may skew","A valid estimate must lie inside the non-faulty convex envelope","O(n log n) target; input may contain non-finite values"],
   starter:`function fuseAirData(frames, f, maxSkewMs) {\n  // Align time, remove impossible values, then use a trimmed quorum.\n  // Confidence must fall as channel agreement degrades.\n  return { estimate: null, rejected: [] };\n}`,
   tests:[
    {name:"reject malicious channel",code:`const frames=[{id:'A',t:1000,altitude:10000,airspeed:250,aoa:4},{id:'B',t:1001,altitude:10004,airspeed:251,aoa:4.1},{id:'C',t:999,altitude:9998,airspeed:249,aoa:3.9},{id:'X',t:1000,altitude:-90000,airspeed:9999,aoa:80}]; const r=fuseAirData(frames,1,10); if(!r||!r.estimate) throw Error('estimate required'); if(r.estimate.altitude<9998||r.estimate.altitude>10004) throw Error('outside honest envelope'); if(!r.rejected.includes('X')) throw Error('fault not isolated'); return true;`},
    {name:"confidence contract",code:`const fs=['A','B','C','D'].map((id,i)=>({id,t:50+i,altitude:2000+i,airspeed:140+i*.2,aoa:2+i*.1})); const r=fuseAirData(fs,1,8); if(!r.estimate||r.estimate.confidence<0||r.estimate.confidence>1) throw Error('confidence must be bounded'); for(const k of ['altitude','airspeed','aoa']) if(!Number.isFinite(r.estimate[k])) throw Error('finite '+k+' required'); return true;`},
    {name:"exact agreement",code:`const fs=['A','B','C','D'].map(id=>({id,t:1,altitude:5000,airspeed:200,aoa:3})),r=fuseAirData(fs,1,2);if(r.estimate.altitude!==5000)throw Error('exact quorum drift');`},
    {name:"rejected is array",code:`const fs=['A','B','C','D'].map((id,i)=>({id,t:i,altitude:100+i,airspeed:50,aoa:1})),r=fuseAirData(fs,1,9);if(!Array.isArray(r.rejected))throw Error('invalid rejected');`},
    {name:"unordered timestamps",code:`const fs=[3,1,4,2].map((t,i)=>({id:'S'+i,t,altitude:900+i,airspeed:90+i,aoa:2})),r=fuseAirData(fs,1,5);if(!Number.isFinite(r.estimate.altitude))throw Error('unordered failure');`},
    {name:"altitude envelope",code:`const fs=[1000,1001,999,1002].map((altitude,i)=>({id:'S'+i,t:i,altitude,airspeed:150,aoa:2})),r=fuseAirData(fs,1,5);if(r.estimate.altitude<999||r.estimate.altitude>1002)throw Error('outside envelope');`},
    {name:"airspeed envelope",code:`const fs=[200,202,198,201].map((airspeed,i)=>({id:'S'+i,t:i,altitude:8000,airspeed,aoa:3})),r=fuseAirData(fs,1,5);if(r.estimate.airspeed<198||r.estimate.airspeed>202)throw Error('outside envelope');`},
    {name:"aoa envelope",code:`const fs=[2,2.1,1.9,2.2].map((aoa,i)=>({id:'S'+i,t:i,altitude:8000,airspeed:210,aoa})),r=fuseAirData(fs,1,5);if(r.estimate.aoa<1.9||r.estimate.aoa>2.2)throw Error('outside envelope');`},
    {name:"deterministic fusion",code:`const fs=['A','B','C','D'].map((id,i)=>({id,t:i,altitude:100+i,airspeed:50+i,aoa:1+i/10}));if(JSON.stringify(fuseAirData(fs,1,5))!==JSON.stringify(fuseAirData(fs,1,5)))throw Error('nondeterministic');`},
    {name:"input remains immutable",code:`const fs=['A','B','C','D'].map((id,i)=>({id,t:i,altitude:100+i,airspeed:50,aoa:1})),before=JSON.stringify(fs);fuseAirData(fs,1,5);if(JSON.stringify(fs)!==before)throw Error('mutated frames');`}
   ]}
];
