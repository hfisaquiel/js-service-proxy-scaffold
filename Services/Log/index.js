import { uniqueId } from '../../Helpers/functions'

const cacheLog = async (message) => {
  console[message.level](message.message, message.context)
}

/**
 * Register a info provided message
 * @param {String} level log|error|warn|info|debug
 * @param {String} message a provided information to log out
 * @param {Object|Json} context a context to put out
 */
export const store = (level, message, context = null) => {
  const content = {
    id: uniqueId,
    level,
    message,
    context
  }

  cacheLog(content)
}

/**
 * Register a Log as log level
 * @param {String} message a provided information to log out
 * @param {Object|Json} context a context to put out
 */
export const log = (message, context = null) => store('log', message, context)

/**
 * Register a Log as error level
 * @param {String} message a provided information to log out
 * @param {Object|Json} context a context to put out
 */
export const error = (message, context = null) => store('error', message, context)

/**
 * Register a Log as warn level
 * @param {String} message a provided information to log out
 * @param {Object|Json} context a context to put out
 */
export const warn = (message, context = null) => store('warn', message, context)

/**
 * Register a Log as info level
 * @param {String} message a provided information to log out
 * @param {Object|Json} context a context to put out
 */
export const info = (message, context = null) => store('info', message, context)

/**
 * Register a Log as debug level
 * @param {String} message a provided information to log out
 * @param {Object|Json} context a context to put out
 */
export const debug = (message, context = null) => store('debug', message, context)

export const Log = {
  store,
  log,
  error,
  warn,
  info,
  debug
}

export default Log
