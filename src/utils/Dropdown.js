import { Link } from "react-router-dom";

const Dropdown = ({ submenus, dropdown }) => {
  return (
    <ul className={`dropdown ${dropdown ? "show" : ""}`}>
      {submenus.map((submenu, index) => (
        <Link key={index} to={`/${submenu.url}`}>
          <li className="menu-items" key={index}>
            {submenu.title}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default Dropdown;
