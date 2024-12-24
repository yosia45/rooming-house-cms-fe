import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Modal, Select, Spin } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import urls from "../../../constants/urls";
import genders from "../../../constants/gender";
import roles from "../../../constants/role";
import { getCookie, parseJwt } from "../../../helpers/cookies";

export default function ModalAddTenant({
  isModalOpen,
  handleCancel,
  onSuccess,
}) {
  const [roomingHouses, setRoomingHouses] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [pics, setPics] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [isTenant, setIsTenant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { BASE_URL } = urls;
  const token = getCookie("token");
  const { role } = parseJwt(token);
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
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriods = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/periods`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setPeriods(response.data);
      }
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setRooms(response.data);
      }
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPICs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenants`, {
        params: { is_tenant: !isTenant },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setPics(response.data);
      }
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalServices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/additionals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data !== null) {
        setAdditionalServices(response.data);
      }
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tenants`,
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

  const handleRoleChange = (value) => {
    setIsTenant(value);
    // if (!isTenant) {
    //   fetchPICs();
    // } else {
    //   fetchRooms();
    //   fetchPeriods();
    //   fetchAdditionalServices();
    // }
  };

  useEffect(() => {
    if (role === "owner") {
      fetchRoomingHousesData();
    }
  }, []);

  useEffect(() => {
    if (!isTenant) {
      fetchPICs();
    } else if (isTenant === true) {
      fetchRooms();
      fetchPeriods();
      fetchAdditionalServices();
    }
  }, [isTenant]);

  useEffect(() => {
    if (!isModalOpen) {
      form.resetFields();
      setIsTenant(null);
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
          name="add-tenants"
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
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                message: "Please select the gender",
              },
            ]}
          >
            <Select>
              {genders.map((gender) => (
                <Select.Option key={gender.key} value={gender.value}>
                  {gender.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input the phone Number!",
              },
            ]}
          >
            <Input />
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
          <Form.Item
            label="Role"
            name="is_tenant"
            rules={[
              {
                required: true,
                message: "Please select the role",
              },
            ]}
          >
            <Select onChange={handleRoleChange}>
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.value}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {isTenant === true ? (
            <div>
              <Form.Item
                label="Emergency Contact"
                name="emergencyContact"
                rules={[
                  {
                    required: true,
                    message: "Please select the emergency contact",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Room"
                name="room_id"
                rules={[
                  {
                    required: true,
                    message: "Please select the room",
                  },
                ]}
              >
                <Select>
                  {rooms.map((room) => (
                    <Select.Option key={room.id} value={room.id}>
                      {room.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Payment Duration"
                name="regular_payment_duration"
                rules={[
                  {
                    required: true,
                    message: "Please select the payment duration",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="Period"
                name="period_id"
                rules={[
                  { required: true, message: "Please select the period" },
                ]}
              >
                <Select>
                  {periods.map((period) => (
                    <Select.Option key={period.id} value={period.id}>
                      {period.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Additional Services"
                name="tenant_additional_ids"
              >
                <Select mode="multiple">
                  {additionalServices.map((additionalService) => (
                    <Select.Option
                      key={additionalService.id}
                      value={additionalService.id}
                    >
                      {additionalService.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          ) : isTenant === false ? (
            <div>
              <Form.Item
                label="PIC"
                name="tenant_id"
                rules={[{ required: true }]}
              >
                <Select>
                  {pics.map((pic) => (
                    <Select.Option key={pic.id} value={pic.id}>
                      {pic.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
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
