import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import { setUserCookies } from "../../helpers/cookies";
import { useNavigate } from "react-router-dom";
import urls from "../../constants/urls";

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { BASE_URL } = urls;

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, values);

      setUserCookies({ token: response.data.token });

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang!",
        confirmButtonText: "Lanjutkan",
      });

      navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      form.resetFields();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (error) return Swal.fire("Error", error, "error");
  return (
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
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
          label="Role"
          name="role"
          rules={[
            {
              required: true,
              message: "Please select your role!",
            },
          ]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="owner">Owner</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
