export const judgeLanguages = {
  javascript: {id: 63, label: "JavaScript", file: "flight_solution.js"},
  python: {id: 71, label: "Python", file: "flight_solution.py"},
  cpp: {id: 54, label: "C++", file: "flight_solution.cpp"},
  java: {id: 62, label: "Java", file: "Main.java"},
} as const;

export type JudgeLanguage = keyof typeof judgeLanguages;

export function isJudgeLanguage(value: string): value is JudgeLanguage {
  return value in judgeLanguages;
}

type Judge0Response = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  time?: string | null;
  memory?: number | null;
  status?: {id: number; description: string};
};

export async function executeWithJudge(language: JudgeLanguage, sourceCode: string, stdin: string) {
  const baseUrl = (process.env.JUDGE0_API_URL || "https://ce.judge0.com").replace(/\/+$/, "");
  const headers: Record<string, string> = {"Content-Type": "application/json"};
  if (process.env.JUDGE0_API_KEY) headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
  if (process.env.JUDGE0_API_HOST) headers["X-RapidAPI-Host"] = process.env.JUDGE0_API_HOST;

  const response = await fetch(
    `${baseUrl}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,message,time,memory,status`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: judgeLanguages[language].id,
        stdin,
        cpu_time_limit: 3,
        wall_time_limit: 8,
        memory_limit: 128000,
        max_file_size: 1024,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    },
  );

  const result = (await response.json().catch(() => null)) as Judge0Response | null;
  if (!response.ok || !result) {
    throw new Error(
      result?.message || `Execution service returned ${response.status}. Check the Judge0 environment settings.`,
    );
  }

  return {
    accepted: result.status?.id === 3,
    status: result.status?.description || "Unknown",
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    compileOutput: result.compile_output || "",
    message: result.message || "",
    runtimeMs: Math.round(Number(result.time || 0) * 1000),
    memoryKb: Number(result.memory || 0),
  };
}
