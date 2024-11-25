import React from "react";
import { Table } from "antd";
import { formatRupiah } from "../../../helpers/currency";

export default function TransactionTab(transactionData) {
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      width: "20%",
    },
    {
      title: "Name",
      dataIndex: "name",
      filters: transactionData?.map((transaction) => {
        return {
          text: transaction?.name,
          value: transaction?.name,
        };
      }),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.name === value;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
  ];

  const data = transactionData?.map((transaction) => {
    let convertDate = new Date(
      transaction?.year,
      transaction?.month,
      transaction?.day
    );

    return {
      key: transaction.id,
      id: transaction.id,
      name: transaction.name,
      amount: formatRupiah(transaction.amount),
      date: convertDate.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  });

  return (
    <div>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
}
