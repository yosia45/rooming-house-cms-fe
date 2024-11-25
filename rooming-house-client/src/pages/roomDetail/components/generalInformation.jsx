import React from "react";
import { Descriptions } from "antd";

export default function GeneralInformation(roomData) {
  const items = [
    {
      label: "Name",
      span: "filled",
      children: roomData.name,
    },
    {
      label: "Floor",
      span: "filled",
      children: roomData.floor,
    },
    {
      label: "Max Capacity",
      span: "filled",
      // span = 3
      children: `${roomData.max_capacity} person`,
    },
    {
      label: "Size",
      span: 1,
      children: roomData.size?.name || "N/A",
    },
    {
      label: "Length",
      span: 1,
      children: `${roomData.size?.long} m` || "N/A",
    },
    {
      label: "Width",
      span: 1,
      children: `${roomData.size?.width} m` || "N/A",
    },
    {
      label: "Facilities",
      span: "filled",
      children:
        roomData.facilities?.map((facility) => facility.name).join(", ") ||
        "N/A",
    },
  ];

  return (
    <div>
      <Descriptions bordered title="Room Information" items={items} />
    </div>
  );
}
