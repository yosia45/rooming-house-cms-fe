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
    if (role === "owner"){
        fetchRoomingHousesData();
    }
  }, []);

  if (loading) return <Spin />;
  if (error) return Swal.fire("Error!", error, "error");

  return (
    <div>

    </div>
  )
}