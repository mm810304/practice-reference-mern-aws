import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import renderHtml from 'react-render-html';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';


import { API } from '../../config';

const LinkPage = ({ query, category, links, totalLinks, linkLimit, linkSkip, children }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linkLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, { skip: toSkip, limit });
    setAllLinks([...allLinks, ...response.data.links]);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
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
          </div>
      </div>
  ));

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold">{category.name} - URL / Links</h1>
          <div className="lead alert alert-secondary divt-4">{renderHtml(category.content || 'Dummy text for no content provided just for old entries in db')}</div>
        </div>
        <div className="col-md-4">
          <img src={category.image.url} alt={category.name} style={{ width: 'auto', maxHeight: '200px'}} />
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

LinkPage.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 10;

  const response = await axios.post(`${API}/category/${query.slug}`, { skip, limit });
  console.log('links page response', response.data)
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linkLimit: limit,
    linkSkip: skip
  }
};

export default LinkPage;