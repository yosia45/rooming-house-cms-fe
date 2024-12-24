import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { Spin, Card, Layout } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { convertDate } from "../../helpers/dateConverter";
import urls from "../../constants/urls";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import uuidNIL from "../../constants/uuid";

export default function RoomPage() {
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const roomingHouseId = searchParams.get("rooming_house_id");
  const navigate = useNavigate();
  const { BASE_URL } = urls;

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const token = getCookie("token");
        const response = await axios.get(`${BASE_URL}/rooms`, {
          params: { rooming_house_id: roomingHouseId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoomData(response.data);
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  console.log(roomData);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error", error, "error");

  return (
    <div>
      <Layout>
        <Navbar />
        <Layout>
          <Sidebar />
          <Layout.Content>
            <h1>Room List</h1>
            {roomData?.map((room) => (
              <Card
                title={room.name}
                style={{
                  width: 300,
                }}
                onClick={() => navigate(`/rooms/${room.id}`)}
              >
                <p>
                  Status: {room.tenants.id === uuidNIL ? "Vacant" : "Occupied"}
                </p>
                <p>Tenant: {room.tenants?.name || "-"}</p>
                <p>
                  Start Date:{" "}
                  {room.tenants?.start_date
                    ? convertDate(room.tenants?.start_date) || "-"
                    : "-"}
                </p>
                <p>
                  End Date:{" "}
                  {room.tenants?.end_date
                    ? convertDate(room.tenants?.end_date) || "-"
                    : "-"}
                </p>
              </Card>
            ))}
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
}
