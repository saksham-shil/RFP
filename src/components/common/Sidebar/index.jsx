import { Link } from 'react-router-dom'; 

const Sidebar = () => {
  return (
    <div className="vertical-menu">
      <div className="navbar-brand-box">
        <Link to="/dashboard" className="logo logo-light">
          <span className="logo-sm">
            <img src="assets/images/velocity_logo.png" alt="" height="40" />
          </span>
          <span className="logo-lg">
            <img src="assets/images/velocity_logo.png" alt="" />
          </span>
        </Link>
      </div>
      
      <div data-simplebar className="h-100">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to="/admin" className="waves-effect">
                <i className="mdi mdi-file-document-box-outline"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/vendors" className="waves-effect">
                <i className="mdi mdi-receipt"></i>
                <span>Vendors</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/rfp-lists" className="waves-effect">
                <i className="mdi mdi-flip-vertical"></i>
                <span>RFP Lists</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/rfp-quotes" className="waves-effect">
                <i className="mdi mdi-apps"></i>
                <span>RFP Quotes</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="waves-effect">
                <i className="mdi mdi-weather-night"></i>
                <span>Categories</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;