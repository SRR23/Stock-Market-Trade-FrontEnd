import React from "react";
import { Modal, Form, Input } from "antd";

const TradeForm = ({ open, onCancel, onSubmit, form }) => {  // Updated 'isVisible' to 'open'
    return (
        <Modal 
            title="Add Trade" 
            open={open}  // Fixed here
            onCancel={onCancel} 
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item name="trade_code" label="Trade Code" rules={[{ required: true }]}> 
                    <Input /> 
                </Form.Item>
                
                <Form.Item name="high" label="High" rules={[{ required: true }]}> 
                    <Input type="number" /> 
                </Form.Item>

                <Form.Item name="low" label="Low" rules={[{ required: true }]}> 
                    <Input type="number" /> 
                </Form.Item>

                <Form.Item name="open" label="Open" rules={[{ required: true }]}> 
                    <Input type="number" /> 
                </Form.Item>

                <Form.Item name="close" label="Close" rules={[{ required: true }]}> 
                    <Input type="number" /> 
                </Form.Item>

                <Form.Item name="volume" label="Volume" rules={[{ required: true }]}> 
                    <Input type="number" /> 
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TradeForm;
