import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  Select,
  Spin,
  Radio,
} from "antd";
import { getCookie, parseJwt } from "../../../helpers/cookies";
import axios from "axios";
import Swal from "sweetalert2";
import urls from "../../../constants/urls";

export default function ModalAddTransaction({
  isModalOpen,
  handleCancel,
  onSuccess,
}) {
  const [roomingHouses, setRoomingHouses] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionTypeName, setTransactionTypeName] = useState("");
  const [selectedRoomingHouseID, setSelectedRoomingHouseID] = useState("");
  const [selectedAllocation, setSelectedAllocation] = useState(null);

  const { BASE_URL } = urls;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 14,
      },
    },
  };

  const token = getCookie("token");

  const { role } = parseJwt(token);

  const fetchRoomingHousesData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/roominghouses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setRoomingHouses(response.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionCategoriesData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transaction-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setTransactionCategories(response.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenants`, {
        params: { is_tenant: true },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setTenants(response.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/rooms`, {
        params: { rooming_house_id: selectedRoomingHouseID },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setRooms(response.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await axios.post(
        `${BASE_URL}/transactions`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Success", "Data has been added", "success");
      onSuccess();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionType = (value) => {
    const selectedCategory = transactionCategories.find(
      (transactionCategory) => transactionCategory.id === value
    );

    if (selectedCategory) {
      const { name } = selectedCategory;
      setTransactionTypeName(name);

      if (name === "Rent" || name === "Deposit" || name === "Deposit Payback") {
        fetchTenantData();
      }

      if (role === "owner") {
        fetchRoomingHousesData();
      }
    }
  };

  const handleRoomingHouseSelectChange = (value) => {
    setSelectedRoomingHouseID(value);
  };

  const handleAllocationChange = (value) => {
    setSelectedAllocation(value);
  };

  useEffect(() => {
    fetchTransactionCategoriesData();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      form.resetFields();
      setSelectedRoomingHouseID("");
      setTransactionTypeName("");
    }
  }, [isModalOpen, form]);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error!", error, "error");

  return (
    <div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          {...formItemLayout}
          form={form}
          name="add-transaction-form"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Transaction Type"
            name="transaction_category_id"
            rules={[
              {
                required: true,
                message: "Please select the transaction type!",
              },
            ]}
          >
            <Select
              placeholder="Select Transaction Type"
              onChange={handleTransactionType}
            >
              {transactionCategories.map((transactionCategory) => {
                return (
                  <Select.Option
                    key={transactionCategory.id}
                    value={transactionCategory.id}
                  >
                    {transactionCategory.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Day"
            name="day"
            rules={[{ required: true, message: "Please select the day!" }]}
          >
            <Select placeholder="Select Day">
              {Array.from({ length: 31 }, (_, i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  {i + 1}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Month"
            name="month"
            rules={[{ required: true, message: "Please select the month!" }]}
          >
            <Select placeholder="Select Month">
              {Array.from({ length: 12 }, (_, i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  {i + 1}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: "Please select the year!" }]}
          >
            <Select placeholder="Select Year">
              {Array.from(
                { length: new Date().getFullYear() - 2024 + 1 },
                (_, i) => 2024 + i
              ).map((year) => (
                <Select.Option key={year} value={year}>
                  {year}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {transactionTypeName !== "" && transactionTypeName !== "Rent" && (
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please input the amount!" }]}
            >
              <InputNumber />
            </Form.Item>
          )}
          {role === "owner" && transactionTypeName !== "" && (
            <Form.Item
              label="Rooming House"
              name="rooming_house_id"
              rules={[
                { required: true, message: "Please select the rooming house!" },
              ]}
            >
              <Select
                placeholder="Select Rooming House"
                onChange={handleRoomingHouseSelectChange}
              >
                {roomingHouses.map((roomingHouse) => {
                  return (
                    <Select.Option
                      key={roomingHouse.id}
                      value={roomingHouse.id}
                    >
                      {roomingHouse.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
          {(transactionTypeName === "Rent" ||
            transactionTypeName === "Deposit" ||
            transactionTypeName === "Deposit Payback") &&
            selectedRoomingHouseID && (
              <Form.Item
                label="Tenant"
                name="tenant_id"
                rules={[
                  { required: true, message: "Please select the tenant!" },
                ]}
              >
                <Select placeholder="Select Tenant">
                  {tenants
                    .filter(
                      (tenant) =>
                        tenant.rooming_house.id === selectedRoomingHouseID
                    )
                    .map((tenant) => (
                      <Select.Option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          {transactionTypeName !== "Rent" &&
            transactionTypeName !== "Deposit" &&
            transactionTypeName !== "Deposit Payback" &&
            transactionTypeName !== "" && (
              <Form.Item label="Description" name="description">
                <Input.TextArea />
              </Form.Item>
            )}
          {transactionTypeName !== "Rent" &&
            transactionTypeName !== "Deposit" &&
            transactionTypeName !== "Deposit Payback" &&
            transactionTypeName !== "Salary" &&
            transactionTypeName !== "" && (
              <Form.Item label="Allocation" name="is_room">
                <Radio.Group onChange={handleAllocationChange}>
                  <Radio value={false}> Rooming House </Radio>
                  <Radio value={true}> Room </Radio>
                </Radio.Group>
              </Form.Item>
            )}
          <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
