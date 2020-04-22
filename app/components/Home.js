import React, { useState, useEffect } from 'react'
import { Table, Dropdown, Alert, Button } from 'react-bootstrap'
import request from '../request'

const remove = (id, routes, setRoutes) => {
  request(`routes/${id}`, { method: 'DELETE' }).then(() => {
    setRoutes(routes.filter(({ id: sid }) => id !== sid))
  })
}

const add = ({ routes, type, from, to, date, time }, setOrders) => {
  if (!(type && from && to && date && time)) return // todo

  const departure = new Date(`${date} ${time}`)
  if (Date.now() > departure) return // todo

  const route = routes.find(({ from: f, to: t }) => from === f && to === t).id

  request(`orders`, { body: JSON.stringify({ type, route, departure }) }).then(({ orders }) => {
    setOrders(orders)
  })
}

export const Home = () => {
  const [routes, setRoutes] = useState([])
  const [types, setTypes] = useState([])
  const [orders, setOrders] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    request('routes').then(({ routes }) => setRoutes(routes))
    request('ordertypes').then(({ types }) => setTypes(types))
    request('orders').then(({ orders }) => setOrders(orders))
  }, [])

  return (<>
    <span>Your orders:</span>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Type</th>
          <th>From</th>
          <th>To</th>
          <th>Time (h)</th>
          <th>Departure</th>
        </tr>
      </thead>
      <tbody>
        {
          orders.map(({ type, route, departure }, i) => <tr key={i}>
            <td>{i + 1}</td>
            <td>{(types.find(({ id }) => type === id) || {}).type}</td>
            <td>{(routes.find(({ id }) => route === id) || {}).from}</td>
            <td>{(routes.find(({ id }) => route === id) || {}).to}</td>
            <td>{(routes.find(({ id }) => route === id) || {}).time}</td>
            <td>{new Date(departure).toLocaleString()}</td>
          </tr>)
        }
        <tr>
          <td>
            <Button variant='success' onClick={() => add(({ routes, type, from, to, date, time }), setOrders)}>add</Button>
          </td>
          <td>
            <Dropdown>
              <Dropdown.Toggle variant='success' style={{ fontSize: '0.6em' }}>
                {type ? types.find(({ id }) => id === type).type : 'Select type'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {types.map(({ id, type }) => <Dropdown.Item key={id} onClick={() => setType(id)} style={{ fontSize: '1.6em' }}>{type}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
          </td>
          <td>
            <Dropdown>
              <Dropdown.Toggle variant='success' style={{ fontSize: '0.6em' }}>
                {from || 'Pick point A'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFrom('')} style={{ fontSize: '1.6em' }}>none</Dropdown.Item>
                {[... new Set(routes.filter(({ to: t }) => to ? to === t : true).map(({ from }) => from))].map((from) => <Dropdown.Item key={from} onClick={() => setFrom(from)} style={{ fontSize: '1.6em' }}>{from}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
          </td>
          <td>
            <Dropdown>
              <Dropdown.Toggle variant='success' style={{ fontSize: '0.6em' }}>
                {to || 'Pick point B'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setTo('')} style={{ fontSize: '1.6em' }}>none</Dropdown.Item>
                {[... new Set(routes.filter(({ from: f }) => from ? from === f : true).map(({ to }) => to))].map((to) => <Dropdown.Item key={to} onClick={() => setTo(to)} style={{ fontSize: '1.6em' }}>{to}</Dropdown.Item>)}
              </Dropdown.Menu>
            </Dropdown>
          </td>
          <td>
            <Alert variant={from && to ? 'success' : ''} style={{ textAlign: 'center', padding: '0' }}>
              {from && to ? routes.find(({ from: f, to: t }) => from === f && to === t).time : '∞'}
            </Alert>
          </td>
          <td>
            <input type='date' onChange={({ target: { value } }) => setDate(value)} />
            <input type='time' onChange={({ target: { value } }) => setTime(value)} />
          </td>
        </tr>
      </tbody>
    </Table>
  </>)
}
