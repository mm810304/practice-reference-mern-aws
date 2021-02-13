import React from 'react';
import Head from 'next/head';

import Nav from './Nav';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
      </Head>
      <Nav />
      <div className='container pt-5 pb-5'>
        {children}
      </div>
    </React.Fragment>
  );
};

export default Layout;