import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTickets } from "../state/ticketsSlice";

export function useTickets() {
    const dispatch = useDispatch();
    const tickets = useSelector((state) => state.tickets);

    useEffect(() => {
        if (tickets.status === "idle") dispatch(loadTickets());
    }, [tickets.status, dispatch]);

    return { ...tickets, reload: () => dispatch(loadTickets()) };
}