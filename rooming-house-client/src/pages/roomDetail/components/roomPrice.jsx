import React from "react";
import { Descriptions } from "antd";
import { formatRupiah } from "../../../helpers/currency";

export default function RoomPrice(roomData) {
  const items = [
    {
      label: "Daily",
      span: "filled",
      children: formatRupiah(roomData?.Daily) || "Not Available",
    },
    {
      label: "Weekly",
      span: "filled",
      children: formatRupiah(roomData?.Weekly) || "Not Available",
    },
    {
      label: "Monthly",
      span: "filled",
      // span = 3
      children: formatRupiah(roomData?.Monthly) || "Not Available",
    },
    {
      label: "Annually",
      span: 'filled',
      children: formatRupiah(roomData?.Annually) || "Not Available",
    },
  ];

  return (
    <div>
      <Descriptions bordered title="Price Information" items={items} />
    </div>
  );
}
