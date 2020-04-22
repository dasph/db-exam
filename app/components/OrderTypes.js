import React, { useState, useEffect } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import request from '../request'

const remove = (id, types, setTypes) => {
  request(`ordertypes/${id}`, { method: 'DELETE' }).then(() => {
    setTypes(types.filter(({ id: sid }) => id !== sid))
  })
}

const add = (type, types, setTypes) => {
  request(`ordertypes`, { body: JSON.stringify({ type }) }).then(({ types }) => {
    setTypes(types)
  })
}

export const OrderTypes = () => {
  const [types, setTypes] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    request('ordertypes').then(({ types }) => setTypes(types))
  }, [])

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {types.map(({ id, type }) => <tr key={id}><td>{id}</td><td>{type}</td><td>
          <Button variant='danger' onClick={() => remove(id, types, setTypes)}>delete</Button>
        </td></tr>)}
        <tr><td>🆕</td><td>
          <Form.Control size='lg' type='text' placeholder='new type' value={value} onChange={({ target: { value } }) => setValue(value)} />
        </td>
        <td>
          <Button variant='success' onClick={() => add(value, types, setTypes)}>add</Button>
        </td>
        </tr>
      </tbody>
    </Table>
  )
}
