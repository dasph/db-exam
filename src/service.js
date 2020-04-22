const { createHmac } = require('crypto')
const { User, Order, OrderType, Route } = require('./models')

const AUTH_SECRET = 'a secter token that only the server knows'

const hashObject = (obj) => Object.values(obj).reduce((a, c) => a.update(`${c}`), createHmac('sha256', AUTH_SECRET)).digest('base64')

const sign = (payload) => {
  const hash = hashObject(payload)
  const json = JSON.stringify({ ...payload, hash })

  return Buffer.from(json).toString('base64')
}

const verify = async (bearer) => {
  const string = Buffer.from(bearer, 'base64').toString()

  const { hash, ...payload } = JSON.parse(string)
  const hmac = hashObject(payload)

  return hash === hmac
    ? Promise.resolve(payload)
    : Promise.reject(new Error('Hashes do not match'))
}

const authorize = (ctx, next) => {
  const { authorization } = ctx.header
  if (!authorization) return ctx.throw(400)

  const [, bearer] = authorization.split(' ')

  return verify(bearer || '').then((data) => {
    return Object.assign(ctx.state, data) && next()
  }).catch(() => ctx.throw(401))
}

const admin = (ctx, next) => ctx.state.rank === 0 ? next() : ctx.throw(403)

const onSignup = async (ctx) => {
  const { login, password, firstname, lastname, phone, address } = ctx.request.body

  const error = [login, password, firstname, lastname].every((v) => v)
  if (!error) return ctx.throw(400)

  const hmac = createHmac('sha256', AUTH_SECRET).update(password).digest('base64')
  await User.create({ login, hmac, firstname, lastname, phone, address })

  ctx.status = 200
}

const onLogin = async (ctx) => {
  const { login, password } = ctx.request.body

  if (!(login && password)) return ctx.throw(400)
  const hmac = createHmac('sha256', AUTH_SECRET).update(password).digest('base64')

  const user = await User.findOne({ where: { login, hmac } })
  if (!user) return ctx.throw(401)

  const { hmac: uhmac, createdAt, ...payload } = user.toJSON()

  const bearer = sign({ signed: Date.now(), ...payload })

  ctx.body = { bearer }
}

const onGetOrderTypes = async (ctx) => {
  const types = await OrderType.findAll()
  ctx.body = { types }
}

const onDelOrderTypes = async (ctx) => {
  const { id } = ctx.params
  if (!id) return ctx.throw(400)

  const type = await OrderType.findOne({ where: { id } })
  if (!type) return ctx.throw(404)

  await type.destroy()
  ctx.status = 200
}

const onPostOrderTypes = async (ctx) => {
  const { type } = ctx.request.body
  if (!type) return ctx.throw(400)

  await OrderType.create({ type })
  const types = await OrderType.findAll()

  ctx.body = { types }
}

const onGetRoutes = async (ctx) => {
  const routes = await Route.findAll()
  ctx.body = { routes }
}

const onDelRoutes = async (ctx) => {
  const { id } = ctx.params
  if (!id) return ctx.throw(400)

  const route = await Route.findOne({ where: { id } })
  if (!route) return ctx.throw(404)

  await route.destroy()
  ctx.status = 200
}

const onPostRoutes = async (ctx) => {
  const { from, to, time } = ctx.request.body
  if (!(from && to && time)) return ctx.throw(400)

  await Route.create({ from, to, time })
  const routes = await Route.findAll()

  ctx.body = { routes }
}

const onGetOrders = async (ctx) => {
  const { id: user } = ctx.state

  const orders = await Order.findAll({ where: { user }})
  ctx.body = { orders }
}

const onDelOrders = async (ctx) => {
  const { id } = ctx.params
  if (!id) return ctx.throw(400)

  const { rank, id: user } = ctx.state

  const order = await Order.findOne(rank === 0 ? { where: { id } } : { where: { user, id } })
  if (!order) return ctx.throw(404)

  await order.destroy()
  ctx.status = 200
}

const onPostOrders = async (ctx) => {
  const { type, route, departure } = ctx.request.body
  if (!(type && route && departure)) return ctx.throw(400)

  const { id: user } = ctx.state

  await Order.create({ type, user, route, departure })

  const orders = await Order.findAll({ where: { user } })

  ctx.body = { orders }
}

const onGetUsers = async (ctx) => {
  const users = await User.findAll({ attributes: { exclude: ['hmac', 'rank'] } })

  ctx.body = { users }
}

const onGetAllOrders = async (ctx) => {
  const orders = await Order.findAll()

  ctx.body = { orders }
}

module.exports = {
  authorize, admin, onSignup, onLogin,
  onGetOrderTypes, onDelOrderTypes, onPostOrderTypes,
  onGetRoutes, onDelRoutes, onPostRoutes,
  onGetOrders, onDelOrders, onPostOrders,
  onGetUsers, onGetAllOrders
}
