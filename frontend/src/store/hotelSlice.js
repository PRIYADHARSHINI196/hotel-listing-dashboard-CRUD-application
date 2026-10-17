import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const API = 'http://localhost:5000';
export const imgUrl = (p) => (p ? `${API}${p}` : '');

export const fetchHotels = createAsyncThunk('hotels/fetch', async(params) => {
    const { data } = await axios.get(`${API}/api/hotels`, { params });
    return data;
});

export const deleteHotel = createAsyncThunk('hotels/delete', async(id) => {
    await axios.delete(`${API}/api/hotels/${id}`);
    return id;
});

const hotelSlice = createSlice({
    name: 'hotels',
    initialState: {
        items: [],
        total: 0,
        loading: false,
        error: null,
        page: 1,
        limit: 5,
        filters: { title: '', minPrice: '', maxPrice: '' },
        toast: '',
    },
    reducers: {
        setPage: (s, a) => { s.page = a.payload; },
        setFilters: (s, a) => { s.filters = {...s.filters, ...a.payload };
            s.page = 1; },
        showToast: (s, a) => { s.toast = a.payload; },
        clearToast: (s) => { s.toast = ''; },
    },
    extraReducers: (b) => {
        b.addCase(fetchHotels.pending, (s) => { s.loading = true;
                s.error = null; })
            .addCase(fetchHotels.fulfilled, (s, a) => {
                s.loading = false;
                s.items = a.payload.hotels;
                s.total = a.payload.total;
            })
            .addCase(fetchHotels.rejected, (s, a) => { s.loading = false;
                s.error = a.error.message; })
            .addCase(deleteHotel.fulfilled, (s) => { s.toast = 'Hotel deleted successfully'; });
    },
});

export const { setPage, setFilters, showToast, clearToast } = hotelSlice.actions;
export default hotelSlice.reducer;