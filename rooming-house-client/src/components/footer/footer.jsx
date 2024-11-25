import React from "react";
import { Layout } from "antd";

export default function Footer() {
  const { Footer } = Layout;

  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#4096ff",
  };

  return (
    <div>
      <Footer style={footerStyle}>Footer</Footer>
    </div>
  );
}
