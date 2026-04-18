import { createWriteStream, mkdirSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const LOG_DIR = join(homedir(), ".local", "share", "opencode", "log")
const LOG_PATH = join(LOG_DIR, "kimi-for-coding-oauth.log")

let stream: ReturnType<typeof createWriteStream> | undefined

function getStream() {
  if (stream) return stream
  try {
    mkdirSync(LOG_DIR, { recursive: true })
    stream = createWriteStream(LOG_PATH, { flags: "a" })
  } catch {
    // File logging unavailable — callers fall back to console.error
  }
  return stream
}

export function log(...args: unknown[]) {
  if (process.env.KIMI_LOG_STDERR) {
    console.error(...args)
    return
  }
  const line = `[${new Date().toISOString()}] ${args.map(String).join(" ")}\n`
  const s = getStream()
  if (s) {
    s.write(line)
  } else {
    console.error(...args)
  }
}
