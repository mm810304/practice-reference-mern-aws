import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';

import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import withUser from '../../withUser';
import { updateUser } from '../../../helpers/auth';

const ProfilePage = ({ user, token }) => {
  const [updateState, setUpdateState] = useState({
    name: user.name,
    email: user.email,
    password: '',
    password2: '',
    error: '',
    success: '',
    buttonText: 'Update',
    loadedCategories: [],
    categories: user.categories
  });
  
  const { name, email, password, password2, error, success, buttonText, loadedCategories, categories } = updateState;

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setUpdateState({ ...updateState, loadedCategories: response.data })
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
    setUpdateState({ ...updateState, categories: all, success: '', error: '' });
  };

  const onChangeHandler = (e) => {
    setUpdateState({
      ...updateState,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert('Passwords do not match');
      return '';
    } 

    setUpdateState({ ...updateState, buttonText: 'Updating...' });

    try {
      const response = await axios.put(`${API}/user`, {
        name: name,
        password: password,
        categories: categories
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      updateUser(response.data, () => {
        setUpdateState({
          ...updateState,
          buttonText: 'Submitted',
          success: 'Profile Successfully Updated!'
        });
      });

    } catch (error) {
      setUpdateState({
        ...updateState,
        buttonText: 'Update',
        error: error.response.data.error
      })
    }
  };

  return (
    <div className='col-md-6 offset-md-3'>
      <h1 className='pb-3'>Profile</h1>
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
          disabled
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

export default withUser(ProfilePage);