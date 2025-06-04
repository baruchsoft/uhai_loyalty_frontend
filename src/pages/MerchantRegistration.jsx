import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Steps,
  Upload,
  Space,
  message,
} from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { addMechant } from "../features/loans/merhcantSlice";
import { useDispatch } from "react-redux";

const { Step } = Steps;
const { Option } = Select;

const MerchantRegistration = ({ mode = "create", initialData }) => {
  const [current, setCurrent] = useState(0);
  const [merchantType, setMerchantType] = React.useState("Individual");
  const [refType, setRefType] = React.useState("MERCHANT");

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const next = () => {
    form
      .validateFields()
      .then(() => setCurrent(current + 1))
      .catch((err) => console.log(err));
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.setFieldsValue(initialData);
    }
  }, [mode, initialData, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values };

      console.log("payload", payload);

      const resultAction = await dispatch(addMechant(values));
      console.log(resultAction, "resultAction");

      if (mode === "edit") {
        payload.id = initialData.id;
        dispatch(addMechant(payload));
        message.success("Merchant updated successfully!");
      } else {
        if (addMechant.fulfilled.match(payload)) {
          message.success("Merchant registered successfully!");
          // form.resetFields();
          // setCurrent(0);
        } else {
          message.error(resultAction.payload || "Registration failed.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error("An unexpected error occurred.");
    }
  };

  const steps = [
    {
      title: "Merchant Info",
      content: (
        <>
          <Form.Item
            name="merchantType"
            label="Merchant Type"
            rules={[{ required: true, message: "Please select merchant type" }]}
          >
            <Select
              placeholder="Select merchant type"
              onChange={(value) => setMerchantType(value)}
            >
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
            <Input type="tel" />
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
        </>
      ),
    },
    {
      title: "Referee Info",
      content: (
        <>
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
        </>
      ),
    },
    {
      title: "Signatories",
      content: (
        <Form.List
          name="signatories"
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length < 1) {
                  return Promise.reject(
                    new Error("At least one signatory is required.")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="mb-6 p-4 border rounded">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">
                      Signatory {name + 1}
                    </h4>
                    <Button
                      type="link"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Space direction="vertical" className="w-full">
                    <Form.Item
                      {...restField}
                      name={[name, "fullName"]}
                      label="Full Name"
                      rules={[
                        { required: true, message: "Full name required" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "idNumber"]}
                      label="National ID"
                      rules={[
                        { required: true, message: "National ID required" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "designation"]}
                      label="Designation"
                      rules={[
                        { required: true, message: "Designation required" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "refId"]}
                      label="RefID"
                      rules={[{ required: true, message: "RefID required" }]}
                    >
                      <Input type="number" />
                    </Form.Item>

                    <Form.Item
                      name="refType"
                      label="Ref Type"
                      rules={[
                        {
                          required: false,
                          message: "Please select refType",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select refType"
                        onChange={(value) => setRefType(value)}
                      >
                        <Option value="MERCHANT">MERCHANT</Option>
                      </Select>
                    </Form.Item>
                    {/* 
                    <Form.Item
                      name={[name, "signature"]}
                      label="Signature (Image or PDF)"
                      valuePropName="fileList"
                      getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                      }
                    >
                      <Upload
                        beforeUpload={() => false}
                        accept="image/*,.pdf"
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>
                          Upload Signature
                        </Button>
                      </Upload>
                    </Form.Item> */}

                    {/* <Form.Item
                      name={[name, "photo"]}
                      label="Passport Photograph"
                      valuePropName="fileList"
                      getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                      }
                    >
                      <Upload
                        beforeUpload={() => false}
                        accept="image/*"
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                      </Upload>
                    </Form.Item>

                    <Form.Item
                      name={[name, "scannedId"]}
                      label="Scanned ID or Passport"
                      valuePropName="fileList"
                      getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                      }
                    >
                      <Upload
                        beforeUpload={() => false}
                        accept="image/*,.pdf"
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>
                          Upload Scanned ID
                        </Button>
                      </Upload>
                    </Form.Item> */}
                  </Space>
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Signatory
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      ),
    },
    {
      title: "Attachments",
      content: (
        <>
          <Form.Item
            name="kraPin"
            label="KRA PIN"
            rules={[{ required: false }]}
          >
            <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
              <Button icon={<UploadOutlined />}>Upload KRA PIN (PDF)</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="boardResolution" label="Board Resolution / Minutes">
            <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
              <Button icon={<UploadOutlined />}>
                Upload Board Resolution (PDF)
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="certificate"
            label="Certificate of Incorporation / Business Registration"
          >
            <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
              <Button icon={<UploadOutlined />}>
                Upload Certificate (PDF)
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item name="introRef" label="Introduction Reference">
            <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
              <Button icon={<UploadOutlined />}>
                Upload Intro Reference (PDF)
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item name="bylaws" label="Constitution / Bylaws">
            <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
              <Button icon={<UploadOutlined />}>
                Upload Constitution (PDF)
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="scannedForm"
            label="Completed Registration Form (Signed & Scanned)"
          >
            <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
              <Button icon={<UploadOutlined />}>
                Upload Scanned Form (PDF)
              </Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <Steps current={current} className="mb-6">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* {steps[current].content} */}
        {steps.map((step, index) => (
          <div
            key={index}
            style={{ display: index === current ? "block" : "none" }}
          >
            {step.content}
          </div>
        ))}

        <div className="mt-6 flex justify-between">
          {current > 0 && (
            <Button onClick={prev} style={{ marginRight: 8 }}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default MerchantRegistration;
