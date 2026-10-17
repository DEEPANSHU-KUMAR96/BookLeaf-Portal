import api from "../../../services/api";

// An author has a handful of books, so one page of 100 is plenty
export const fetchBooks = () => api.get("/books", {
     params: {
         limit: 100
         } }).then((r) => r.data);