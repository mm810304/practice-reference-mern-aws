import React from 'react';
import Link from 'next/link';

const ListCategories = ({ categories }) => {
  return (
    <React.Fragment>
      {categories.map((category, index) => (
        <Link href={`/links/${category.slug}`} key={index}>
          <a style={{ border: '1px solid red'}} className="bg-light p-3 col-md-4">
            <div className="row">
              <div className="col-md-4">
                <img 
                  src={category.image?.url} 
                  alt={category.name} 
                  style={{ width: '100px', height: 'auto' }}
                  className="pr-4"
                />
              </div>
              <div className="col-md-8">
                <h4>{category.name}</h4>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </React.Fragment>
  );
};

export default ListCategories;