import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spin, Tabs } from "antd";
import urls from "../../constants/urls";
import { getCookie } from "../../helpers/cookies";
import Swal from "sweetalert2";
import GeneralInformationTab from "./components/generalInformation";
import TransactionTab from "./components/transaction";
import PaymentTab from "./components/payment";

export default function TenantDetailPage() {
  const { id } = useParams();
  const [tenantDetail, setTenantDetail] = useState({});
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
      children: GeneralInformationTab(tenantDetail),
    },
    {
      key: "2",
      label: "Payment",
      children: PaymentTab(tenantDetail),
    },
    {
      key: "3",
      label: "Transaction History",
      children: TransactionTab(tenantDetail.transactions),
    },
  ];

  if (tenantDetail.tenant_assists !== null) {
    items.push({
      key: "1",
      label: "Assist",
      // children: "No assist",
    });
  }

  useEffect(() => {
    const fetchTenantDetail = async () => {
      try {
        const token = getCookie("token");
        const response = await axios.get(`${BASE_URL}/tenants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenantDetail(response.data);
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantDetail();
  }, [id]);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error", error, "error");

  return (
    <div>
      <h1>Tenant Detail</h1>
      {tenantDetail ? (
        <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
      ) : (
        <p>No tenant details available.</p>
      )}
    </div>
  );
}
