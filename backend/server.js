import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/database.js";
import Ticket from "./src/models/ticket.model.js";

// Classification runs in the background, so a restart can leave tickets stuck on "pending".
// Anything pending for more than 5 minutes was interrupted, so mark it failed and let an admin retry.
async function failInterruptedAiJobs() {
    const cutoff = new Date(Date.now() - 5 * 60 * 1000);
    const { modifiedCount } = await Ticket.updateMany(
        { "ai.status": "pending", createdAt: { $lt: cutoff } },
        { "ai.status": "failed", "ai.error": "Classification was interrupted. Use retry." }
    );
    if (modifiedCount) console.log(`Marked ${modifiedCount} interrupted AI job(s) as failed`);
}

await connectDB();

// Housekeeping must never stop the server from starting
await failInterruptedAiJobs().catch((err) => console.error("AI job cleanup failed:", err.message));

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});