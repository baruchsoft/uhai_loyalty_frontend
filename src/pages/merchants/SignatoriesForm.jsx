/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Button, List, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addSignatory } from "../../features/loans/signatorySlice";
const { Option } = Select;

const SignatoriesForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [signatories, setSignatories] = useState([]);
  const [refType, setRefType] = useState("MERCHANT");
  const merchants = useSelector((state) => state?.merchant?.merchants);

  const handleAdd = async (values) => {
    try {
      const payload = { ...values };
      console.log("payloadsignatory", payload);

      const result = await dispatch(addSignatory(payload));
      console.log("result", result);

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

        <Form.Item
          name="nationality"
          label="Nationality"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item name="refId" label="RefID" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item> */}

        {/* <div className="w-full flex flex-col">
          <label htmlFor="customerId" className="text-sm font-semibold">
            Merchant
          </label>
          <Select
            placeholder="Select Merchant ."
            type="text"
            name="refId"
            id="refId"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              Array.isArray(merchants)
                ? merchants &&
                  merchants.map((customer) => ({
                    value: customer.id,
                    label: customer.merchantName,
                  }))
                : []
            }
            className="*:w-80 h-11 border-1.5 rounded-lg "
          />
        </div> */}

        <Form.Item
          name="refId"
          label="Merchant"
          rules={[{ required: true, message: "Please select a merchant" }]}
        >
          <Select
            placeholder="Select Merchant"
            showSearch
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className="*:w-80 h-11 border-1.5 rounded-lg"
          >
            {Array.isArray(merchants) &&
              merchants.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.merchantName}
                </Option>
              ))}
          </Select>
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
          <List.Item>{`${item.fullName} - ${item.nationality}`}</List.Item>
        )}
      />
    </>
  );
};

export default SignatoriesForm;
