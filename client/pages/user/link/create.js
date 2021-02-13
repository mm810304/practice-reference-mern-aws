import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { getCookie, isAuth } from '../../../helpers/auth';

const CreateLinkPage = ({ token }) => {
  const [state, setState] = useState({
    title: '',
    url: '',
    categories: [],
    loadedCategories: [],
    success: '',
    error: '',
    type: '',
    medium: ''
  });
  const { title, url, categories, loadedCategories, success, error, type, medium } = state;

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data })
  };

  useEffect(() => {
    loadCategories()
  }, [success]);

  const typeTextHandler = (e) => {
    setState({...state, [e.target.name]: e.target.value })
  }

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
    setState({ ...state, categories: all, success: '', error: '' });
  };

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: '', error: '' });
  };

  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: '', error: '' });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/link`, { title, url, categories, type, medium }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setState({ 
        ...state, 
        title: '', 
        url: '', 
        success: 'Link is created.', 
        error: '', 
        loadedCategories: [], 
        categories: [], 
        type: '', 
        medium: ''
      });
    } catch (error) {
      console.log('Link sumbit error', error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  return (
    <React.Fragment>
    <div className="row">
      <div className="col-md-12">
        <h1>Submit Link/URL</h1>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4">
        <div className="form-group">
          <label className="text-muted ml-4">Category</label>
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
        <div className="form-group">
          <label className="text-muted ml-4">Medium</label>
          <React.Fragment>
        <div className="form-check ml-3">
          <label className="form-check-label">
            <input 
              type="radio" 
              onChange={handleMediumClick} 
              checked={medium === 'video'} 
              value ="video" 
              className="form-check-input" 
              name="medium"
            />
            Video
          </label>
        </div>
        <div className="form-check ml-3">
          <label className="form-check-label">
            <input 
              type="radio" 
              onChange={handleMediumClick} 
              checked={medium === 'book'} 
              value ="book" 
              className="form-check-input" 
              name="medium"
            />
            Book
          </label>
        </div>
      </React.Fragment>
        </div>
        <div className="form-group">
          <label className="text-muted ml-4">Type</label>
          <React.Fragment>
        <div className="form-check ml-3">
          <label className="form-check-label">
            <input 
              type="radio" 
              onChange={handleTypeClick} 
              checked={type === 'free'} 
              value ="free" 
              className="form-check-input" 
              name="type"
            />
            Free
          </label>
        </div>
        <div className="form-check ml-3">
          <label className="form-check-label">
            <input 
              type="radio" 
              onChange={handleTypeClick} 
              checked={type === 'paid'} 
              value ="paid" 
              className="form-check-input" 
              name="type"
            />
            Paid
          </label>
        </div>
      </React.Fragment>
        </div>
      </div>
      <div className="col-md-8">
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input 
            type="text"
            name="title"
            className="form-control"
            onChange={typeTextHandler}
            value={title}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Url</label>
          <input 
            type="url"
            name="url"
            className="form-control"
            value={url}
            onChange={typeTextHandler}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-outline-warning" disabled={!token}>{isAuth() || token ? 'Submit' : 'Login to post'}</button>
        </div>
      </form>
      </div>
    </div>
    </React.Fragment>
  )
};

CreateLinkPage.getInitialProps = ({ req }) => {
  const token = getCookie('token', req);
  return {
    token
  }
}

export default CreateLinkPage;