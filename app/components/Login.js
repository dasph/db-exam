import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import request from '../request'

const onSubmit = (setError, payload) => {
  event.preventDefault()

  const { login, password } = payload

  const error = [login, password].every((v) => v)
  if (!error) return setError('Please fill all required fields!')

  setError('')

  request('login', { body: JSON.stringify(payload) })
    .then(({ bearer }) => {
      localStorage.setItem('bearer', bearer)
      location.replace('/')
    })
    .catch(() => setError('Server responded with an error. Please check your data'))
}

const onChange = (set) => ({ target: { value } }) => set(value)

export const Login = () => {
  const [error, setError] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Form>
      <Form.Group controlId='formLogin'>
        <Form.Label>Login</Form.Label>
        <Form.Control size='lg' type='text' placeholder='Enter your login' value={login} onChange={onChange(setLogin)} />
      </Form.Group>

      <Form.Group controlId='formPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control size='lg' type='password' placeholder='Password' value={password} onChange={onChange(setPassword)} />
      </Form.Group>

      {error && <Form.Group controlId='formError'>
        <Alert variant='danger'>{error}</Alert>
      </Form.Group>}

      <Button variant='primary' type='submit' onClick={() => onSubmit(setError, { login, password }) }>
        Submit
      </Button>
    </Form>
  )
}
