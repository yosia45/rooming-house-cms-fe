import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Modal } from "antd";
import { getCookie } from "../../../helpers/cookies";
import axios from "axios";
import Swal from "sweetalert2";
import urls from "../../../constants/urls";

export default function ModalEditAdditionalPrice({
  isModalOpen,
  handleCancel,
  data,
  onSuccess,
}) {
  const [error, setError] = useState(null);

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

  const handleSubmit = async (values) => {
    try {
      const token = getCookie("token");
      await axios.put(
        `${BASE_URL}/additionals/${data.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Data updated successfully!",
      });
      onSuccess();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        daily_price: data.Daily,
        weekly_price: data.Weekly,
        monthly_price: data.Monthly,
        annual_price: data.Annually,
      });
    }
  }, [data, form]);

  if(error) return Swal.fire("Error!", error, "error");

  return (
    <div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          {...formItemLayout}
          form={form}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            variant: "filled",
          }}
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
            label="Daily"
            name="daily_price"
            rules={[
              {
                required: true,
                message: "Please input the daily price!",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="Weekly"
            name="weekly_price"
            rules={[
              {
                required: true,
                message: "Please input weekly price!",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="Monthly"
            name="monthly_price"
            rules={[
              {
                required: true,
                message: "Please input monthly price!",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            label="Annually"
            name="annual_price"
            rules={[
              {
                required: true,
                message: "Please input annual price!",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
