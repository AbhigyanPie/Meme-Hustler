import { Link, useLocation } from 'react-router-dom';
import homeIcon from '../images/home.png';
import addIcon from '../images/add.png';
import '../css/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const isOnFormPage = location.pathname === '/submit';

  return (
    <div className="sidebar">
      <Link to={isOnFormPage ? '/' : '/submit'} className="sidebar-button">
        <img
          src={isOnFormPage ? homeIcon : addIcon}
          alt={isOnFormPage ? 'Home' : 'Add'}
          className="sidebar-icon"
        />
      </Link>
    </div>
  );
};

export default Sidebar;