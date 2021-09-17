/**
 * @description get array from url search parameter
 * @param {string} paramName  parameter name
 * @returns {Array<string>}
 */
export const getValueFromUrlSearch = paramName => {
  const url = new URL(location.href)
  return url.searchParams.get(paramName)
}
