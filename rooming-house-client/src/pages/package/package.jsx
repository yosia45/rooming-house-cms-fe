import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { Table, Space, Spin, Button, Layout } from "antd";
import Swal from "sweetalert2";
import urls from "../../constants/urls";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import ModalAddPackage from "./components/modalAdd";
import ModalPackageDetail from "./components/modalDetail";
import ModalEditPackage from "./components/modalEdit";

export default function PackagePage() {
  const [packages, setPackages] = useState([]);
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
          await axios.delete(`${BASE_URL}/packages/${record.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
          fetchPackagesData();
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
          packages.map((pricingPackage) => pricingPackage.rooming_house?.name)
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

  const data = packages.map((pricingPackage) => ({
    key: pricingPackage.id,
    id: pricingPackage.id,
    name: pricingPackage.name,
    roomingHouse: pricingPackage.rooming_house?.name || "N/A",
    Daily: pricingPackage.prices.day,
    Weekly: pricingPackage.prices.week,
    Monthly: pricingPackage.prices.month,
    Annually: pricingPackage.prices.year,
  }));

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleOnSuccess = () => {
    fetchPackagesData();
    handleCloseModal();
  };

  const fetchPackagesData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/packages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setPackages(response.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackagesData();
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
            <ModalPackageDetail
              isModalOpen={isViewModalOpen}
              handleCancel={handleCloseModal}
              data={selectedRecord}
            />
            <ModalAddPackage
              isModalOpen={isAddModalOpen}
              handleCancel={handleCloseModal}
              onSuccess={handleOnSuccess}
            />
            <ModalEditPackage
              isModalOpen={isEditModalOpen}
              handleCancel={handleCloseModal}
              data={selectedRecord}
              onSuccess={handleOnSuccess}
            />
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
}
