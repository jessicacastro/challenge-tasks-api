export const extractQueryParams = (query) => query.substr(1).split('&').reduce((queryParams, param) => {
  const [key, value] = param.split('=') // ['name', 'John']

  return {
    ...queryParams,
    [key]: value
  }
}, {})