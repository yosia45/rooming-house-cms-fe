import React from "react";
import { Descriptions } from "antd";
import uuidNIL from "../../../constants/uuid";

export default function GeneralInformationTab(tenantData, type) {
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
  ];

  if (tenantData.is_tenant === true) {
    items.push(
      {
        label: "Emergency Contact",
        span: "filled",
        children: tenantData.emergencyContact,
      },
      {
        label: "Reserved Room",
        span: "filled",
        //check first if the room is uuid.nil or not
        children: `${
          tenantData.room?.id !== uuidNIL
            ? `Room ${tenantData.room?.name} - ${tenantData.rooming_house?.name}` ||
              "No Room"
            : "No Room"
        }`,
      }
    );
  }

  return (
    <div>
      {tenantData.is_tenant === true && type === "assistant" ? (
        tenantData.tenant_assists?.map((assist) => {
          return (
            <Descriptions bordered>
              <Descriptions.Item label="Name" span="filled">
                {assist.name}
              </Descriptions.Item>
              <Descriptions.Item label="Role" span="filled">
                {assist.is_tenant === true ? "Tenant" : "Tenant Assistant"}
              </Descriptions.Item>
              <Descriptions.Item label="Gender" span="filled">
                {assist.gender === "P" ? "Perempuan" : "Laki-laki"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number" span="filled">
                {assist.phoneNumber}
              </Descriptions.Item>
            </Descriptions>
          );
        }) || null
      ) : (
        <Descriptions bordered items={items}></Descriptions>
      )}
    </div>
  );
}
