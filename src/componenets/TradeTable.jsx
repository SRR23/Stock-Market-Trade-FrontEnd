import React, { useState } from "react";
import { Table, Button, Input, Space } from "antd";

const TradeTable = ({ trades, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleChange = (e, field) => {
    setEditedValues({ ...editedValues, [field]: e.target.value });
  };

  const handleSave = (id) => {
    onEdit(id, editedValues);
    setEditingId(null);
    setEditedValues({});
  };

  const editableFields = [
    "trade_code",
    "high",
    "low",
    "open",
    "close",
    "volume",
  ];

  const renderEditableCell = (field, record) =>
    editingId === record.id ? (
      <Input
        value={editedValues[field] ?? record[field]}
        onChange={(e) => handleChange(e, field)}
      />
    ) : (
      record[field]
    );

  const columns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "Date", dataIndex: "date", key: "date" },
    ...editableFields.map((field) => ({
      title: field.charAt(0).toUpperCase() + field.slice(1),
      dataIndex: field,
      key: field,
      render: (_, record) => renderEditableCell(field, record),
    })),
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {editingId === record.id ? (
            <>
              <Button type="primary" onClick={() => handleSave(record.id)}>
                Save
              </Button>
              <Button onClick={() => setEditingId(null)}>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setEditingId(record.id)}>Edit</Button>
          )}
          <Button danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={trades}
      rowKey="id"
      pagination={false} // Disables the built-in pagination
      className="table table-bordered mt-3"
    />
  );
};

export default TradeTable;
