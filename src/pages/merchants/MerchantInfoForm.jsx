/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { addMechant } from "../../features/loans/merhcantSlice";

const { Option } = Select;

const MerchantInfoForm = ({ mode, initialData }) => {
  const [merchantType, setMerchantType] = useState("Individual");
  const [refType, setRefType] = useState("MERCHANT");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (mode === "edit") payload.id = initialData.id;
      const resultAction = await dispatch(addMechant(payload));

      if (addMechant.fulfilled.match(resultAction)) {
        message.success(
          mode === "edit"
            ? "Merchant updated successfully"
            : "Merchant registered successfully"
        );
      } else {
        message.error("Merchant submission failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Unexpected error");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="merchantType"
        label="Merchant Type"
        rules={[{ required: true }]}
      >
        <Select onChange={setMerchantType}>
          <Option value="Individual">Individual</Option>
          <Option value="Organization">Organization</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="merchantName"
        label="Merchant Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="idNumber"
        label={
          merchantType === "Individual"
            ? "ID Number"
            : "Business Registration Number"
        }
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="mobileNumber"
        label="Mobile Number"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="emailAddress"
        label="Email Address"
        rules={[{ required: true, type: "email" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="dateOfRegistration" label="Date of Registration">
        <Input type="date" />
      </Form.Item>

      <Form.Item
        name="physicalAddress"
        label="Physical Address"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="accountMandate"
        label="Account Mandate"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="refereeMemberCode"
        label="Uhai Innovations Member Number"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {mode === "edit" ? "Update Merchant" : "Register Merchant"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MerchantInfoForm;
