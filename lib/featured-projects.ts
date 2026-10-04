// Add new FlightCoders projects here; the showcase renders each entry automatically.
export const featuredProjects = [{
  slug: "daemon", name: "Daemon", category: "DEVELOPER TOOLS",
  tagline: "Your terminal. Another dimension.",
  description: "A native Rust terminal that brings your shell and live system telemetry into a sci-fi desktop interface. Built without Electron or a browser engine.",
  repository: "https://github.com/fcopensource/daemon",
  image: "/projects/daemon-main.png",
  imageAlt: "Daemon terminal with live system telemetry and a holographic globe",
  platform: "Windows · macOS · Linux", license: "GPL-3.0", runtime: "Native Rust application",
  stack: ["Rust", "egui", "portable-pty", "sysinfo", "rodio"],
  features: [
    ["A real shell", "Work in your actual shell with truecolor output, scrollback, and live resizing."],
    ["Live system telemetry", "Keep CPU, memory, network activity, and storage in view alongside your terminal."],
    ["A different atmosphere", "Explore a holographic globe, seven visual themes, and synthesized sound effects."],
  ],
}, {
  slug: "veyra-editor", name: "Veyra Editor", category: "AI / CODE EDITOR",
  tagline: "Your code. Your machine. Your AI.",
  description: "A local-first desktop editor combining Monaco, native project access, Git inspection, and a real terminal. Veyra Studio 0.3 adds local and cloud AI chat with reviewed edits and undo.",
  repository: "https://github.com/fcopensource/veyraeditor",
  image: "/projects/veyra-ssfile.png",
  imageAlt: "Veyra Editor interface with project explorer, code workspace, and integrated terminal",
  platform: "macOS workflow tested · Windows/Linux verification planned",
  license: "MIT", runtime: "Tauri desktop application",
  stack: ["Tauri 2", "Rust", "React 19", "TypeScript", "Monaco", "xterm.js"],
  features: [
    ["A local-first workspace", "Edit real project files with Monaco, workspace search, Git diffs, and a native shell."],
    ["AI with your approval", "Attach a file or selection, review proposed changes, and apply undoable edits with local or cloud models."],
    ["Make it your own", "Customize your workspace with themes, font controls, and compatible Open VSX themes and snippets."],
  ],
}];
