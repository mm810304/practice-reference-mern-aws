import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import renderHtml from 'react-render-html';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';

import withAdmin from '../../withAdmin';
import { API } from '../../../config';
import { getCookie } from '../../../helpers/auth';

const AdminLinkPage = ({ links, totalLinks, linkLimit, linkSkip, token }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linkLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  console.log(totalLinks)

  const loadMore = async () => {
    let toSkip = skip + limit;

    const response = await axios.post(
        `${API}/links`,
        { skip: toSkip, limit },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    setAllLinks([...allLinks, ...response.data]);
    setSize(response.data.length);
    setSkip(toSkip);
};

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      process.browser && window.location.reload();
      console.log('Link successfully deleted');
    } catch (error) {
      console.log('Link delete error - List Categories Admin Component')
    }
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm('Are you sure you want to delete?');
    if (answer) {
      handleDelete(id)
    }
  };

  const ListOfLinks = () =>
    allLinks.map((l, i) => (
      <div className="row alert alert-primary p-2" key={i}>
          <div className="col-md-8" onClick={e => handleClick(l._id)}>
              <a href={l.url} target="_blank">
                  <h5 className="pt-2">{l.title}</h5>
                  <h6 className="pt-2 text-danger" style={{ fontSize: '12px' }}>
                      {l.url}
                  </h6>
              </a>
          </div>
          <div className="col-md-4 pt-2">
              <span className="pull-right">
                  {moment(l.createdAt).fromNow()} by {l.postedBy.name}
              </span>
              <span className="badge text-secondary pull-right">
                {l.clicks} clicks
              </span>
          </div>


          <div className="col-md-12">
              <span className="badge text-dark">
                  {l.type} / {l.medium}
              </span>
              {l.categories.map((c, i) => (
                  <span key={i} className="badge text-success">{c.name}</span>
              ))}

            <span onClick={(e) => confirmDelete(e, l._id)} className="badge text-danger pull-right">Delete</span>

            <Link href={`/user/link/${l._id}`}>
              <a><span className="badge text-warning pull-right">Update</span></a>
            </Link>
          </div>
      </div>
  ));

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          <h1 className="display-4 font-weight-bold">All Links</h1>
        </div>
      </div>

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={size > 0 && size >= limit}
        loader={<div className="loader" key={0}>Loading...</div>}
      >
        <ListOfLinks />
      </InfiniteScroll>
    </React.Fragment>
  );
};

AdminLinkPage.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 5;

  const token = getCookie('token', req);

  const response = await axios.post(`${API}/links`, { skip, limit }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return {
    links: response.data,
    totalLinks: response.data.length,
    linkLimit: limit,
    linkSkip: skip,
    token
  }
};

export default withAdmin(AdminLinkPage);