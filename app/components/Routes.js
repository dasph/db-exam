import React, { useState, useEffect } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import request from '../request'

const remove = (id, routes, setRoutes) => {
  request(`routes/${id}`, { method: 'DELETE' }).then(() => {
    setRoutes(routes.filter(({ id: sid }) => id !== sid))
  })
}

const add = (route, setRoutes) => {
  request(`routes`, { body: JSON.stringify(route) }).then(({ routes }) => {
    setRoutes(routes)
  })
}

export const Routes = () => {
  const [routes, setRoutes] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    request('routes').then(({ routes }) => setRoutes(routes))
  }, [])

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>From</th>
          <th>To</th>
          <th>Time (h)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {routes.map(({ id, from, to, time }) => <tr key={id}><td>{id}</td><td>{from}</td><td>{to}</td><td>{time}</td><td>
          <Button variant='danger' onClick={() => remove(id, routes, setRoutes)}>delete</Button>
        </td></tr>)}
        <tr><td>🆕</td>
        <td>
          <Form.Control size='lg' type='text' placeholder='start' value={from} onChange={({ target: { value } }) => setFrom(value)} />
        </td>
        <td>
          <Form.Control size='lg' type='text' placeholder='end' value={to} onChange={({ target: { value } }) => setTo(value)} />
        </td>
        <td>
          <Form.Control size='lg' type='text' placeholder='duration' value={time} onChange={({ target: { value } }) => setTime(value)} />
        </td>
        <td>
          <Button variant='success' onClick={() => add(({ from, to, time }), setRoutes)}>add</Button>
        </td>
        </tr>
      </tbody>
    </Table>
  )
}
