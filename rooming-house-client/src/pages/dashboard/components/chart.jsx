import React, { useState, useEffect } from "react";
import axios from "axios";
import { AreaChart } from "@mantine/charts";
import urls from "../../../constants/urls";
import { getCookie } from "../../../helpers/cookies";
import Swal from "sweetalert2";
import { Select, Spin } from "antd";

export default function Demo() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");
  const [roomingHouseID, setRoomingHouseID] = useState("");
  const [transactions, setTransactions] = useState(null);

  const { BASE_URL } = urls;
  const token = getCookie("token");

  
  const fetchChartData = async () => {
    try {
      let dashboardUrl = `${BASE_URL}/transactions/dashboard`;
      if (year) {
        dashboardUrl += `?year=${year}`;
      }
      if (roomingHouseID) {
        dashboardUrl += `&roomingHouseID=${roomingHouseID}`;
      }
      const response = await axios.get(dashboardUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setTransactions(response.data[0]);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  let keys = [];
  let series = [];

  if (transactions !== null) {
    const transactionData = transactions.transactionData;
    keys = Object.keys(transactionData[0]).filter((key) => {
      return key !== "month" && key !== "year" && key !== "index";
    });

    const colors = ["violet.6", "orange.6"];
    series = keys.map((key, index) => ({
      name: key,
      color: colors[index % colors.length],
    }));
  }

  useEffect(() => {
    fetchChartData();
  }, [year, roomingHouseID]);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error", error, "error");

  return (
    <div>
      <h1>Barchart</h1>

      <AreaChart
        h={300}
        w={1200}
        data={transactions.transactionData}
        dataKey="month"
        series={series}
      />
    </div>
  );
}
