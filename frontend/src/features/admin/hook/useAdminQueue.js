import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadQueue, setFilter } from "../state/adminSlice";

export function useAdminQueue() {
  const dispatch = useDispatch();
  const { filters, queue } = useSelector((state) => state.admin);

  // Refetch whenever a filter changes (and on mount, so coming back from a ticket shows fresh data)
  useEffect(() => {
    dispatch(loadQueue());
  }, [filters, dispatch]);

  // If tickets disappear while on a late page (resolved, filtered out), step back to the last page
  const totalPages = queue.pagination?.totalPages ?? 0;
  useEffect(() => {
    if (totalPages > 0 && filters.page > totalPages) {
      dispatch(setFilter({ key: "page", value: totalPages }));
    }
  }, [totalPages, filters.page, dispatch]);

  return { filters, queue };
}