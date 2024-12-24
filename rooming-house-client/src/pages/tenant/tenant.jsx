import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { Spin, Layout, Button, Table, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import urls from "../../constants/urls";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import ModalAddTenant from "./components/modalAdd";

export default function TenantPage() {
  const [searchParams] = useSearchParams();
  const roomingHouseId = searchParams.get("rooming_house_id");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const searchInput = useRef(null);

  const navigate = useNavigate();
  const { BASE_URL } = urls;

  const showModal = (action, record) => {
    setSelectedRecord(record);
    if (action === "Add") {
      setIsAddModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedRecord(null);
  };

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenants`, {
        params: { rooming_house_id: roomingHouseId },
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      });
      setTenants(response.data);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleOnSuccess = () => {
    fetchTenants();
    handleCloseModal();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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
          await axios.delete(`${BASE_URL}/tenants/${record.id}`, {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          });
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
          fetchTenants();
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
      ...getColumnSearchProps("name"),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        { text: "Perempuan", value: "Perempuan" },
        { text: "Laki-laki", value: "Laki-laki" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: [
        { text: "Tenant", value: "Tenant" },
        { text: "Tenant'Assist", value: "Tenant'Assist" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={() => {
              navigate(`/tenants/${record.id}`);
            }}
          ></i>
          <i
            className="fa-solid fa-pencil"
            // onClick={() => showModal("Edit", record)}
          ></i>
          <i
            className="fa-solid fa-trash"
            onClick={() => handleDelete(record)}
          ></i>
        </Space>
      ),
    },
  ];

  const data = tenants.map((tenant) => ({
    key: tenant.id,
    id: tenant.id,
    name: tenant.name,
    gender: tenant.gender === "P" ? "Perempuan" : "Laki-laki",
    role: tenant.is_tenant ? "Tenant" : "Tenant'Assist",
  }));

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  useEffect(() => {
    fetchTenants();
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
              Add Tenant
            </Button>
            <Table columns={columns} dataSource={data} onChange={onChange} />
            <ModalAddTenant
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
