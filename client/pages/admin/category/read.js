import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { API } from '../../../config';
import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import ListCategoriesAdmin from '../../../components/ListCategoriesAdmin';

const ViewCategoriesAdminPage = ({ user, token }) => {
  const [state, setState] = useState({
    categories: [],
    error: '',
    success: '',
  });
  const { categories, error, success } = state;

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, categories: response.data });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Category successfully deleted');
      loadCategories();
    } catch (error) {
      console.log('Category delete error - List Categories Admin Component')
    }
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let answer = window.confirm('Are you sure you want to delete?');
    if (answer) {
      handleDelete(slug)
    }
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col">
          <h1>List of Categories</h1>
        </div>
      </div>
      <div className="row">
        <ListCategoriesAdmin categories={categories} token={token} handleDelete={handleDelete} confirmDelete={confirmDelete} />
      </div>
    </React.Fragment>
  );
};

export default withAdmin(ViewCategoriesAdminPage);


