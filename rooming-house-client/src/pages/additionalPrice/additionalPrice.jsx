import React, { useEffect, useState } from "react";
import { Table, Space, Spin, Button, Layout } from "antd";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import ModalDetailAdditionalPrice from "./components/modalDetail";
import ModalEditAdditionalPrice from "./components/modalEdit";
import ModalAddAdditionalPrice from "./components/modalAdd";
import Swal from "sweetalert2";
import urls from "../../constants/urls";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

export default function AdditionalPricePage() {
  const [additionalPrices, setAdditionalPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { BASE_URL } = urls;
  const token = getCookie("token");

  const showModal = (action, record) => {
    setSelectedRecord(record);
    if (action === "View") {
      setIsViewModalOpen(true);
    } else if (action === "Edit") {
      setIsEditModalOpen(true);
    } else if (action === "Add") {
      setIsAddModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDelete = async (record) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/additionals/${record.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
          fetchAdditionalPricesData();
        } catch (error) {
          setError(error.response.data.message);
        }
      }
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Rooming House",
      dataIndex: "roomingHouse",
      filters: Array.from(
        new Set(
          additionalPrices.map((additionalPrice) => additionalPrice.rooming_house?.name)
        )
      ).map((name) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.roomingHouse === value;
      },
      width: "30%",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={() => {
              showModal("View", record);
            }}
          ></i>
          <i
            className="fa-solid fa-pencil"
            onClick={() => showModal("Edit", record)}
          ></i>
          <i
            className="fa-solid fa-trash"
            onClick={() => handleDelete(record)}
          ></i>
        </Space>
      ),
    },
  ];

  const data = additionalPrices.map((additionalPrice) => ({
    key: additionalPrice.id,
    id: additionalPrice.id,
    name: additionalPrice.name,
    roomingHouse: additionalPrice.rooming_house?.name,
    Daily: additionalPrice.prices.Daily,
    Weekly: additionalPrice.prices.Weekly,
    Monthly: additionalPrice.prices.Monthly,
    Annually: additionalPrice.prices.Annually,
  }));

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleOnSuccess = () => {
    fetchAdditionalPricesData();
    handleCloseModal();
  };

  const fetchAdditionalPricesData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/additionals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setAdditionalPrices(response.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdditionalPricesData();
  }, []);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error", error, "error");

  return (
    <div>
      <Layout>
        <Navbar />
        <Layout>
          <Sidebar />
          <Layout.Content>
            <Button type="primary" onClick={() => showModal("Add")}>
              Add New
            </Button>
            <Table columns={columns} dataSource={data} onChange={onChange} />;
            <ModalDetailAdditionalPrice
              isModalOpen={isViewModalOpen}
              handleCancel={handleCloseModal}
              data={selectedRecord}
            />
            <ModalEditAdditionalPrice
              isModalOpen={isEditModalOpen}
              handleCancel={handleCloseModal}
              data={selectedRecord}
              onSuccess={handleOnSuccess}
            />
            <ModalAddAdditionalPrice
              isModalOpen={isAddModalOpen}
              handleCancel={handleCloseModal}
              onSuccess={handleOnSuccess}
            />
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
}
