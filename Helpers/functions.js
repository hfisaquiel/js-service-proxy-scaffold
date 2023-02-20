/**
 * Simulate a action concluided after a some time
 * @param {Integer} ms A time in miliseconts
 * @returns {Promise}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Create a unique random based at current time
 * @returns {String}
 */
const uniqueId = () => Math.random() * (new Date()).getTime()

export {
  sleep,
  uniqueId
}
