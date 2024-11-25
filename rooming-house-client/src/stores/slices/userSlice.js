import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios';

export const fetchUser = createAsyncThunk(
    'auth/loginUser',
    async (user) => {
        const response = await axios.post('http://localhost:8080/user/login', user);
        return response.data;
    }
);