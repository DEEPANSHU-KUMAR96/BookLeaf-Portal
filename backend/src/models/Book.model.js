import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        bookId: {
            type: String,
            required: true,
            unique: true
        }, // BK001
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author",
            required: true, index: true
        },
        title: {
            type: String,
            required: true
        },
        isbn: String,
        genre: String,
        publicationDate: {
            type: Date,
            default: null
        }, // it will be null for production books
        status: {
            type: String,
            required: true
        },
        mrp: {
            type: Number,
            default: 0
        },
        authorRoyaltyPerCopy: {
            type: Number,
            default: 0
        },
        totalCopiesSold: {
            type: Number,
            default: 0
        },
        totalRoyaltyEarned: {
            type: Number,
            default: 0
        },
        royaltyPaid: {
            type: Number,
            default: 0
        },
        royaltyPending: {
            type: Number,
            default: 0
        },
        lastRoyaltyPayoutDate: {
            type: Date,
            default: null
        },
        printPartner: String,
        availableOn: {
            type: [String],
            default: []
        },
    },
    { timestamps: true }
);

// it will be null for production books and will be set when a book is published
bookSchema.virtual("isPublished").get(function () {
    return this.status === "Published & Live";
});

const Book = mongoose.model("Book", bookSchema);

export default Book