import React from "react";
import { Collapse } from "antd";
import TenantCollapseDescription from "./tenantCollapse";

export default function TenantDetail(roomData) {
  const tenantDataCarrousel = [
    {
      key: "0",
      label: roomData?.name,
      children: TenantCollapseDescription(roomData),
    },
  ];

  if (roomData.tenants?.tenant_assists.length > 0) {
    for (let i = 0; i < roomData.length; i++) {
      tenantDataCarrousel.push({
        key: i + 1,
        label: roomData.tenants.tenant_assists[i].name,
        children: TenantCollapseDescription(roomData.tenants.tenant_assists[i]),
      });
    }
  }

  return (
    <div>
      <Collapse
        bordered
        title="Tenant Information"
        items={tenantDataCarrousel}
      />
    </div>
  );
}
