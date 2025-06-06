/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Button, List, message, Select } from "antd";
import { useDispatch } from "react-redux";
import { addSignatory } from "../../features/loans/signatorySlice";

const SignatoriesForm = ({ merchantId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [signatories, setSignatories] = useState([]);
  const [refType, setRefType] = useState("MERCHANT");

  const handleAdd = async (values) => {
    try {
      const payload = { ...values, merchantId };
      const result = dispatch(addSignatory(payload));

      if (addSignatory.fulfilled.match(result)) {
        setSignatories((prev) => [...prev, values]);
        message.success("Signatory added");
        form.resetFields();
      } else {
        message.error("Failed to add signatory");
      }
    } catch (err) {
      console.error(err);
      message.error("Unexpected error");
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="idNumber"
          label="National ID"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="designation"
          label="Designation"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="refId" label="RefID" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item name="refType" label="Ref Type">
          <Select onChange={setRefType}>
            <Option value="MERCHANT">MERCHANT</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Signatory
          </Button>
        </Form.Item>
      </Form>

      <List
        header="Added Signatories"
        bordered
        dataSource={signatories}
        renderItem={(item) => (
          <List.Item>{`${item.fullName} - ${item.email}`}</List.Item>
        )}
      />
    </>
  );
};

export default SignatoriesForm;
