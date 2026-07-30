export const radarMission = {
  slug: "radar-blackout-recovery",
  title: "RADAR BLACKOUT RECOVERY",
  difficulty: "Olympiad / Supersonic",
  briefing:
    "A regional flight-radar cluster has lost its spatial index. Rebuild the live tracker so controllers can insert aircraft, remove stale tracks, count aircraft inside an axis-aligned sector, and find the nearest active aircraft in real time.",
  contract:
    "Process every command in order. For COUNT print the number of active aircraft inside the inclusive rectangle. For NEAREST print the aircraft id with minimum squared Euclidean distance; break ties by lexicographically smaller id. Print EMPTY when no aircraft is active.",
  constraints: [
    "1 ≤ Q ≤ 200,000 operations",
    "Coordinates are integers in [-10^9, 10^9]",
    "Aircraft ids are unique while active",
    "A correct full solution should target about O((Q + K)√Q log Q) or better",
    "Brute-force scanning all active tracks per query will time out on the full judge",
  ],
  inputFormat: [
    "First line: Q",
    "ADD id x y",
    "DEL id",
    "COUNT x1 y1 x2 y2",
    "NEAREST x y",
  ],
  defaultInput: `14
ADD AI101 0 0
ADD AI202 8 3
ADD AI303 -4 7
COUNT -5 -1 10 8
NEAREST 6 2
DEL AI202
NEAREST 6 2
ADD AI404 5 -2
COUNT 0 -3 6 1
ADD AI505 5 6
NEAREST 5 2
DEL AI101
COUNT -10 -10 10 10
NEAREST -3 8`,
  sampleOutput: `3
AI202
AI101
1
AI404
3
AI303`,
  detailedSolution: `FULL SOLUTION — SQRT-DECOMPOSED DYNAMIC SPATIAL INDEX

1. Why a normal k-d tree is not enough
A static k-d tree answers rectangle counting and nearest-neighbour queries efficiently, but arbitrary insertions and deletions can destroy its balance. Rebuilding after every update is too slow for 200,000 commands.

2. Split time into blocks
Choose a block size B ≈ √Q. At the beginning of each block, collect every aircraft that is active and will not be modified inside the block. Build one balanced static k-d tree from those stable tracks.

Keep all aircraft touched by ADD or DEL in the current block inside a small mutable dictionary called delta. Its size is O(B).

3. Rectangle COUNT query
For the stable set, query the k-d tree. Every node stores its bounding box and subtree size:
- If the node box is completely outside the rectangle, return 0.
- If it is completely inside, return the stored subtree size.
- Otherwise recurse into both children and test the node point.

Then scan delta and apply the same inclusive rectangle test. Ensure a track deleted in delta is not counted from the stable tree. This can be handled with a tombstone set.

4. NEAREST query
For the stable k-d tree, keep the best pair (distance², id). Visit the child whose bounding box is closer first. Prune a subtree when the minimum possible distance from the query point to that subtree bounding box is greater than the current best distance. When distances tie, compare ids lexicographically.

After the tree search, scan every active point in delta and update the same best pair. Ignore stable points present in the tombstone set.

5. Rebuilding
At the next block boundary, materialise the true active set by applying delta and tombstones, clear both temporary structures, and rebuild a balanced k-d tree by alternating x and y median splits.

6. Correctness
The active set is partitioned into stable tracks and tracks changed in the current block. Every query examines both disjoint parts. The k-d tree routines are exact because pruning occurs only when a bounding box cannot contain a better answer. Therefore COUNT and NEAREST return exactly the result of scanning the full active set.

7. Complexity
Building each block costs O(N log N). There are about Q/B blocks. Each query costs approximately O(log N + B) on typical balanced data, with exact worst-case fallback bounded by the tree traversal. With B ≈ √Q, the update overhead and delta scan are balanced and practical for the full limits.

Implementation details that commonly fail:
- Rectangle endpoints may arrive reversed; normalise x1/x2 and y1/y2.
- Use 64-bit integers for squared distance.
- DEL must affect both stable and delta tracks.
- Re-adding a deleted id later is valid once it is inactive.
- Apply the id tie-break at every comparison, including k-d tree nodes and delta points.`,
} as const;

