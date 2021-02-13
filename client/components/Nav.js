import React from 'react';
import Link from 'next/link';

import { isAuth, logout } from '../helpers/auth';

const Nav = () => {
  return (
    <ul className='nav nav-tabs bg-warning'>
      <li className='nav-item'>
        <Link href='/'>
          <a className='nav-link text-dark'>Home</a>
        </Link>
      </li>
      {
        !isAuth() && (
          <React.Fragment>
            <li className='nav-item'>
              <Link href='/login'>
                <a className='nav-link text-dark'>Login</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/register' >
                <a className='nav-link text-dark'>Register</a>
              </Link>
            </li>
          </React.Fragment>
        )
      }
      {
        isAuth() && isAuth().role === 'admin' && (
          <li className='nav-item ml-auto'>
            <Link href='/admin' >
              <a className='nav-link text-dark'>Admin</a>
            </Link>
          </li>
        )
      }
      {
        isAuth() && isAuth().role === 'subscriber' && (
          <React.Fragment>
            <li className='nav-item ml-auto'>
              <Link href='/user' >
                <a className='nav-link text-dark'>User</a>
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/user/link/create' >
                <a className='nav-link text-dark'>Create Link</a>
              </Link>
            </li>
          </React.Fragment>
        )
      }
      {
        isAuth() && (
          <li className='nav-item'>
            <a onClick={logout} className='nav-link text-dark'>Logout</a>
          </li>
        )
      }
    </ul>
  );
};

export default Nav;