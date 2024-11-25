import React, { useState, useEffect } from "react";
import { Menu, Spin, Layout } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import urls from "../../constants/urls";
import { getCookie } from "../../helpers/cookies";
import Swal from "sweetalert2";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [roomingHouses, setRoomingHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      label: "Transactions",
      onClick: () => navigate("/transactions"),
    },
    {
      key: "sub1",
      label: "Rooming Houses",
      children: roomingHouses.map((roomingHouse) => ({
        key: roomingHouse.id,
        label: roomingHouse.name,
        // onClick: () => navigate(`/rooms?rooming_house_id=${roomingHouse.id}`),
      })),
    },
    {
      key: "sub2",
      label: "Rooms",
      children: roomingHouses.map((roomingHouse) => ({
        key: roomingHouse.id,
        label: roomingHouse.name,
        onClick: () => navigate(`/rooms?rooming_house_id=${roomingHouse.id}`),
      })),
    },
    {
      key: "sub3",
      label: "Master",
      children: [
        {
          key: "9",
          label: "Admins",
          onClick: () => navigate("/admins"),
        },
        {
          key: "10",
          label: "Additional Services",
          onClick: () => navigate("/additionals"),
        },
        {
          key: "11",
          label: "Facilities",
          onClick: () => navigate("/facilities"),
        },
        {
          key: "12",
          label: "Sizes",
          onClick: () => navigate("/sizes"),
        },
        {
          key: "13",
          label: "Packages",
          onClick: () => navigate("/packages"),
        },
        {
          key: "14",
          label: "Tenants",
          onClick: () => navigate("/tenants"),
        },
      ],
    },
  ];

  const fetchRoomingHouse = async () => {
    try {
      const { BASE_URL } = urls;
      const response = await axios.get(`${BASE_URL}/roominghouses`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setRoomingHouses(response.data);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomingHouse();
  }, []);

  if (error) return Swal.fire("Error", error, "error");
  if (loading) return <Spin />;

  return (
    <div>
      <Layout.Sider>
        <Menu
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={items}
        />
      </Layout.Sider>
    </div>
  );
}
