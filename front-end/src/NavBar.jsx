import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./useUser";
export default function NavBar() {
  const { isLoading, user } = useUser();

  const navigate = useNavigate();
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
        {isLoading ? (
          <li>Loading ...</li>
        ) : (
          <>
            {user && (
              <li style={{ color: "white" }}>Logged in as {user.email}</li>
            )}
            <li>
              {user ? (
                <button onClick={() => signOut(getAuth())}>Sign Out</button>
              ) : (
                <button onClick={() => navigate("/login")}>Sign In</button>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
