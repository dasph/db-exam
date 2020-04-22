import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import request from '../request'

export const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    request('users').then(({ users }) => setUsers(users))
  }, [])

  return (<>
    <span>All users:</span>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Login</th>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Phone number</th>
          <th>Address</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {users.map(({ login, firstname, lastname, phone, address, createdAt }, i) =>
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{login}</td>
            <td>{firstname}</td>
            <td>{lastname}</td>
            <td>{phone}</td>
            <td>{address}</td>
            <td>{new Date(createdAt).toLocaleString()}</td>
          </tr>)
        }
      </tbody>
    </Table>
  </>)
}
