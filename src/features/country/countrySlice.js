import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import countryService from "./countryService";
import toast from "react-hot-toast";

export const addACountry = createAsyncThunk(
  "country/add-country",
  async (countryData, thunkAPI) => {
    try {
      return await countryService.addCountry(countryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getACountry = createAsyncThunk(
  "country/get-a-country",
  async (countryCode, thunkAPI) => {
    try {
      return await countryService.getCountry(countryCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllCountries = createAsyncThunk(
  "country/get-all-countries",
  async (thunkAPI) => {
    try {
      return await countryService.getCountries();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateACountry = createAsyncThunk(
  "country/update-a-country",
  async ({ countryCode, countryData }, thunkAPI) => {
    try {
      return await countryService.updateCountry(countryCode, countryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteACountry = createAsyncThunk(
  "country/delete-a-country",
  async (countryCode, thunkAPI) => {
    try {
      return await countryService.deleteCountry(countryCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetCountryState = createAction("Reset_all");

const initialState = {
  countries: [],
  country: null,
  updatedCountry: null,
  addedCountry: null,
  deleteACountryResponse: null,
  error: { addACountry: false, getACountry: false, getAllCountries: false, updateACountry: false, deleteACountry: false,},
  loading: { addACountry: false, getACountry: false, getAllCountries: false, updateACountry: false,deleteACountry: false,},
  success: { addACountry: false, getACountry: false, getAllCountries: false, updateACountry: false, deleteACountry: false,},
  message: "",
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addACountry.pending, (state) => {
        state.loading.addACountry = true;
      })
      .addCase(addACountry.fulfilled, (state, action) => {
        state.loading.addACountry = false;
        state.success.addACountry = true;
        state.error.addACountry = false;
        state.addedCountry = action?.payload;
        toast.success("Country added successfully.");
      })
      .addCase(addACountry.rejected, (state, action) => {
        state.loading.addACountry = false;
        state.success.addACountry = false;
        state.error.addACountry = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(getACountry.pending, (state) => {
        state.loading.getACountry = true;
      })
      .addCase(getACountry.fulfilled, (state, action) => {
        state.loading.getACountry = false;
        state.success.getACountry = true;
        state.error.getACountry = false;
        state.country = action?.payload;
      })
      .addCase(getACountry.rejected, (state, action) => {
        state.loading.getACountry = false;
        state.success.getACountry = false;
        state.error.getACountry = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(getAllCountries.pending, (state) => {
        state.loading.getAllCountries = true;
      })
      .addCase(getAllCountries.fulfilled, (state, action) => {
        state.loading.getAllCountries = false;
        state.success.getAllCountries = true;
        state.error.getAllCountries = false;
        state.countries = action?.payload.content;
      })
      .addCase(getAllCountries.rejected, (state, action) => {
        state.loading.getAllCountries = false;
        state.success.getAllCountries = false;
        state.error.getAllCountries = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(updateACountry.pending, (state) => {
        state.loading.updateACountry = true;
      })
      .addCase(updateACountry.fulfilled, (state, action) => {
        state.loading.updateACountry = false;
        state.success.updateACountry = true;
        state.error.updateACountry = false;
        state.updatedCountry = action?.payload;
        toast.success("Country updated successfully.");
      })
      .addCase(updateACountry.rejected, (state, action) => {
        state.loading.updateACountry = false;
        state.success.updateACountry = false;
        state.error.updateACountry = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        }
      })
      .addCase(deleteACountry.pending, (state) => {
        state.loading.deleteACountry = true;
      })
      .addCase(deleteACountry.fulfilled, (state, action) => {
        state.loading.deleteACountry = false;
        state.success.deleteACountry = true;
        state.error.deleteACountry = false;
        state.deleteACountryResponse = action?.payload;
        toast.success("Country deleted successfully.");
      })
      .addCase(deleteACountry.rejected, (state, action) => {
        state.loading.deleteACountry = false;
        state.success.deleteACountry = false;
        state.error.deleteACountry = true;
        state.message = action?.payload?.response?.data?.message;
        if (action?.payload?.response?.data?.message) {
          toast.error(action?.payload?.response?.data?.message);
        } 
      })
      .addCase(resetCountryState, () => initialState);
  },
});

export default countrySlice.reducer;
