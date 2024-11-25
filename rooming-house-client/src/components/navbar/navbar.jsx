import React from "react";
import { Layout, Menu } from "antd";
import "./navbar.css";
import { removeCookie } from "../../helpers/cookies";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { Header } = Layout;
  const navigate = useNavigate();

  const navbarMenu = [
    {
      key: "1",
      label: "Logout"
    }
  ]

  const logoutHandler = () => {
    removeCookie("token");
    navigate("/login");
  }

  return (
    <div>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          items={navbarMenu}
          className="navbar-menu"
          onClick={logoutHandler}
        />
      </Header>
    </div>
  );
}
