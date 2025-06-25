import { createAsyncThunk } from "@reduxjs/toolkit";
import { newRequest } from "../../utils/newRequest";

const addGroupRepayment = createAsyncThunk(
  "groupRepayment/addGroupRepayment",
  async (repaymentData, { rejectWithValue }) => {
    try {
      const response = await newRequest.post(
        "group-repayments-to-merchant/create-or-update",
        repaymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getGroupRepayments = createAsyncThunk(
  "groupRepayment/getGroupRepayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await newRequest.get("");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const groupRepaymentService = {
  addGroupRepayment,
  // updateGroupLoan,
  getGroupRepayments,
};

export default groupRepaymentService;
