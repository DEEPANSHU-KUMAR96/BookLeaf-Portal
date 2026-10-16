import * as ticketService from "../services/ticket.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const ticket = await ticketService.createTicket(req.user, req.body);
    res.status(201).json({
        ticket,
        message: "Ticket created successfully"
    });
});

export const listMine = asyncHandler(async (req, res) => {
    res.json(await ticketService.listMyTickets(req.user, req.valid.query));
});

export const getMine = asyncHandler(async (req, res) => {
    res.json({
        ticket: await ticketService.getMyTicket(req.user, req.params.id)
    });
});