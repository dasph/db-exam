const Koa = require('koa')
const send = require('koa-send')
const serve = require('koa-static')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const {
  authorize, admin, onSignup, onLogin,
  onGetOrderTypes, onDelOrderTypes, onPostOrderTypes,
  onGetRoutes, onDelRoutes, onPostRoutes,
  onGetOrders, onDelOrders, onPostOrders,
  onGetUsers, onGetAllOrders
} = require('./service')

const main = new Router()
  .use(serve('./public'))
  .get('*', (ctx) => send(ctx, 'public/index.html'))

const api = new Router({ prefix: '/api' })
  .use(bodyParser())
  .post('/signup', onSignup)
  .post('/login', onLogin)

  .get('/ordertypes', authorize, onGetOrderTypes)
  .post('/ordertypes', authorize, admin, onPostOrderTypes)
  .del('/ordertypes/:id', authorize, admin, onDelOrderTypes)

  .get('/routes', authorize, onGetRoutes)
  .post('/routes', authorize, admin, onPostRoutes)
  .del('/routes/:id', authorize, admin, onDelRoutes)

  .get('/orders', authorize, onGetOrders)
  .post('/orders', authorize, onPostOrders)
  .del('/orders/:id', authorize, onDelOrders)

  .get('/users', authorize, admin, onGetUsers)
  .get('/allorders', authorize, admin, onGetAllOrders)

  .all('*', (ctx) => ctx.throw(405))

module.exports = new Koa()
  .use(api.routes())
  .use(main.routes())
