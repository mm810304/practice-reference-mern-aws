import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';

import { isAuth } from '../helpers/auth';
import { API } from '../config';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';

const RegisterPage = () => {
  const [registerState, setRegisterState] = useState({
    name: 'mike',
    email: 'mm810304@gmail.com',
    password: '123456',
    password2: '123456',
    error: '',
    success: '',
    buttonText: 'Register',
    loadedCategories: [],
    categories: []
  });
  
  const { name, email, password, password2, error, success, buttonText, loadedCategories, categories } = registerState;

  useEffect(() => {
    isAuth() && Router.push('/');
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setRegisterState({ ...registerState, loadedCategories: response.data })
  };

  useEffect(() => {
    loadCategories()
  }, []);

  const handleToggle = c => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
        all.push(c);
    } else {
        all.splice(clickedCategory, 1);
    }
    console.log('all >> categories', all);
    setRegisterState({ ...registerState, categories: all, success: '', error: '' });
  };

  const onChangeHandler = (e) => {
    setRegisterState({
      ...registerState,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert('Passwords do not match');
      return '';
    } 

    setRegisterState({ ...registerState, buttonText: 'Registering...' });

    try {
      const response = await axios.post(`${API}/register`, {
        name: name,
        email: email,
        password: password,
        categories: categories
      });

      setRegisterState({
        ...registerState,
        name: '',
        email: '',
        password: '',
        password2: '',
        buttonText: 'Submitted',
        success: response.data.message
      });
    } catch (error) {
      setRegisterState({
        ...registerState,
        buttonText: 'Register',
        error: error.response.data.error
      })
    }
  };

  return (
    <div className='col-md-6 offset-md-3'>
      <h1 className='pb-3'>Register</h1>
      {success && (showSuccessMessage(success))}
      {error && showErrorMessage(error)}
      <form onSubmit={onSubmitHandler}>
      <div className='form-group'>
        <input 
          type='text'
          name='name' 
          className='form-control' 
          placeholder='Enter your name...'
          value={name}
          onChange={onChangeHandler}
          required 
        />
      </div>
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
        <input 
          type='password' 
          name='password2'
          className='form-control' 
          placeholder='Confirm Password' 
          value={password2}
          onChange={onChangeHandler} 
        />
      </div>
      <div className="form-group">
        <h5 className="text-muted">Categories</h5>
        <ul style={{ maxHeight: '150px', overflowY: 'scroll'}}>
              {loadedCategories && loadedCategories.map((category, i) => (
              <li className="list-unstyled" key={category._id}>
                <input 
                  type="checkbox" 
                  onChange={handleToggle(category._id)} 
                  className="mr-2" 
                  checked={categories.includes(category._id)}
                />
                <label className="form-check-label">{category.name}</label>
              </li>
          ))}
          </ul>
      </div>
      <div className='form-group'>
        <button className='btn btn-outline-warning'>{buttonText}</button>
      </div>
    </form>
    </div>
  );
};

export default RegisterPage;