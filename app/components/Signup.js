import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import request from '../request'

const onSubmit = (setError, setSuccess, payload) => {
  event.preventDefault()

  const { login, password, firstname, lastname, phone } = payload

  const error = [login, password, firstname, lastname].every((v) => v)
  if (!error) return setError('Please fill all required fields!')

  if (!phone || !Number.isInteger(+phone)) return setError('Phone number is invalid!')

  setError('')

  request('signup', { body: JSON.stringify(payload) })
    .then(() => setSuccess(true))
    .catch(() => setError('Server responded with an error. Please check your data'))
}

const onChange = (set) => ({ target: { value } }) => set(value)

export const Signup = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  return (
    !success ?
      <Form>
        <Form.Group controlId='formLogin'>
          <Form.Label>Login</Form.Label>
          <Form.Control size='lg' type='text' placeholder='Enter your login' value={login} onChange={onChange(setLogin)} />
        </Form.Group>

        <Form.Group controlId='formPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control size='lg' type='password' placeholder='Password' value={password} onChange={onChange(setPassword)} />
        </Form.Group>

        <Form.Group controlId='formFirstname'>
          <Form.Label>Firstname</Form.Label>
          <Form.Control size='lg' type='text' placeholder='Enter your firstname' value={firstname} onChange={onChange(setFirstname)} />
        </Form.Group>

        <Form.Group controlId='formLastname'>
          <Form.Label>Lastname</Form.Label>
          <Form.Control size='lg' type='text' placeholder='Enter your lastname' value={lastname} onChange={onChange(setLastname)} />
        </Form.Group>

        <Form.Group controlId='formPhone'>
          <Form.Label>Phone number</Form.Label>
          <Form.Control size='lg' type='number' placeholder='Enter your phone number' value={phone} onChange={onChange(setPhone)} />
        </Form.Group>

        <Form.Group controlId='formAddress'>
          <Form.Label>Home address</Form.Label>
          <Form.Control size='lg' type='text' placeholder='Enter your home address' value={address} onChange={onChange(setAddress)} />
        </Form.Group>

        {error && <Form.Group controlId='formError'>
          <Alert variant='danger'>{error}</Alert>
        </Form.Group>}

        <Button variant='primary' type='submit' onClick={() => onSubmit(setError, setSuccess, { login, password, firstname, lastname, phone, address }) }>
          Submit
        </Button>
      </Form>
      : <Alert variant='success '>Hurray! Signup operation was successful! You can now <Link to='/login'>log in</Link></Alert>

  )
}
