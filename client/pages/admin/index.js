import Link from 'next/link';

import withAdmin from '../withAdmin';

const AdminPage = ({ user }) => {
  return (
    <div>
      <h1 className="mb-3">Admin Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="admin/category/create">
                <a className="nav-link">Create Category</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="admin/category/read">
                <a className="nav-link">View Categories</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="admin/link/read">
                <a className="nav-link">View All Links</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link">Update Profile</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">

        </div>
      </div>
    </div>
  )
};

export default withAdmin(AdminPage);