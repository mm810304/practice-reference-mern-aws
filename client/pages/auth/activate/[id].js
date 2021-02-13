import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { withRouter } from 'next/router';

import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const ActivateAccountPage = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    buttonText: 'Activate Account',
    success: '',
    error: ''
  });

  const {name, token, buttonText, success, error} = state;

  useEffect(() => {
    let token = router.query.id;

    if (token) {
      const { name } = jwt.decode(token);
      setState({
        ...state,
        name: name,
        token: token
      });
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setState({ ...state, buttonText: 'Activating...'});

    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      console.log(response.data);

      setState({
        ...state,
        name: '',
        token: '',
        buttonText: 'Activated',
        success: response.data.message
      });
    } catch (error) {
      console.log(error)
      setState({
        ...state,
        buttonText: 'Activate Account',
        error: error.response.data.error
      });
    }
  }

 return (
   <div className='row'>
     <div className='col-md-6 offset-md-3'>
       <h2>Hello {name}.  Click the button below to activate your account.</h2>
       {success && showSuccessMessage(success)}
       {error && showErrorMessage(error)}
       <button 
          className='btn btn-outline-warning btn-block'
          onClick={handleSubmit}
        >
          {buttonText}
        </button>
     </div>
   </div>
 );
};

export default withRouter(ActivateAccountPage);