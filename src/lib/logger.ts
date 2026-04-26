/**
 * Structured logger.
 *
 * Dev:  human-readable lines on console.
 * Prod: structured JSON lines on console (one record per line; pluggable
 *       to a real log shipper later by replacing the emit() body).
 *
 * Never logs secrets, tokens, full request bodies, or PII. Callers pass
 * sanitized context only.
 */

export type LogLevel = 'info' | 'warn' | 'error'

export type LogContext = {
  route?: string
  method?: string
  userAgent?: string
  ip?: string
  context?: Record<string, unknown>
}

type LogRecord = LogContext & {
  level: LogLevel
  message: string
  timestamp: string
}

const isProd = process.env.NODE_ENV === 'production'

function emit(record: LogRecord) {
  if (isProd) {
    const line = JSON.stringify(record)
    if (record.level === 'error') console.error(line)
    else if (record.level === 'warn') console.warn(line)
    else console.log(line)
    return
  }
  const tag = `[${record.level.toUpperCase()}]`
  const meta = [
    record.route && `route=${record.route}`,
    record.method && `method=${record.method}`,
    record.ip && `ip=${record.ip}`,
  ]
    .filter(Boolean)
    .join(' ')
  const head = `${tag} ${record.message}${meta ? ' ' + meta : ''}`
  const tail = record.context ? ' ' + JSON.stringify(record.context) : ''
  if (record.level === 'error') console.error(head + tail)
  else if (record.level === 'warn') console.warn(head + tail)
  else console.log(head + tail)
}

function build(level: LogLevel, message: string, ctx: LogContext = {}): LogRecord {
  return { level, message, timestamp: new Date().toISOString(), ...ctx }
}

export const logger = {
  info: (message: string, ctx: LogContext = {}) => emit(build('info', message, ctx)),
  warn: (message: string, ctx: LogContext = {}) => emit(build('warn', message, ctx)),
  error: (message: string, ctx: LogContext = {}) => emit(build('error', message, ctx)),
}

/**
 * Extract safe request metadata for logging. Never includes body or auth headers.
 */
export function reqMeta(request: Request): Pick<LogContext, 'route' | 'method' | 'userAgent' | 'ip'> {
  const url = new URL(request.url)
  const headers = request.headers
  const xff = headers.get('x-forwarded-for')
  const ip = xff ? xff.split(',')[0].trim() : (headers.get('x-real-ip') ?? undefined)
  return {
    route: url.pathname,
    method: request.method,
    userAgent: headers.get('user-agent') ?? undefined,
    ip,
  }
}
