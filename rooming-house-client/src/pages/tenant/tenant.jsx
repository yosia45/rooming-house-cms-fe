import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { Spin, Card } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import urls from "../../constants/urls";

export default function TenantPage() {
  const [searchParams] = useSearchParams();
  const roomingHouseId = searchParams.get("rooming_house_id");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { BASE_URL } = urls;

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = getCookie("token");
        const response = await axios.get(`${BASE_URL}/tenants`, {
          params: { rooming_house_id: roomingHouseId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenants(response.data);
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error", error, "error");

  return (
    <div>
      <h1>Tenant List</h1>
      {tenants.map((tenant) => (
        <Card
          title={tenant.name}
          style={{
            width: 300,
          }}
          onClick={() => navigate(`/tenants/${tenant.id}`)}
        >
          <p>Room: {tenant.room?.name || "-"}</p>
          <p>Start Date: {tenant.start_date || "-"}</p>
          <p>End Date: {tenant.end_date || "-"}</p>
        </Card>
      ))}
    </div>
  );
}
