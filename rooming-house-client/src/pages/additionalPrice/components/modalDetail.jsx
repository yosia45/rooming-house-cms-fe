import React from "react";
import { Descriptions, Modal } from "antd";
import { formatRupiah } from "../../../helpers/currency";

export default function ModalDetail({ isModalOpen, handleCancel, data }) {
  const items = [
    {
      label: "Daily",
      span: "filled",
      children: formatRupiah(data?.Daily),
    },
    {
      label: "Weekly",
      span: "filled",
      children: formatRupiah(data?.Weekly),
    },
    {
      label: "Monthly",
      span: "filled",
      children: formatRupiah(data?.Monthly),
    },
    {
      label: "Annually",
      span: "filled",
      children: formatRupiah(data?.Annually),
    },
  ];

  return (
    <div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        onClose={handleCancel}
        onOk={handleCancel}
        key={data?.id}
      >
        <Descriptions bordered title="Price Information" items={items} />
      </Modal>
    </div>
  );
}
