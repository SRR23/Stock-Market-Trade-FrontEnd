import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button, Select, Form, Pagination, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../api";
import TradeForm from "./../componenets/TradeForm";
import TradeChart from "./../componenets/TradeChart";
import TradeTable from "./../componenets/TradeTable";

const { Option } = Select;

const TradeDashboard = () => {
    const [trades, setTrades] = useState([]);
    const [tradeCodes, setTradeCodes] = useState([]);
    const [selectedTradeCode, setSelectedTradeCode] = useState("");
    const [refresh, setRefresh] = useState(false); // Added refresh state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Fetch trade codes (runs on mount & when refresh changes)
    useEffect(() => {
        axios.get(`${BASE_URL}trade-code/`)
            .then(({ data }) => {
                if (Array.isArray(data.trade_codes)) {
                    setTradeCodes(data.trade_codes);
                } else {
                    console.error("Unexpected trade_codes format:", data);
                    setTradeCodes([]);
                }
            })
            .catch((error) => console.error("Error fetching trade codes:", error));
    }, [refresh]); // Runs when refresh changes

    // Fetch paginated trade data
    const fetchTradeData = useCallback((tradeCode, page, pageSize) => {
        setLoading(true);
        const params = new URLSearchParams({ page, page_size: pageSize });
        if (tradeCode) params.append("trade_code", tradeCode);

        axios.get(`${BASE_URL}?${params}`)
            .then(({ data }) => {
                setTrades(data.results);
                setTotalPages(Math.ceil(data.count / pageSize));
            })
            .catch((error) => console.error("Error fetching trades:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchTradeData(selectedTradeCode, currentPage, pageSize);
    }, [selectedTradeCode, currentPage, pageSize, fetchTradeData]);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handleTradeCodeChange = (value) => {
        setSelectedTradeCode(value);
        setCurrentPage(1);
    };

    // Handle adding new trade
    const handleAddTrade = (values) => {
        axios.post(BASE_URL, values)
            .then(() => {
                setIsModalVisible(false);
                form.resetFields();
                setRefresh(prev => !prev); // Toggle refresh state to fetch new trade codes
                fetchTradeData(selectedTradeCode, currentPage, pageSize); // Refresh trades
            })
            .catch((error) => console.error("Error adding trade:", error));
    };

    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}${id}/`)
            .then(() => fetchTradeData(selectedTradeCode, currentPage, pageSize))
            .catch(error => console.error("Error deleting trade:", error));
    };

    const handleEditTrade = (id, updatedValues, isPartialUpdate = true) => {
        const httpMethod = isPartialUpdate ? axios.patch : axios.put;
        httpMethod(`${BASE_URL}${id}/`, updatedValues)
            .then(() => fetchTradeData(selectedTradeCode, currentPage, pageSize))
            .catch(error => console.error("Error updating trade:", error));
    };

    return (
        <div className="container mt-4">
            <h2>Trade Dashboard</h2>

            <Button className="btn btn-primary mb-3" onClick={() => setIsModalVisible(true)}>
                Add Trade
            </Button>

            <TradeForm open={isModalVisible} onCancel={() => setIsModalVisible(false)} onSubmit={handleAddTrade} form={form} />

            <Select
                placeholder="Select Trade Code"
                onChange={handleTradeCodeChange}
                className="form-select mb-3"
                value={selectedTradeCode}
            >
                <Option value="">All</Option>
                {tradeCodes.map((code) => (
                    <Option key={code} value={code}>{code}</Option>
                ))}
            </Select>

            <Spin spinning={loading} tip="Loading trades...">
                <TradeChart data={trades} />
                <TradeTable trades={trades} onDelete={handleDelete} onEdit={handleEditTrade} />
            </Spin>

            <Pagination
                current={currentPage}
                total={totalPages * pageSize}
                pageSize={pageSize}
                showSizeChanger
                onChange={handlePageChange}
                style={{ marginTop: "16px", textAlign: "center" }}
            />
        </div>
    );
};

export default TradeDashboard;
