import Dropdown from "../utils/Dropdown";
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";


const MenuItems = ({ items }) => {

    const [dropdown, setDropdown] = useState(false);
    let ref = useRef();

    useEffect(() => {
        const handler = (event) => {
         if (dropdown && ref.current && !ref.current.contains(event.target)) {
          setDropdown(false);
         }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
         // Cleanup the event listener
         document.removeEventListener("mousedown", handler);
         document.removeEventListener("touchstart", handler);
        };
       }, [dropdown]);
       
 return (
  <li className="menu-items" ref={ref}>
   {items.submenu ? (
    <>
     <button aria-expanded={dropdown ? "true" : "false"}
      onClick={() => setDropdown((prev) => !prev)} type="button" aria-haspopup="menu">
      {items.title}{" "}
     </button>
     <Dropdown dropdown={dropdown} submenus={items.submenu} />
    </>
   ) : (
            <Link to={`/${items.title}`}>
        <li key={items.title}>{items.title}</li>
    </Link>
   )}
  </li>
 );
};

export default MenuItems;