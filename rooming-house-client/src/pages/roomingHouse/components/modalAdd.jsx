import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Modal, Select, Spin } from "antd";
import { getCookie } from "../../../helpers/cookies";
import axios from "axios";
import Swal from "sweetalert2";
import urls from "../../../constants/urls";

export default function ModalAddRoomingHouse({
    isModalOpen,
    handleCancel,
    onSuccess,
}) {
    const [facilities, setFacilities] = useState([]);
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

    const { BASE_URL } = urls;

    const fetchFacilitiesData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/facilities`, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            if (response.data !== null) {
                setFacilities(response.data);
            }
        } catch (err) {
            setError(err.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (values) => {
        try {
            await axios.post(`${BASE_URL}/roominghouses`, values, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            });
            Swal.fire("Success", "Rooming house added successfully", "success");
            form.resetFields();
            onSuccess()
        } catch (err) {
            setError(err);
        }
    }

    useEffect(() => {
        fetchFacilitiesData();
    }, [])

    if (loading) return <Spin />
    if (error) return Swal.fire("Error", error.message, "error");

    return (
        <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Form {...formItemLayout}
                form={form}
                name="add-rooming-house" onFinish={handleSubmit}>
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
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: "Please input the description!",
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: "Please input the address!",
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Total Floor"
                    name="floor_total"
                    rules={[
                        {
                            required: true,
                            message: "Please input the floor total!",
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Facilities"
                    name="room_facilities"
                    rules={[
                        {
                            required: true,
                            message: "Please select the facilities",
                        },
                    ]}
                >
                    <Select mode="multiple">
                        {facilities.map((facility) => (
                            <Select.Option key={facility.id} value={facility.id}>
                                {facility.name}
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
    )
}