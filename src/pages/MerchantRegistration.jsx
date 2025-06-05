/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Button,
//   Tabs,
//   Upload,
//   Space,
//   message,
// } from "antd";
// import {
//   UploadOutlined,
//   MinusCircleOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { useDispatch } from "react-redux";
// import { addMechant } from "../features/loans/merhcantSlice";

// const { TabPane } = Tabs;
// const { Option } = Select;

// const MerchantRegistration = ({ mode = "create", initialData }) => {
//   const [merchantType, setMerchantType] = useState("Individual");
//   const [refType, setRefType] = useState("MERCHANT");
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (mode === "edit" && initialData) {
//       form.setFieldsValue(initialData);
//     }
//   }, [mode, initialData, form]);

//   const handleSubmit = async (values) => {
//     try {
//       const payload = { ...values };
//       console.log("payload", payload);

//       const resultAction = await dispatch(addMechant(payload));

//       if (mode === "edit") {
//         payload.id = initialData.id;
//         dispatch(addMechant(payload));
//         message.success("Merchant updated successfully!");
//       } else {
//         if (addMechant.fulfilled.match(payload)) {
//           message.success("Merchant registered successfully!");
//         } else {
//           message.error(resultAction.payload || "Registration failed.");
//         }
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       message.error("An unexpected error occurred.");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded shadow">
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         autoComplete="off"
//       >
//         <Tabs defaultActiveKey="1" type="card">
//           <TabPane tab="Merchant Info" key="1">
//             <Form.Item
//               name="merchantType"
//               label="Merchant Type"
//               rules={[{ required: true }]}
//             >
//               <Select onChange={setMerchantType}>
//                 <Option value="Individual">Individual</Option>
//                 <Option value="Organization">Organization</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="merchantName"
//               label="Merchant Name"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="idNumber"
//               label={
//                 merchantType === "Individual"
//                   ? "ID Number"
//                   : "Business Registration Number"
//               }
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="mobileNumber"
//               label="Mobile Number"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="emailAddress"
//               label="Email Address"
//               rules={[{ required: true, type: "email" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item name="dateOfRegistration" label="Date of Registration">
//               <Input type="date" />
//             </Form.Item>

//             <Form.Item
//               name="physicalAddress"
//               label="Physical Address"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="accountMandate"
//               label="Account Mandate"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="refereeMemberCode"
//               label="Uhai Innovations Member Number"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>
//           </TabPane>

//           <TabPane tab="Signatories" key="3">
//             <Form.List
//               name="signatories"
//               rules={[
//                 {
//                   validator: async (_, value) => {
//                     if (!value || value.length < 1) {
//                       return Promise.reject(
//                         new Error("At least one signatory is required.")
//                       );
//                     }
//                   },
//                 },
//               ]}
//             >
//               {(fields, { add, remove }) => (
//                 <>
//                   {fields.map(({ key, name, ...restField }) => (
//                     <div key={key} className="mb-6 p-4 border rounded">
//                       <div className="flex justify-between items-center mb-4">
//                         <h4 className="text-lg font-semibold">
//                           Signatory {name + 1}
//                         </h4>
//                         <Button
//                           type="link"
//                           danger
//                           icon={<MinusCircleOutlined />}
//                           onClick={() => remove(name)}
//                         >
//                           Remove
//                         </Button>
//                       </div>

//                       <Space direction="vertical" className="w-full">
//                         <Form.Item
//                           {...restField}
//                           name={[name, "fullName"]}
//                           label="Full Name"
//                           rules={[{ required: true }]}
//                         >
//                           <Input />
//                         </Form.Item>

//                         <Form.Item
//                           {...restField}
//                           name={[name, "idNumber"]}
//                           label="National ID"
//                           rules={[{ required: true }]}
//                         >
//                           <Input />
//                         </Form.Item>

//                         <Form.Item
//                           {...restField}
//                           name={[name, "designation"]}
//                           label="Designation"
//                           rules={[{ required: true }]}
//                         >
//                           <Input />
//                         </Form.Item>

//                         <Form.Item
//                           {...restField}
//                           name={[name, "refId"]}
//                           label="RefID"
//                           rules={[{ required: true }]}
//                         >
//                           <Input type="number" />
//                         </Form.Item>

//                         <Form.Item name="refType" label="Ref Type">
//                           <Select onChange={setRefType}>
//                             <Option value="MERCHANT">MERCHANT</Option>
//                           </Select>
//                         </Form.Item>
//                       </Space>
//                     </div>
//                   ))}

//                   <Form.Item>
//                     <Button
//                       type="dashed"
//                       onClick={() => add()}
//                       block
//                       icon={<PlusOutlined />}
//                     >
//                       Add Signatory
//                     </Button>
//                   </Form.Item>
//                 </>
//               )}
//             </Form.List>
//           </TabPane>

//           <TabPane tab="Attachments" key="4">
//             <Form.Item name="kraPin" label="KRA PIN">
//               <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
//                 <Button icon={<UploadOutlined />}>Upload KRA PIN (PDF)</Button>
//               </Upload>
//             </Form.Item>

//             <Form.Item
//               name="boardResolution"
//               label="Board Resolution / Minutes"
//             >
//               <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
//                 <Button icon={<UploadOutlined />}>
//                   Upload Board Resolution (PDF)
//                 </Button>
//               </Upload>
//             </Form.Item>

//             <Form.Item
//               name="certificate"
//               label="Certificate of Incorporation / Business Registration"
//             >
//               <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
//                 <Button icon={<UploadOutlined />}>
//                   Upload Certificate (PDF)
//                 </Button>
//               </Upload>
//             </Form.Item>

//             <Form.Item name="introRef" label="Introduction Reference">
//               <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
//                 <Button icon={<UploadOutlined />}>
//                   Upload Intro Reference (PDF)
//                 </Button>
//               </Upload>
//             </Form.Item>

//             <Form.Item name="bylaws" label="Constitution / Bylaws">
//               <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
//                 <Button icon={<UploadOutlined />}>
//                   Upload Constitution (PDF)
//                 </Button>
//               </Upload>
//             </Form.Item>

//             <Form.Item
//               name="scannedForm"
//               label="Completed Registration Form (Signed & Scanned)"
//             >
//               <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
//                 <Button icon={<UploadOutlined />}>
//                   Upload Scanned Form (PDF)
//                 </Button>
//               </Upload>
//             </Form.Item>
//           </TabPane>
//         </Tabs>

//         <div className="mt-6 text-right">
//           <Button type="primary" htmlType="submit">
//             {mode === "edit" ? "Update Merchant" : "Register Merchant"}
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default MerchantRegistration;

import React from "react";
import { Tabs, message } from "antd";
import MerchantInfoForm from "./merchants/MerchantInfoForm";
import SignatoriesForm from "./merchants/SignatoriesForm";

const { TabPane } = Tabs;

const MerchantRegistration = ({ mode = "create", initialData }) => {
  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Merchant Info" key="1">
          <MerchantInfoForm mode={mode} initialData={initialData} />
        </TabPane>

        <TabPane tab="Signatories" key="3">
          <SignatoriesForm merchantId={initialData?.id} />
        </TabPane>
        {/* <TabPane tab="Attachments" key="4">
          <AttachmentsForm merchantId={initialData?.id} />
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default MerchantRegistration;