type Aircraft = {id:string;x:number;y:number};

function normalizeOutput(value:string){
  return value.trim().split(/\r?\n/).map(line=>line.trim()).filter(Boolean).join("\n");
}

export function solveRadarMission(input:string){
  const lines=input.trim().split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
  const q=Number(lines[0]||0);
  if(!Number.isInteger(q)||q<1||q!==lines.length-1)throw new Error("Input must start with Q followed by exactly Q commands");
  const active=new Map<string,Aircraft>();
  const output:string[]=[];

  for(let i=1;i<=q;i++){
    const parts=lines[i].split(/\s+/);
    const command=parts[0];
    if(command==="ADD"){
      if(parts.length!==4)throw new Error(`Invalid ADD on line ${i+1}`);
      const [,id,xText,yText]=parts;
      const x=Number(xText),y=Number(yText);
      if(!id||!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||active.has(id))throw new Error(`Invalid ADD on line ${i+1}`);
      active.set(id,{id,x,y});
    }else if(command==="DEL"){
      if(parts.length!==2||!active.delete(parts[1]))throw new Error(`Invalid DEL on line ${i+1}`);
    }else if(command==="COUNT"){
      if(parts.length!==5)throw new Error(`Invalid COUNT on line ${i+1}`);
      let [x1,y1,x2,y2]=parts.slice(1).map(Number);
      if([x1,y1,x2,y2].some(value=>!Number.isSafeInteger(value)))throw new Error(`Invalid COUNT on line ${i+1}`);
      if(x1>x2)[x1,x2]=[x2,x1];
      if(y1>y2)[y1,y2]=[y2,y1];
      let count=0;
      for(const aircraft of active.values())if(aircraft.x>=x1&&aircraft.x<=x2&&aircraft.y>=y1&&aircraft.y<=y2)count++;
      output.push(String(count));
    }else if(command==="NEAREST"){
      if(parts.length!==3)throw new Error(`Invalid NEAREST on line ${i+1}`);
      const x=Number(parts[1]),y=Number(parts[2]);
      if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y))throw new Error(`Invalid NEAREST on line ${i+1}`);
      let best:Aircraft|null=null,bestDistance=Infinity;
      for(const aircraft of active.values()){
        const dx=aircraft.x-x,dy=aircraft.y-y,distance=dx*dx+dy*dy;
        if(distance<bestDistance||(distance===bestDistance&&best&&aircraft.id<best.id)||(!best&&distance===bestDistance)){
          best=aircraft;bestDistance=distance;
        }
      }
      output.push(best?.id||"EMPTY");
    }else throw new Error(`Unknown command on line ${i+1}`);
  }
  return output.join("\n");
}

export function validateRadarMission(stdout:string,stdin:string){
  try{
    const expected=solveRadarMission(stdin);
    const actual=normalizeOutput(stdout);
    const expectedLines=normalizeOutput(expected).split("\n");
    const actualLines=actual?actual.split("\n"):[];
    let completed=0;
    while(completed<expectedLines.length&&actualLines[completed]===expectedLines[completed])completed++;
    return {
      passed:actual===normalizeOutput(expected),
      completed,
      total:expectedLines.length,
      progress:expectedLines.length?Math.round(completed/expectedLines.length*100):100,
      nextCheckpoint:completed<expectedLines.length?`Expected output line ${completed+1}: ${expectedLines[completed]}`:null,
    };
  }catch(error){
    return {passed:false,completed:0,total:1,progress:0,nextCheckpoint:error instanceof Error?error.message:"Invalid mission input"};
  }
}

export const destinationMission=radarMission;
export const validateDestinationMission=validateRadarMission;
