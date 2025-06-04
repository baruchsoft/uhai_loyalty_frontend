import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Input, Modal, Select, Spin } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { addARole, deleteARole, getAllRoles,getARole,resetRoleState,updateARole,} from "../features/role/roleSlice";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const columns = [
  {title: "#", dataIndex: "key",},
  {title: "Name", dataIndex: "roleName", },
  {title: "Short Description", dataIndex: "roleShortDesc",},
  {title: "Description", dataIndex: "roleDescription",},
  {title: "Status",dataIndex: "roleStatus",},
  {title: "Action",dataIndex: "action",},
];

const ROLE_SCHEMA = Yup.object().shape({
  roleName: Yup.string().required("Please provide role name."),
  roleShortDesc: Yup.string().required("Please provide role short description."),
  roleDescription: Yup.string().required("Please provide role description."),
  roleStatus: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Please select a valid role status.").required("Please select role status."),
});

const Roles = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoleCode, setSelectedRoleCode] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const roles = useSelector((state) => state?.role?.roles);
  const getAllRolesLoading = useSelector((state) => state?.role?.loading?.getAllRoles);
  const addARoleSuccess = useSelector((state) => state?.role?.success?.addARole);
  const addedRole = useSelector((state) => state?.role?.addedRole);
  const addARoleLoading = useSelector((state) => state?.role?.loading?.addARole);
  const updatedRole = useSelector((state) => state?.role?.updatedRole);
  const updateARoleSuccess = useSelector( (state) => state?.role?.success?.updateARole );
  const updateARoleLoading = useSelector( (state) => state?.role?.loading?.updateARole );
  const deleteARoleSuccess = useSelector((state) => state?.role?.success?.deleteARole );
  const deleteRoleLoading = useSelector( (state) => state?.role?.loading?.deleteARole);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    formik.resetForm();
  }, []);

  const showDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const showEditModal = async (role) => {
    setEditingRole(role);
    setIsEditModalOpen(true);
    await dispatch(getARole(role?.roleCode));
  };

  const formik = useFormik({
    initialValues: {
      roleName: editingRole?.roleName || "",
      roleShortDesc: editingRole?.roleShortDesc || "",
      roleDescription: editingRole?.roleDescription || "",
      roleStatus: editingRole?.roleStatus || "INACTIVE",
    },
    enableReinitialize: true,
    validationSchema: ROLE_SCHEMA,
    onSubmit: (values) => {
      if (editingRole) {
        dispatch(
          updateARole({roleCode: editingRole?.roleCode,roleData: values,})
        );
      } else {
        dispatch(addARole(values));
      }
    },
  });

  useEffect(() => {
    dispatch(getAllRoles());
  }, [dispatch]);

  useEffect(() => {
    if (addedRole && addARoleSuccess) {
      formik.resetForm();
      setIsModalOpen(false);
      dispatch(resetRoleState());
      dispatch(getAllRoles());
    }
  }, [addedRole, addARoleSuccess, dispatch]);

  useEffect(() => {
    if (updatedRole && updateARoleSuccess) {
      formik.resetForm();
      setIsEditModalOpen(false);
      dispatch(resetRoleState());
      dispatch(getAllRoles());
      setEditingRole(null);
    }
  }, [updatedRole, updateARoleSuccess, dispatch]);

  const dataSource =
    roles && Array.isArray(roles)
      ? roles.map((role, index) => ({
          key: index + 1,
          roleName: role?.roleName,
          roleShortDesc: role?.roleShortDesc,
          roleDescription: role?.roleDescription,
          roleStatus: role?.roleStatus,
          action: (
            <>
              <div className="flex flex-row items-center gap-8 ">
                <button type="button" onClick={() => showEditModal(role)}>
                  <MdOutlineEdit className="text-blue-600 font-medium text-xl" />
                </button>
                <button type="button" onClick={() => { setSelectedRoleCode(role?.roleCode); showDeleteModal();}}>
                  <RiDeleteBinLine className="text-red-600  font-medium  text-xl" />
                </button>
              </div>
            </>
          ),
        }))
      : [];

  const deleteRole = async () => {
    if (selectedRoleCode) {
      await dispatch(deleteARole(selectedRoleCode));
    }
  };

  useEffect(() => {
    if (deleteARoleSuccess) {
      setIsDeleteModalOpen(false);
      setSelectedRoleCode(null);
      dispatch(resetRoleState());
      dispatch(getAllRoles());
    }
  }, [deleteARoleSuccess, dispatch]);

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Roles</h2>
          <Button type="primary" htmlType="button" onClick={showModal}className="text-sm font-semibold px-6 h-10 text-white font-sans "> + New Role</Button>
      </div>

      <div className="mb-4">
        <Input  style={{ width:"400px", height:"40px"}} placeholder="Search..." />
      </div>

      <Modal
        title={
          <div>
            <h2 className="text-xl font-semibold">
              {editingRole ? "Edit role" : "Add a new role"}
            </h2>
          </div>
        }
        open={isModalOpen || isEditModalOpen}
        footer={null}
        onCancel={() => {
          handleCancel();
          setIsEditModalOpen(false);
          setEditingRole(null);
        }}
        width={400}
        className="font-sans"
      >
        <form className="pb-4 font-sans" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center flex-col gap-3  mt-4">
              <div className="flex justify-start lg:gap-8">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="roleName" className="text-sm font-semibold">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="roleName"
                      name="roleName"
                      placeholder="e.g. Shop Manager"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "roleName",
                          e.target.value
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.roleName}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.roleName && formik.errors.roleName
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.roleName && formik.errors.roleName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="roleShortDesc"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>
                    <Input
                      placeholder="e.g. Shop Manager"
                      type="text"
                      name="roleShortDesc"
                      id="roleShortDesc"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "roleShortDesc",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.roleShortDesc}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.roleShortDesc &&
                        formik.errors.roleShortDesc
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.roleShortDesc &&
                          formik.errors.roleShortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="roleDescription"
                      className="text-sm font-semibold"
                    >
                      Description
                    </label>
                    <Input
                      placeholder="e.g. Managing point of sale."
                      type="text"
                      name="roleDescription"
                      id="roleDescription"
                      onBlur={(e) => {
                        formik.setFieldValue(
                          "roleDescription",
                          e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1).toLowerCase()
                        );
                        formik.handleBlur(e);
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.roleDescription}
                      className={`w-80 h-11 border-1.5 ${
                        formik.touched.roleDescription &&
                        formik.errors.roleDescription
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.roleDescription &&
                          formik.errors.roleDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="roleStatus"
                      className="text-sm font-semibold"
                    >
                      Status
                    </label>
                    <Select
                      placeholder="Select Role Status"
                      type="text"
                      name="roleStatus"
                      id="roleStatus"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        {
                          value: "ACTIVE",
                          label: "ACTIVE",
                        },
                        {
                          value: "INACTIVE",
                          label: "INACTIVE",
                        },
                      ]}
                      onBlur={formik.handleBlur}
                      onChange={(value) =>
                        formik.setFieldValue("roleStatus", value)
                      }
                      value={formik.values.roleStatus}
                      className={`w-80  h-11 border-1.5 rounded-lg ${
                        formik.touched.roleStatus && formik.errors.roleStatus
                          ? "border-red-600"
                          : ""
                      }`}
                    />
                    <div>
                      <p className="text-xs text-red-600">
                        {formik.touched.roleStatus && formik.errors.roleStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between  mt-4 ">
                    <Button onClick={() => { handleCancel(); setIsEditModalOpen(false); setEditingRole(null); }}  className="w-28 text-sm font-semibold h-10 font-sans"> Cancel </Button>
                    <Button loading={ addARoleLoading || updateARoleLoading}  type="primary" htmlType="submit" disabled={addARoleLoading || updateARoleLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans" >
                      {editingRole ? "Update" : "Submit"}
                    </Button>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

          <div style={{ overflowX: "auto", width: "100%" }}>
            <Table loading={getAllRolesLoading} columns={columns} dataSource={dataSource} scroll={{ x: "max-content" }}/>
          </div>

      {/* delete role modal */}
      <Modal title="Confirm role deletion?" open={isDeleteModalOpen} footer={null} onCancel={handleDeleteModalCancel}>
       <div><p className="text-sm">Are you sure you want to delete this role? </p></div>
        <div className="flex items-center justify-end  mt-6  gap-8">
            <Button htmlType="button" onClick={handleDeleteModalCancel}  className="w-28 text-sm font-semibold h-10 font-sans"> Cancel </Button>
            <Button loading={deleteRoleLoading} onClick={deleteRole} type="primary" htmlType="button" disabled={deleteRoleLoading} className="w-28 text-sm font-semibold h-10 text-white font-sans"> Delete </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Roles;
