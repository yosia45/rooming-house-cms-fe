import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = []

const additionalPriceSlice = createSlice({
    name: 'additionalPrices',
    initialState
})

export default additionalPriceSlice.reducer

