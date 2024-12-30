import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Modal, Select, Spin } from "antd";
import { getCookie, parseJwt } from "../../../helpers/cookies";
import axios from "axios";
import Swal from "sweetalert2";
import urls from "../../../constants/urls";

export default function ModalAddRoom({ isModalOpen, handleCandel, onSuccess }) {
    const [roomingHouses, setRoomingHouses] = useState([]);
    const [pricingPackages, setPricingPackages] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [sizes, setSizes] = useState([]);
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
    const { BASE_URL } = urls;
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
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPricingPackagesData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/packages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.data !== null) {
                setPricingPackages(response.data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchFacilitiesData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/facilities`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.data !== null) {
                setFacilities(response.data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchSizeData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/sizes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.data !== null) {
                setSizes(response.data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (values) => {
        try {
            const token = getCookie("token");
            await axios.post(`${BASE_URL}/rooms`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire("Success", "Room added successfully", "success");
            form.resetFields();
            onSuccess();
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchFacilitiesData();
        fetchPricingPackagesData();
        fetchSizeData();
        if (role === "owner") {
            fetchRoomingHousesData();
        }
    }, []);

    if (loading) return <Spin />;
    if (error) return Swal.fire("Error", error, "error");

    return (
        <div>
            <Modal open={isModalOpen} onCancel={handleCandel} footer={null}>
                <Form {...formItemLayout} form={form} name="add-room" onFinish={handleSubmit}>
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
                        label="Max Capacity"
                        name="max_capacity"
                        rules={[
                            {
                                required: true,
                                message: "Please input the max capacity!",
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Floor"
                        name="floor"
                        rules={[
                            {
                                required: true,
                                message: "Please input the floor!",
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
                    <Form.Item
                        label="Pricing Package"
                        name="package_id"
                        rules={[
                            {
                                required: true,
                                message: "Please select the pricing package",
                            },
                        ]}
                    >
                        <Select>
                            {pricingPackages.map((pricingPackage) => (
                                <Select.Option key={pricingPackage.id} value={pricingPackage.id}>
                                    {pricingPackage.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Size"
                        name="package_id"
                        rules={[
                            {
                                required: true,
                                message: "Please select the size",
                            },
                        ]}
                    >
                        <Select>
                            {sizes.map((size) => (
                                <Select.Option key={size.id} value={size.id}>
                                    {size.name}
                                </Select.Option>
                            ))}
                        </Select>
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
        </div>
    )
}