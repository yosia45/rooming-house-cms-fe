import React from "react";
import { Descriptions } from "antd";
import { convertDate } from "../../../helpers/dateConverter";

export default function TenantCollapseDescription(tenantData) {
  const items = [
    {
      label: "Name",
      span: "filled",
      children: tenantData.name,
    },
    {
      label: "Role",
      span: "filled",
      children: tenantData.is_tenant ? "Tenant" : "Tenant Assistant",
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
  ];

  if (tenantData.is_tenant) {
    items.push(
      {
        label: "Emergency Contact",
        span: "filled",
        children: tenantData.emergencyContact,
      },
      {
        label: "Start Date",
        span: 2,
        children: convertDate(tenantData.start_date),
      },
      {
        label: "End Date",
        span: 2,
        children: convertDate(tenantData.end_date),
      },
    );
  }

  return (
    <div>
      <Descriptions bordered title="Tenant Information" items={items} />
    </div>
  );
}
