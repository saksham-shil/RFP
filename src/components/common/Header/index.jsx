import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('name')
  const logout = () => {
    localStorage.clear();
    navigate('/login')
  }
  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div></div>

        <div className="d-flex pr-2">
          <div className="dropdown d-inline-block">
            <span className="d-none d-xl-inline-block ml-1">Welcome {name}</span>&nbsp;&nbsp;
            <button className="btn btn-danger" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;