import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Users } from './components/Users'
import { Signup } from './components/Signup'
import { Routes } from './components/Routes'
import { Orders } from './components/Orders'
import { NavBar } from './components/Navigation'
import { OrderTypes } from './components/OrderTypes'

import 'bootstrap/dist/css/bootstrap.min.css'

const bearer = localStorage.getItem('bearer')
const user = bearer ? JSON.parse(atob(bearer)) : {}

export const App = () => (
  <BrowserRouter>
    <NavBar {...user} />
    <Switch>
      <Route path='/' exact component={bearer ? Home : Login} />
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='/ordertypes' component={OrderTypes} />
      <Route path='/routes' component={Routes} />
      <Route path='/users' component={Users} />
      <Route path='/orders' component={Orders} />
    </Switch>
  </BrowserRouter>
)
