import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../helpers/cookies";
import { Table, Space, Spin, Button, Layout } from "antd";
import Swal from "sweetalert2";
import urls from "../../constants/urls";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";

export default function RooomingHousePage() {
    const [roomingHouses, setRoomingHouses] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const { BASE_URL } = urls;
    const token = getCookie("token");

    const showModal = (action, record) => {
        setSelectedRecord(record);
        if (action === "Edit") {
            setIsEditModalOpen(true);
        } else if (action === "Add") {
            setIsAddModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setIsAddModalOpen(false);
        setSelectedRecord(null);
    };

    const handleDelete = async (record) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = getCookie("token");
                    await axios.delete(`${BASE_URL}/roominghouses/${record.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    Swal.fire("Deleted!", "Rooming House has been deleted.", "success");
                    fetchRoomingHousesData();
                } catch (error) {
                    setError(error.response.data.message);
                }
            }
        });
    };

    const fetchRoomingHousesData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/roominghouses`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data !== null) {
                setRoomingHouses(response.data)
            }
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRoomingHousesData()
    }, [])

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
                    </Layout.Content>
                </Layout>
            </Layout>
        </div>
    )
}