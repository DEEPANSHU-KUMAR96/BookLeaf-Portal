import * as bookService from "../services/book.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  res.json(
    await bookService.listBooks(req.user, req.valid.query));
});

export const getOne = asyncHandler(async (req, res) => {
  res.json({
     book: await bookService.getBook(req.user, req.params.id) 
    });
});