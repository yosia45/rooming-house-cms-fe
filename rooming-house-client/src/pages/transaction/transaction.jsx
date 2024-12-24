import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import Swal from "sweetalert2";
import { Table, Space, Spin, Button, Layout, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import urls from "../../constants/urls";
import { formatRupiah } from "../../helpers/currency";
import { convertToDate } from "../../helpers/dateConverter";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import ModalAddTransaction from "./components/modalAdd";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const searchInput = useRef(null);
  const { BASE_URL } = urls;
  const token = getCookie("token");

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

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setTransactions(response.data);
      }
    } catch (err) {
      setError(err.response.data.message);
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Transaction Type",
      dataIndex: "type",
      filters: Array.from(
        new Set(transactions.map((transaction) => transaction.category?.name))
      ).map((name) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Transaction Category",
      dataIndex: "category",
      filters: [
        { text: "Expense", value: "Expense" },
        { text: "Income", value: "Income" },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Rooming House",
      dataIndex: "roomingHouse",
      filters: Array.from(
        new Set(
          transactions.map((transaction) => transaction.rooming_house?.name)
        )
      ).map((name) => ({
        text: name,
        value: name,
      })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.roomingHouse === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <i
            className="fa-solid fa-magnifying-glass"
            // onClick={() => {
            //   showModal("View", record);
            // }}
          ></i>
          {/* <i
                className="fa-solid fa-pencil"
                onClick={() => showModal("Edit", record)}
              ></i>
              <i
                className="fa-solid fa-trash"
                onClick={() => handleDelete(record)}
              ></i> */}
        </Space>
      ),
    },
  ];

  const data = transactions.map((transaction) => ({
    key: transaction.id,
    id: transaction.id,
    type: transaction.category?.name,
    category: transaction.category?.is_expense ? "Expense" : "Income",
    paymentDate: convertToDate(
      transaction.day,
      transaction.month,
      transaction.year
    ),
    amount: formatRupiah(transaction.amount),
    roomingHouse: transaction.rooming_house?.name || "N/A",
  }));

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleOnSuccess = () => {
    fetchTransactions();
    handleCloseModal();
  };

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
            <Table columns={columns} dataSource={data} onChange={onChange} />
            <ModalAddTransaction
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
