"use client";

import { useState } from "react";

const labs = {
  Python: {
    file: "progress.py",
    label: "LEVEL PROGRESSION",
    code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Skill:
    name: str
    practiced: bool = False

def unlock(skill: Skill) -> str:
    return "next-level" if skill.practiced else "practice"

# learn → practice → build_`,
  },
  TypeScript: {
    file: "challenge.ts",
    label: "TYPE-SAFE CHALLENGE",
    code: `type Result =
  | { status: "passed"; score: number }
  | { status: "retry"; hint: string };

export function nextStep(result: Result) {
  return result.status === "passed"
    ? "unlock-project"
    : result.hint;
}

// feedback keeps progress moving_`,
  },
  "C++": {
    file: "pathfinder.cpp",
    label: "ALGORITHM PRACTICE",
    code: `vector<int> shortestPath(
  const Graph& graph,
  int start,
  int goal
) {
  Queue<int> frontier;
  frontier.push(start);
  return explore(graph, frontier, goal);
}

// build the idea, test the result_`,
  },
};

export function CodeLab() {
  const [language, setLanguage] = useState<keyof typeof labs>("Python");
  const [copied, setCopied] = useState(false);
  const lab = labs[language];

  async function copy() {
    await navigator.clipboard.writeText(lab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="code-lab-section">
      <div className="shell code-lab-grid">
        <div className="code-lab-copy">
          <span>// PRACTICE, NOT PASSIVE WATCHING</span>
          <h2>Write it.<br />Test it.<br /><em>Understand it.</em></h2>
          <p>Every flight level turns concepts into code you can run, inspect, and improve. Tight feedback keeps your learning moving forward.</p>
          <div className="code-principles">
            <b><i>01</i>Focused challenges</b>
            <b><i>02</i>Useful feedback</b>
            <b><i>03</i>Visible progress</b>
          </div>
        </div>
        <div className="modern-code-window">
          <header>
            <div><i /><i /><i /></div>
            <span>{lab.file}</span>
            <button type="button" onClick={copy}>{copied ? "COPIED ✓" : "COPY CODE"}</button>
          </header>
          <nav aria-label="Code language">
            <span>{lab.label}</span>
            <div>
              {(Object.keys(labs) as Array<keyof typeof labs>).map(item => (
                <button className={item === language ? "active" : ""} onClick={() => setLanguage(item)} key={item}>{item}</button>
              ))}
            </div>
          </nav>
          <pre><code>{lab.code}</code></pre>
          <footer><span><i /> READY TO RUN</span><b>FC / LEVEL-02</b></footer>
        </div>
      </div>
    </section>
  );
}
