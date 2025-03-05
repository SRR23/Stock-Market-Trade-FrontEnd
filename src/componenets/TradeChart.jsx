import React from "react";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, Line, Bar } from "recharts";

const TradeChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.sort((a, b) => new Date(a.date) - new Date(b.date))}>
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" />
                <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default TradeChart;