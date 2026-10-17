import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as bookService from "../services/bookService";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export const loadBooks = createAsyncThunk("books/load", async (_, { rejectWithValue }) => {
    try {
        return await bookService.fetchBooks();
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

const booksSlice = createSlice({
    name: "books",
    initialState: { items: [], summary: null, status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadBooks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loadBooks.fulfilled, (state, { payload }) => {
                state.status = "succeeded";
                state.items = payload.books;
                state.summary = payload.summary;
            })
            .addCase(loadBooks.rejected, (state, { payload }) => {
                state.status = "failed";
                state.error = payload;
            });
    },
});

export default booksSlice.reducer;