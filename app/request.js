const bearer = () => localStorage.getItem('bearer')

export default (method, conf = {}) => {
  const { headers, ...config } = conf

  const opts = Object.assign({
    method: conf.body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${bearer()}`,
      'Content-Type': conf.body ? 'application/json' : null,
      ...headers
    }
  }, config)

  return fetch(`/api/${method}`, opts).then((res) => {
    if (!res.ok) return res.text().then((value) => Promise.reject(value))

    const type = res.headers.get('content-type')
    const json = type.includes('application/json')

    return Promise.resolve(json ? res.json() : res)
  })
}
