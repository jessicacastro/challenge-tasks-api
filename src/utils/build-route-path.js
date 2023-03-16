export const buildRoutePath = (path) => {
  // Find any word that starts with a colon, with letters or numbers
  // that can be repeated one or more times globally (it means that will find all occurrences)
  const routeParamsRegex = /:([a-zA-Z0-9]+)/g
  const pathWithParams = path.replaceAll(routeParamsRegex, '(?<$1>[a-z0-9\-_]+)')
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}