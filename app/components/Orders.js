import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap'
import request from '../request'

const remove = (id, orders, setOrders) => {
  request(`orders/${id}`, { method: 'DELETE' })
    .then(() => setOrders(orders.filter(({ id: oid }) => id !== oid)))
}

export const Orders = () => {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    request('users').then(({ users }) => setUsers(users))
    request('routes').then(({ routes }) => setRoutes(routes))
    request('allorders').then(({ orders }) => setOrders(orders))
  }, [])

  return (<>
    <span>All orders:</span>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>From</th>
          <th>To</th>
          <th>Departure</th>
          <th>Created</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(({ id, user, route, departure, createdAt }, i) => <tr key={i}>
            <td>{i + 1}</td>
            <td>{(users.find(({ id }) => id === user) || {}).firstname}</td>
            <td>{(users.find(({ id }) => id === user) || {}).lastname}</td>
            <td>{(routes.find(({ id }) => route === id) || {}).from}</td>
            <td>{(routes.find(({ id }) => route === id) || {}).to}</td>
            <td>{new Date(departure).toLocaleString()}</td>
            <td>{new Date(createdAt).toLocaleString()}</td>
            <td><Button variant='danger' onClick={() => remove(id, orders, setOrders)}>delete</Button></td>
          </tr>
        )}
      </tbody>
    </Table>
  </>)
}
