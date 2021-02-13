import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import moment from 'moment';

import { API } from '../../config';
import withUser from '../withUser';


const UserPage = ({ user, token, userLinks }) => {

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Router.replace('/user')
    } catch (error) {
      console.log('Link delete error - User Page', error)
    }
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();
    console.log('Did something happen?', id)
    let answer = window.confirm('Are you sure you want to delete?');
    if (answer) {
      handleDelete(id)
    }
  };
 
  return (
    <div>
      <h1>{user.name}'s Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user/link/create">
                <a className="nav-link">
                  Submit a Link
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link">
                  Update Profile
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Your Links</h2>
          {userLinks.map((link, index) => {
            return (
              <div key={index} className="row alert alert-primary p-2">
                <div className="col-md-8">
                  <a href={link.url} target="_blank">
                    <h5 className="pt-2">{link.title}</h5>
                    <h6 className="pt-2 text-danger" style={{ fontSize: '12px'}}>{link.url}</h6>
                  </a>
                </div>
                <div className="col-md-4 pt-2">
                  <span className="pull-right">{moment(link.createdAt).fromNow()} by {link.postedBy.name}</span>
                </div>
                <div className="col-md-12">
                  <span className="badge text-dark">{link.type} / {link.medium}</span>
                  {link.categories.map((category, index) => (
                      <span key={index} className="badge text-success">{category.name}</span>
                    )
                  )}
                    <span className="badge text-secondary">{link.clicks} Clicks</span>
        
                    <span onClick={(e) => confirmDelete(e, link._id)} className="badge text-danger pull-right">Delete</span>
        
                    <Link href={`/user/link/${link._id}`}>
                      <span className="badge text-warning pull-right">Update</span>
                    </Link>
                </div>  
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
};


export default withUser(UserPage);