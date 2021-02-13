import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const ForgotPasswordPage = () => {
  const [state, setState] = useState({
    email: '',
    buttonText: 'Forgot Password',
    success: '',
    error: ''
  });

  const { email, buttonText, success, error} = state;

  const changeHandler = (e) => {
    setState({
      ...state,
      email: e.target.value,
      success: '',
      error: ''
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      setState({
        ...state,
        email: '',
        buttonText: 'Complete',
        success: response.data.message
      })
    } catch (error) {
      console.log('Forgot password error', error);
      setState({
        ...state,
        error: error.response.data.error
      });
    }
  };

  return (
    <div className='col-md-6 offset-md-3'>
      <h2>Enter your email to reset your password.</h2>
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <input
            type="email"
            className="form-control"
            onChange={changeHandler}
            value={email}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <button className="btn btn-outline-warning">{buttonText}</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;