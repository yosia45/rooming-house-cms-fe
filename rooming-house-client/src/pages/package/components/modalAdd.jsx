import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Modal, Select, Spin } from "antd";
import { getCookie, parseJwt } from "../../../helpers/cookies";
import axios from "axios";
import Swal from "sweetalert2";
import urls from "../../../constants/urls";

export default function ModalAddPackage({
  isModalOpen,
  handleCancel,
  onSuccess,
}) {
  const [roomingHouses, setRoomingHouses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/packages`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        onSuccess();
        Swal.fire("Success", "Data has been added", "success");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (role === "owner") {
      fetchRoomingHousesData();
    }
  }, []);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error!", error, "error");

  return (
    <div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          {...formItemLayout}
          form={form}
          name="add-package"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Daily Price"
            name="daily_price"
            rules={[
              {
                required: true,
                message: "Please input the daily price!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Weekly Price"
            name="weekly_price"
            rules={[
              {
                required: true,
                message: "Please input the weekly price!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Monthly Price"
            name="monthly_price"
            rules={[
              {
                required: true,
                message: "Please input the monthly price!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Annual Price"
            name="annual_price"
            rules={[
              {
                required: true,
                message: "Please input the annual price!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          {role === "owner" ? (
            <Form.Item
              label="Rooming House"
              name="rooming_house_id"
              rules={[
                {
                  required: true,
                  message: "Please select the rooming house!",
                },
              ]}
            >
              <Select>
                {roomingHouses.map((roomingHouse) => (
                  <Select.Option key={roomingHouse.id} value={roomingHouse.id}>
                    {roomingHouse.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : null}
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
