/**
 * In-memory SSE hub. Clients subscribe to a "room"; the server publishes events to rooms.
 * Limitation: state lives in this process, so it works on a single server instance.
 * To scale horizontally, swap publish() for Redis pub/sub without touching callers.
 */
const rooms = new Map(); // room name -> Set of response objects

export const ADMINS_ROOM = "admins";
export const authorRoom = (authorId) => `author:${authorId}`;

export function subscribe(room, res) {
    if (!rooms.has(room)) rooms.set(room, new Set());
    rooms.get(room).add(res);

    return function unsubscribe() {
        const set = rooms.get(room);
        set?.delete(res);
        if (set?.size === 0) rooms.delete(room); // do not leak empty rooms
    };
}

/** Sends one event to everyone in the room. Never throws: realtime must not break an API call. */
export function publish(room, type, data = {}) {
    const set = rooms.get(room);
    if (!set) return;

    const frame = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of set) {
        try {
            res.write(frame);
        } catch {
            set.delete(res); // broken connection, drop it
        }
    }
}