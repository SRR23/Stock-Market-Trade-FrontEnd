import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Select, Form } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../api";
import TradeForm from './../componenets/TradeForm';
import TradeChart from './../componenets/TradeChart';
import TradeTable from './../componenets/TradeTable';

const { Option } = Select;

const TradeDashboard = () => {
    const [trades, setTrades] = useState([]);
    const [filteredTrades, setFilteredTrades] = useState([]);
    const [selectedTradeCode, setSelectedTradeCode] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        axios.get(BASE_URL)
            .then(response => {
                setTrades(response.data);
                setFilteredTrades(response.data);
            })
            .catch(error => console.error("Error fetching trades:", error));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`${BASE_URL}${id}/`)
            .then(() => {
                setTrades(trades.filter(trade => trade.id !== id));
                setFilteredTrades(filteredTrades.filter(trade => trade.id !== id));
            })
            .catch(error => console.error("Error deleting trade:", error));
    };

    const handleTradeCodeChange = (value) => {
        setSelectedTradeCode(value);
        setFilteredTrades(value ? trades.filter(trade => trade.trade_code === value) : trades);
    };

    const handleAddTrade = (values) => {
        // Ensure the date is not being passed when adding a new trade
        const { date, ...tradeData } = values;  // Destructure to exclude `date`
        
        axios.post(BASE_URL, tradeData)
            .then(response => {
                setTrades([...trades, response.data]);
                setFilteredTrades([...filteredTrades, response.data]);
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(error => console.error("Error adding trade:", error));
    };

    const handleEditTrade = (id, updatedValues, isPartialUpdate = true) => {
        // Remove `date` since it's handled by the backend
        const { date, ...tradeData } = updatedValues;  
    
        // Log the data being sent to the API
        console.log("Sending data to API:", tradeData);
    
        // Decide whether to use PATCH (partial) or PUT (full update)
        const httpMethod = isPartialUpdate ? axios.patch : axios.put;
    
        httpMethod(`${BASE_URL}${id}/`, tradeData)
            .then(response => {
                console.log("Response from API:", response.data);  // Log API response
                const updatedTrades = trades.map(trade =>
                    trade.id === id ? { ...trade, ...response.data } : trade
                );
                setTrades(updatedTrades);
                setFilteredTrades(updatedTrades);
            })
            .catch(error => {
                console.error("Error updating trade:", error);
                if (error.response) {
                    console.error("Response Error: ", error.response);
                    console.error("Response Data: ", error.response.data);
                    console.error("Response Status: ", error.response.status);
                } else {
                    console.error("Error Message: ", error.message);
                }
            });
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
                {[...new Set(trades.map(trade => trade.trade_code))].map(code => (
                    <Option key={code} value={code}>{code}</Option>
                ))}
            </Select>

            <TradeChart data={filteredTrades} />
            <TradeTable trades={filteredTrades} onDelete={handleDelete} onEdit={handleEditTrade} />
        </div>
    );
};

export default TradeDashboard;
