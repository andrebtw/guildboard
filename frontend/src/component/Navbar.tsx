import { NavLink } from "react-router-dom";
import "./Navbar.css";

// NavLink ajoute tout seul aria-current="page" et sait si sa route est active
function getLinkClass({ isActive }: { isActive: boolean }): string {
  return `navbar-link ${isActive ? "navbar-link-active" : ""}`;
}

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navigation principale">
      <NavLink to="/quests" className={getLinkClass}>
        Quêtes
      </NavLink>
      <NavLink to="/adventurers" className={getLinkClass}>
        Aventuriers
      </NavLink>
    </nav>
  );
}

export default Navbar;
