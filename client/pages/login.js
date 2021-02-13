import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';

import { authenticate, isAuth } from '../helpers/auth';
import { API } from '../config';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';

const LoginPage = () => {
  const [loginState, setLoginState] = useState({
    email: 'mm810304@gmail.com',
    password: '123456',
    error: '',
    success: '',
    buttonText: 'Login'
  });
  
  const { email, password, error, success, buttonText } = loginState;

  useEffect(() => {
    isAuth() && Router.push('/');
  }, []);

  const onChangeHandler = (e) => {
    setLoginState({
      ...loginState,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoginState({ ...loginState, buttonText: 'Logging in...' });

    try {
      const response = await axios.post(`${API}/login`, {
        email: email,
        password: password
      });
      
      authenticate(response, () => {
         return isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user'); 
      })

    } catch (error) {
      setLoginState({
        ...loginState,
        buttonText: 'Login',
        error: error.response.data.error
      })
    }
  };

  return (
    <div className='col-md-6 offset-md-3'>
      <h1 className='pb-3'>Login</h1>
      {success && (showSuccessMessage(success))}
      {error && showErrorMessage(error)}
      <form onSubmit={onSubmitHandler}>
      <div className='form-group'>
        <input 
          type='email'
          name='email' 
          className='form-control' 
          placeholder='Enter your email...' 
          value={email}
          onChange={onChangeHandler} 
          required
        />
      </div>
      <div className='form-group'>
        <input 
          type='password' 
          name='password'
          className='form-control' 
          placeholder='Enter your password...' 
          value={password}
          onChange={onChangeHandler} 
          required
        />
      </div>
      <div className='form-group'>
        <button className='btn btn-outline-warning'>{buttonText}</button>
      </div>
    </form>
    <Link href="/auth/password/forgot">
      <a className="text-danger float-right">Forgot Password</a>
    </Link>
    </div>
  );
};

export default LoginPage;