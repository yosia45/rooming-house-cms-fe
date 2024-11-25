import {configureStore} from '@reduxjs/toolkit'
import additionalPriceReducer from './slices/additionalSlice'

const store = configureStore({
    reducer: {
        additionalPrices: additionalPriceReducer
    },
});

export default store;