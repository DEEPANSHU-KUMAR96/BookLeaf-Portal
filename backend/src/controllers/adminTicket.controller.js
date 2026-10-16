import * as service from "../services/adminTicket.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
    res.json(await service.listTickets(req.user, req.valid.query));
});

export const getOne = asyncHandler(async (req, res) => {
    res.json({
        ticket: await service.getTicket(req.params.id)
    });
});

export const update = asyncHandler(async (req, res) => {
    res.json({
        ticket: await service.updateTicket(req.user, req.params.id, req.body)
    });
});

export const addNote = asyncHandler(async (req, res) => {
    const ticket = await service.addNote(req.user, req.params.id, req.body.text);
    res.status(201).json({
        ticket,
        message: "Note added successfully"
    });
});

export const respond = asyncHandler(async (req, res) => {
    const ticket = await service.addResponse(req.user, req.params.id, req.body);
    res.status(201).json({
        ticket,
        message: "Response added successfully"
    });
});