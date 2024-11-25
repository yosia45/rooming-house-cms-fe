import React from "react";
import { Descriptions } from "antd";
import { convertDate } from "../../../helpers/dateConverter";

export default function PaymentTab(paymentData) {
    const items = [
        {
            label: "Regular Payment Duration",
            span: 2,
            children: paymentData.regular_payment_duration,
        },
        {
            label: "Period",
            span: 1,
            children: paymentData.period?.name
        },
        {
            label: "End Date",
            span: "filled",
            children: convertDate(paymentData.end_date),
        },
        {
            label: "Deposit Paid",
            span: 2,
            children: paymentData?.is_deposit_paid === true ? "Yes" : "No",
        },
        {
            label: "Deposit Back",
            span: 1,
            children: paymentData?.is_deposit_back === true ? "Yes" : "No",
        },
        {
            label: "Additional Service",
            span: "filled",
            children: paymentData.additional_prices?.map((service) => service.name).join(", ") || "-",
        }
    ]

    return (
        <div>
            <Descriptions bordered title="Payment Information" items={items} />
        </div>
    )
}
