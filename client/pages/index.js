import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import { API } from '../config';
import ListCategories from '../components/ListCategories';

const HomePage = ({ categories }) => {
  const [popular, setPopular] = useState([]);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular`);
    setPopular(response.data);
  }

  useEffect(() => {
    loadPopular();
  }, []);

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
            <h1 className="font-weight-bold">Browse Tutorials/Courses</h1>
            <br />
        </div>
      </div>
      <div className="row">
        <ListCategories categories={categories} />
      </div>
      <div className="row pt-5">
        <h2 className="font-weight-bold pb-3">Trending</h2>
        <div className="col-md-12">
          {popular.map((link, index) => {
            return (
              <React.Fragment>
                <div key={index} className="row alert alert-secondary p-2">
                  <div className="col-md-8" onClick={() => handleClick(link._id)}>
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
                  {link.categories.map((category, index) => {
                    return (
                      <span key={index} className="badge text-success">
                        {category.name}
                      </span>
                    )
                  })}
                  <span className="badge text-secondary pull-right">{link.clicks} Clicks</span>
                </div>
                </div>
              </React.Fragment>
              
          )})}
        </div>
      </div>
      
    </React.Fragment>
  );
};

HomePage.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data
  }
};

export default HomePage;