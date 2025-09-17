import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/articles"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Articles
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
