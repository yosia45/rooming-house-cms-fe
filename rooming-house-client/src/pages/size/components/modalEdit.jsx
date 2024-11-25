import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Modal } from "antd";
import { getCookie } from "../../../helpers/cookies";
import axios from "axios";
import Swal from "sweetalert2";
import urls from "../../../constants/urls";

export default function ModalEditSize({
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
      await axios.put(`${BASE_URL}/sizes/${data.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Data updated successfully!",
      });
      onSuccess();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      form.resetFields();
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        width: data.width,
        long: data.long,
      });
    }
  }, [data, form]);

  if(error) return Swal.fire("Error!", error, "error");

  return (
    <div>
      <Modal
        title="Edit Size"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="editSize"
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
            label="Width (m)"
            name="width"
            rules={[
              {
                required: true,
                message: "Please input the width!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Length (m)"
            name="long"
            rules={[
              {
                required: true,
                message: "Please input the length!",
              },
            ]}
          >
            <InputNumber min={0} />
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
