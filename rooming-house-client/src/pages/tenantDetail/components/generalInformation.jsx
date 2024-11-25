import React from "react";
import { Descriptions } from "antd";

export default function GeneralInformationTab(tenantData) {
  const items = [
    {
      label: "Name",
      span: "filled",
      children: tenantData.name,
    },
    {
      label: "Role",
      span: "filled",
      children: tenantData.is_tenant === true ? "Tenant" : "Tenant Assistant",
    },
    {
      label: "Gender",
      span: "filled",
      children: tenantData.gender === "P" ? "Laki-Laki" : "Perempuan",
    },
    {
      label: "Phone Number",
      span: "filled",
      children: tenantData.phoneNumber,
    },
    {
      label: "Emergency Contact",
      span: "filled",
      children: tenantData.emergencyContact,
    },
    {
      label: "Reserved Room",
      span: "filled",
      children: `Room ${tenantData.room?.name} - ${tenantData.rooming_house?.name}`,
    },
  ];

  return (
    <div>
      <Descriptions bordered title="Tenant Information" items={items} />
    </div>
  );
}
