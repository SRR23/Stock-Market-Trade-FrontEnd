import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button, Select, Form, Pagination, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../api";
import TradeForm from "../componenets/TradeForm";
import TradeChart from "../componenets/TradeChart";
import TradeTable from "../componenets/TradeTable";

const { Option } = Select;

const fetchTradeCodes = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}trade-code/`);
        return Array.isArray(data.trade_codes) ? data.trade_codes : [];
    } catch (error) {
        console.error("Error fetching trade codes:", error);
        return [];
    }
};

const fetchTrades = async ({ queryKey }) => {
    const [, tradeCode, page, pageSize] = queryKey;
    const params = new URLSearchParams({ page, page_size: pageSize });
    if (tradeCode) params.append("trade_code", tradeCode);
    const { data } = await axios.get(`${BASE_URL}?${params}`);
    return data;
};

const TradeDashboard = () => {
    const queryClient = useQueryClient();
    const [selectedTradeCode, setSelectedTradeCode] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [form] = Form.useForm();

    const { data: tradeCodes = [] } = useQuery({
        queryKey: ["tradeCodes"],
        queryFn: fetchTradeCodes,
    });

    const { data: tradesData, isLoading } = useQuery({
        queryKey: ["trades", selectedTradeCode, currentPage, pageSize],
        queryFn: fetchTrades,
        keepPreviousData: true,
        refetchOnWindowFocus: false, // Prevent unnecessary refetches on window focus
    });

    const addTradeMutation = useMutation({
        mutationFn: (values) => axios.post(BASE_URL, values),
        onSuccess: () => {
            queryClient.invalidateQueries(["trades"]);
            queryClient.invalidateQueries(["tradeCodes"]);
            setIsModalVisible(false);
            form.resetFields();
        },
    });

    const deleteTradeMutation = useMutation({
        mutationFn: (id) => axios.delete(`${BASE_URL}${id}/`),
        onSuccess: () => queryClient.invalidateQueries(["trades"]),
    });

    const editTradeMutation = useMutation({
        mutationFn: async ({ id, updatedValues, isPartialUpdate = true }) => {
            console.log("Sending request to update trade:", { id, updatedValues, isPartialUpdate });

            // Determine the HTTP method based on the isPartialUpdate flag
            const httpMethod = isPartialUpdate ? axios.patch : axios.put;
            return httpMethod(`${BASE_URL}${id}/`, updatedValues);
        },
        onMutate: async ({ id, updatedValues }) => {
            // Immediately cancel ongoing queries to prevent stale data
            await queryClient.cancelQueries(["trades"]);

            // Cache the current trades before mutation, for potential rollback
            const previousTrades = queryClient.getQueryData(["trades"]);

            // Optimistically update the trade locally
            queryClient.setQueryData(["trades"], (old) => {
                const updatedTrades = old?.results?.map((trade) => {
                    if (trade.id === id) {
                        return { ...trade, ...updatedValues }; // Merge updated values
                    }
                    return trade;
                });
                return { ...old, results: updatedTrades };
            });

            // Return the cached state for potential rollback
            return { previousTrades };
        },
        onError: (err, variables, context) => {
            // Rollback to previous data if an error occurs
            queryClient.setQueryData(["trades"], context.previousTrades);
            console.error("Error updating trade:", err);
        },
        onSettled: (data, error, variables, context) => {
            // Skip refetching if mutation was successful (optimistically updated)
            if (!error) {
                queryClient.setQueryData(["trades"], context.previousTrades);
            }
            // Refetch after mutation completion (success or failure)
            queryClient.invalidateQueries(["trades"]);
        },
        onSuccess: () => {
            console.log("Trade updated successfully.");
        },
    });

    return (
        <div className="container mt-4">
            <h2>Trade Dashboard</h2>

            <Button className="btn btn-primary mb-3" onClick={() => setIsModalVisible(true)}>
                Add Trade
            </Button>

            <TradeForm open={isModalVisible} onCancel={() => setIsModalVisible(false)} onSubmit={addTradeMutation.mutate} form={form} />

            <Select
                placeholder="Select Trade Code"
                onChange={(value) => {
                    setSelectedTradeCode(value);
                    setCurrentPage(1);
                }}
                className="form-select mb-3"
                value={selectedTradeCode}
            >
                <Option value="">All</Option>
                {tradeCodes.map((code) => (
                    <Option key={code} value={code}>{code}</Option>
                ))}
            </Select>

            <Spin spinning={isLoading} tip="Loading trades...">
                <TradeChart data={tradesData?.results || []} />
                <TradeTable
                    trades={tradesData?.results || []}
                    onDelete={deleteTradeMutation.mutate}
                    onEdit={(id, updatedValues, isPartialUpdate) =>
                        editTradeMutation.mutate({ id, updatedValues, isPartialUpdate })
                    }
                />
            </Spin>

            <Pagination
                current={currentPage}
                total={(tradesData?.count || 0)}
                pageSize={pageSize}
                showSizeChanger
                onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                }}
                style={{ marginTop: "16px", textAlign: "center" }}
            />
        </div>
    );
};

export default TradeDashboard;
