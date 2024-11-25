import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { useParams } from "react-router-dom";
import { Layout, Spin, Tabs } from "antd";
import GeneralInformation from "./components/generalInformation";
import RoomPrice from "./components/roomPrice";
import TenantDetail from "./components/tenantDetail";
import urls from "../../constants/urls";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";

export default function RoomDetailPage() {
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { BASE_URL } = urls;

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "0",
      label: "General Information",
      children: GeneralInformation(roomDetail),
    },
    {
      key: "1",
      label: "Price",
      children: RoomPrice(roomDetail.pricing_package?.prices),
    },
    {
      key: "2",
      label: "Tenant",
      children:
        roomDetail.tenants == {} || roomDetail.tenants == null
          ? "No tenant"
          : TenantDetail(roomDetail.tenants),
    },
  ];

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const token = getCookie("token");
        const response = await axios.get(`${BASE_URL}/rooms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoomDetail(response.data);
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error", error, "error");

  return (
    <div>
      <Layout>
        <Navbar />
        <Layout>
          <Sidebar />
          <Layout.Content>
            <h1>Room Detail</h1>
            {roomDetail ? (
              <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
            ) : (
              <p>No room details available.</p>
            )}
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
}
