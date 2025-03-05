import React, { useState } from "react";
import { Table, Button, Input, Space } from "antd";

const TradeTable = ({ trades, onDelete, onEdit }) => {
    const [editingId, setEditingId] = useState(null);
    const [editedValues, setEditedValues] = useState({});

    const handleChange = (e, field, id) => {
        setEditedValues({
            ...editedValues,
            [field]: e.target.value,  // Ensure you assign the actual value, not an array
        });
    };
    
    
    const handleSave = (id) => {
        const tradeData = { ...editedValues };  // Copy the edited values
        onEdit(id, tradeData);  // Pass the correct data to the onEdit handler
        setEditingId(null);
    };
    

    const handleCancel = () => {
        setEditingId(null);
        setEditedValues({});
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Date", dataIndex: "date", key: "date" }, // Date is displayed, but won't be edited
        {
            title: "Trade Code", dataIndex: "trade_code", key: "trade_code",
            render: (_, record) =>
                editingId === record.id ? (
                    <Input value={editedValues.trade_code || record.trade_code} onChange={(e) => handleChange(e, "trade_code", record.id)} />
                ) : record.trade_code,
        },
        {
            title: "High", dataIndex: "high", key: "high",
            render: (_, record) =>
                editingId === record.id ? (
                    <Input value={editedValues.high || record.high} onChange={(e) => handleChange(e, "high", record.id)} />
                ) : record.high,
        },
        {
            title: "Low", dataIndex: "low", key: "low",
            render: (_, record) =>
                editingId === record.id ? (
                    <Input value={editedValues.low || record.low} onChange={(e) => handleChange(e, "low", record.id)} />
                ) : record.low,
        },
        {
            title: "Open", dataIndex: "open", key: "open",
            render: (_, record) =>
                editingId === record.id ? (
                    <Input value={editedValues.open || record.open} onChange={(e) => handleChange(e, "open", record.id)} />
                ) : record.open,
        },
        {
            title: "Close", dataIndex: "close", key: "close",
            render: (_, record) =>
                editingId === record.id ? (
                    <Input value={editedValues.close || record.close} onChange={(e) => handleChange(e, "close", record.id)} />
                ) : record.close,
        },
        {
            title: "Volume", dataIndex: "volume", key: "volume",
            render: (_, record) =>
                editingId === record.id ? (
                    <Input value={editedValues.volume || record.volume} onChange={(e) => handleChange(e, "volume", record.id)} />
                ) : record.volume,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    {editingId === record.id ? (
                        <>
                            <Button type="primary" onClick={() => handleSave(record.id)}>Save</Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditingId(record.id)}>Edit</Button>
                    )}
                    <Button danger onClick={() => onDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={trades} rowKey="id" className="table table-bordered mt-3" />;
};

export default TradeTable;
