import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select, Spin } from "antd";
import { getCookie } from "../../../helpers/cookies";
import axios from "axios";
import Swal from "sweetalert2";

export default function ModalAddAdmin({
  isModalOpen,
  handleCancel,
  onSuccess,
}) {
  const [roomingHouses, setRoomingHouses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchRoomingHousesData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/roominghouses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setRoomingHouses(response.data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = getCookie("token");
      await axios.post(`http://localhost:8080/registeradmin`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("Success", "Data added successfully", "success");
      form.resetFields();
      onSuccess();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchRoomingHousesData();
  }, []);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error", error, "error");

  return (
    <div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          {...formItemLayout}
          form={form}
          name="add-size"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[
              {
                required: true,
                message: "Please input the full name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input the username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
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
