import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { Table, Space, Spin, Button, Layout } from "antd";
import Swal from "sweetalert2";
import ModalAddAdmin from "./components/modalAdd";
import urls from "../../constants/urls";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { BASE_URL } = urls;

  const showModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
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
          const token = getCookie("token");
          await axios.delete(`${BASE_URL}/admins/${record.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("Deleted!", "Admin has been deleted.", "success");
          fetchAdminsData();
        } catch (error) {
          setError(error.response.data.message);
        }
      }
    });
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Username",
      dataIndex: "userName",
    },
    {
      title: "Rooming House",
      dataIndex: "roomingHouse",
      filters: admins.map((admin) => {
        return {
          text: admin.rooming_house?.name,
          value: admin.rooming_house?.name,
        };
      }),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.roomingHouse === value;
      },
      width: "30%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <i
            className="fa-solid fa-trash"
            onClick={() => handleDelete(record)}
          ></i>
        </Space>
      ),
    },
  ];

  const data = admins.map((admin) => ({
    key: admin.id,
    id: admin.id,
    fullName: admin.full_name,
    userName: admin.username,
    roomingHouse: admin.rooming_house?.name,
  }));

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleOnSuccess = () => {
    fetchAdminsData();
  };

  const fetchAdminsData = async () => {
    try {
      const token = getCookie("token");
      const response = await axios.get(`${BASE_URL}/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(response.data);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminsData();
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
            <Button type="primary" onClick={showModal}>
              Add New
            </Button>
            <Table columns={columns} dataSource={data} onChange={onChange} />;
            <ModalAddAdmin
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
