import React from 'react';
import axios from 'axios';
import Link from 'next/link';

const ListCategoriesAdmin = ({ categories, token, confirmDelete }) => { 

  return (
    <React.Fragment>
      {categories.map((category, index) => (
        <Link href={`/links/${category.slug}`} key={index}>
          <a style={{ border: '1px solid red'}} className="bg-light p-3 col-md-12">
            <div className="row">
              <div className="col-md-3">
                <img 
                  src={category.image?.url} 
                  alt={category.name} 
                  style={{ width: '100px', height: 'auto' }}
                  className="pr-4"
                />
              </div>
              <div className="col-md-6">
                <h5>{category.name}</h5>
              </div>
              <div className="col-md-3">
                <Link href={`/admin/category/${category.slug}`}>
                  <button className="btn btn-sm btn-outline-success btn-block mb-1">Update</button>
                </Link>
                <button 
                  onClick={(e) => confirmDelete(e, category.slug)} 
                  className="btn btn-sm btn-outline-danger btn-block"
                >
                  Delete
                </button>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </React.Fragment>
  );
};

export default ListCategoriesAdmin;