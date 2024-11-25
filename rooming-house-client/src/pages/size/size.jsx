import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { Table, Space, Spin, Button, Layout } from "antd";
import Swal from "sweetalert2";
import ModalAddSize from "./components/modalAdd";
import ModalEditSize from "./components/modalEdit";
import urls from "../../constants/urls";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";

export default function SizePage() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { BASE_URL } = urls;

  const showModal = (action, record) => {
    setSelectedRecord(record);
    if (action === "Edit") {
      setIsEditModalOpen(true);
    } else if (action === "Add") {
      setIsAddModalOpen(true);
    }
  };

  const handleCloseModal = () => {
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
          const token = getCookie("token");
          await axios.delete(`${BASE_URL}/sizes/${record.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("Deleted!", "Size has been deleted.", "success");
          fetchSizesData();
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
      title: "Length (m)",
      dataIndex: "long",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Width (m)",
      dataIndex: "width",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Rooming House",
      dataIndex: "roomingHouse",
      filters: sizes.map((size) => {
        return {
          text: size.rooming_house?.name,
          value: size.rooming_house?.name,
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
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

  const data = sizes.map((size) => ({
    key: size.id,
    id: size.id,
    name: size.name,
    long: size.long,
    width: size.width,
    roomingHouse: size.rooming_house?.name,
  }));

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleOnSuccess = () => {
    fetchSizesData();
    handleCloseModal();
  };

  const fetchSizesData = async () => {
    try {
      const token = getCookie("token");
      const response = await axios.get(`${BASE_URL}/sizes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setSizes(response.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizesData();
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
            <ModalAddSize
              isModalOpen={isAddModalOpen}
              handleCancel={handleCloseModal}
              onSuccess={handleOnSuccess}
            />
            <ModalEditSize
              isModalOpen={isEditModalOpen}
              handleCancel={handleCloseModal}
              onSuccess={handleOnSuccess}
              data={selectedRecord}
            />
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
}
