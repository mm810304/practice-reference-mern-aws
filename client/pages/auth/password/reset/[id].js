import { useState, useEffect } from 'react';
import axios from 'axios';
import Router, { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';

import { API } from '../../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../../helpers/alerts';

const ResetPasswordPage = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Reset Password',
    success: '',
    error: ''
  });

  const { name, token, newPassword, buttonText, success, error } = state;

  useEffect(() => {
    const decoded = jwt.decode(router.query.id);
    if (decoded) {
      setState({
        ...state,
        name: decoded.name,
        token: router.query.id
      });
    }
  }, [router]);

  const changeHandler = (e) => {
    setState({
      ...state,
      newPassword: e.target.value,
      success: '',
      error: ''
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Sending...'});
    try {
      const response = await axios.put(`${API}/reset-password`, { resetPasswordLink: token, newPassword });

      setState({
        ...state,
        newPassword: '',
        buttonText: 'Done',
        success: response.data.message
      })
    } catch (error) {
      console.log('Forgot password error', error);
      setState({
        ...state,
        buttonText: 'Reset Password',
        error: error.response.data.error
      });
    }
  };

  return (
    <div className='col-md-6 offset-md-3'>
      <h2>Reset Password</h2>
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <input
            type="password"
            className="form-control"
            onChange={changeHandler}
            value={newPassword}
            placeholder="Enter your new password"
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

export default withRouter(ResetPasswordPage);