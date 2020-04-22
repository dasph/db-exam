import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'

const signout = () => {
  localStorage.clear('bearer')
  location.replace('/')
}

export const NavBar = ({ rank, firstname, lastname }) => {
  return (
    <Navbar bg='dark' variant='dark' sticky='top'>
      <Navbar.Brand href='/'>
        <img src='images/logo.png' width='48' height='48' className='d-inline-block align-top' />
      </Navbar.Brand>
      <Nav className='mr-auto'>
        <Link className='nav-link' to='/'>Home</Link>
        { rank === 0 &&
          <>
            <Link className='nav-link' to='/users' style={{ margin: '0px 5px'}}>Users</Link>
            <Link className='nav-link' to='/orders'style={{ margin: '0px 5px'}}>Orders</Link>
            <Link className='nav-link' to='/routes'style={{ margin: '0px 5px'}}>Routes</Link>
            <Link className='nav-link' to='/ordertypes' style={{ margin: '0px 5px'}}>Order Types</Link>
          </>
        }
      </Nav>
      <Navbar.Collapse className='justify-content-end'>
        <Navbar.Text>
          {firstname ?
            <Dropdown>
              <Dropdown.Toggle variant='primary' id='dropdown-basic' style={{ fontSize: '0.7em' }}>
                Signed in as: {firstname} {lastname}
              </Dropdown.Toggle>

              <Dropdown.Menu >
                <Dropdown.Item style={{ color: 'black', fontSize: '1.5em' }} onClick={signout}>Sign out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            : <><Link to='/login'>Login</Link> / <Link to='/signup'>Signup</Link></>
          }
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};
