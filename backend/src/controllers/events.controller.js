import { ROLES } from "../models/user.model.js";
import { subscribe, ADMINS_ROOM, authorRoom } from "../services/realtime.service.js";

const HEARTBEAT_MS = 25_000;

export function stream(req, res) {
    // The room comes from the verified token, never from the request, so an author
    // cannot subscribe to someone else's events.
    const room = req.user.role === ROLES.ADMIN ? ADMINS_ROOM : authorRoom(req.user.authorId);

    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // stops nginx-style proxies from buffering the stream
    });
    res.flushHeaders();

    res.write("retry: 3000\n\n"); // browser/client reconnects after 3s if the stream drops
    res.write("event: connected\ndata: {}\n\n");

    const unsubscribe = subscribe(room, res);
    const heartbeat = setInterval(() => res.write(": ping\n\n"), HEARTBEAT_MS);

    // Close the stream when the access token expires; the client reconnects with a fresh one
    const msLeft = req.user.exp * 1000 - Date.now();
    const expiry = setTimeout(() => res.end(), Math.max(msLeft, 0));

    req.on("close", () => {
        clearInterval(heartbeat);
        clearTimeout(expiry);
        unsubscribe();
    });
}