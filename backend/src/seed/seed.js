import fs from "node:fs";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { config } from "../config/config.js";
import { connectDB } from "../config/database.js";
import User, { ROLES } from "../models/user.model.js";
import Author from "../models/author.model.js";
import Book from "../models/Book.model.js";
import Ticket from "../models/ticket.model.js";

const AUTHOR_PASSWORD = "Author@123";
const ADMIN = {
    name: "BookLeaf Admin",
    email: "admin@bookleaf.com",
    password: "Admin@123"
};

const toDate = (v) => (v ? new Date(v) : null);

async function seed() {
    await connectDB();
    const { authors } = JSON.parse(
        fs.readFileSync(new URL("./sample-data.json", import.meta.url), "utf-8")
    );

    // Idempotent: it will run only once
    await Promise.all([User.deleteMany(),
    Author.deleteMany(),
    Book.deleteMany(),
    Ticket.deleteMany()
    ]);

    const authorHash = await bcrypt.hash(AUTHOR_PASSWORD, 10);
    const adminHash = await bcrypt.hash(ADMIN.password, 10);

    await User.create({
        name: ADMIN.name,
        email: ADMIN.email,
        passwordHash: adminHash,
        role: ROLES.ADMIN,
    });

    for (const a of authors) {
        const author = await Author.create({
            authorId: a.author_id, name: a.name, email: a.email,
            phone: a.phone, city: a.city, joinedDate: toDate(a.joined_date),
        });

        await User.create({
            name: a.name, email: a.email, passwordHash: authorHash,
            role: ROLES.AUTHOR, author: author._id,
        });

        await Book.insertMany(
            a.books.map((b) => ({
                bookId: b.book_id,
                author: author._id,
                title: b.title,
                isbn: b.isbn,
                genre: b.genre,
                publicationDate: toDate(b.publication_date),
                status: b.status,
                mrp: b.mrp,
                authorRoyaltyPerCopy: b.author_royalty_per_copy,
                totalCopiesSold: b.total_copies_sold,
                totalRoyaltyEarned: b.total_royalty_earned,
                royaltyPaid: b.royalty_paid,
                royaltyPending: b.royalty_pending,
                lastRoyaltyPayoutDate: toDate(b.last_royalty_payout_date),
                printPartner: b.print_partner,
                availableOn: b.available_on ?? [],
            }))
        );
    }

    console.log(`Seeded ${authors.length} authors, admin: ${ADMIN.email} / ${ADMIN.password}`);
    console.log(`All authors password: ${AUTHOR_PASSWORD}`);
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});