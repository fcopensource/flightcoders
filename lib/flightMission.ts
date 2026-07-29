export const destinationMission = {
  title: "DELHI → MUMBAI",
  briefing: "Write a program that completes every flight phase in order. The aircraft only reaches Mumbai when all required checkpoint messages are printed.",
  checkpoints: [
    "SYSTEM CHECK: ALL SYSTEMS NOMINAL",
    "TAKEOFF COMPLETE",
    "WAYPOINT 1: DELHI DEPARTURE",
    "WAYPOINT 2: JAIPUR CONTROL",
    "WAYPOINT 3: AHMEDABAD CONTROL",
    "WAYPOINT 4: MUMBAI APPROACH",
    "TOUCHDOWN CONFIRMED",
    "MISSION STATUS: DESTINATION REACHED",
  ],
} as const;

export function validateDestinationMission(stdout: string) {
  const normalized = stdout.toUpperCase().replace(/\s+/g, " ").trim();
  let cursor = 0;
  let completed = 0;

  for (const checkpoint of destinationMission.checkpoints) {
    const index = normalized.indexOf(checkpoint, cursor);
    if (index === -1) break;
    completed += 1;
    cursor = index + checkpoint.length;
  }

  return {
    passed: completed === destinationMission.checkpoints.length,
    completed,
    total: destinationMission.checkpoints.length,
    progress: Math.round((completed / destinationMission.checkpoints.length) * 100),
    nextCheckpoint: destinationMission.checkpoints[completed] || null,
  };
}
