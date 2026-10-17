import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBooks } from "../state/booksSlice";

export function useBooks() {
    const dispatch = useDispatch();
    const books = useSelector((state) => state.books);

    useEffect(() => {
        if (books.status === "idle") dispatch(loadBooks());
    }, [books.status, dispatch]);

    return { ...books, reload: () => dispatch(loadBooks()) };
}