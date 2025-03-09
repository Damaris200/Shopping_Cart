require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const db = require("./database"); // ✅ Fix typo in import
console.log("🛠 Database object:", db); 

const app = express();

// ✅ Middleware (Move express.json() to the top)
app.use(express.json());
app.use(cors());

// ✅ Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

// ✅ API to handle order placement
app.post("/api/order", async (req, res) => {
    console.log("🔍 Received order:", req.body);

    let { email, address, cartItems, totalPrice } = req.body;

    // ✅ Fix: Parse cartItems if it's a string
    try {
        if (typeof cartItems === "string") {
            cartItems = JSON.parse(cartItems);
        }
    } catch (error) {
        console.error("❌ Failed to parse cartItems:", error.message);
        return res.status(400).json({ error: "Invalid cartItems format" });
    }

    // ✅ Ensure cartItems is an array
    if (!email || !address || !Array.isArray(cartItems) || cartItems.length === 0) {
        console.error("❌ Invalid request data:", req.body);
        return res.status(400).json({ error: "Missing required fields or invalid cart items" });
    }

    // ✅ Convert cartItems to JSON for database storage
    const itemsJSON = JSON.stringify(cartItems);

    // ✅ Generate item list for email
    const itemList = cartItems.map((item) => `• ${item.title} - $${item.price}`).join("\n");

    // ✅ Fix: Ensure `db` is working correctly
    if (!db || typeof db.run !== "function") {
        console.error("❌ Database connection issue: `db.run` is not available.");
        return res.status(500).json({ error: "Database connection failed" });
    }

    // ✅ Insert order into SQLite database
    db.run(
        `INSERT INTO orders (email, address, items, total_price) VALUES (?, ?, ?, ?)`,
        [email, address, itemsJSON, totalPrice],
        function (err) {
            if (err) {
                console.error("❌ Database error:", err.message);
                return res.status(500).json({ error: "Failed to save order" });
            }

            // ✅ Send confirmation email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Order Confirmation",
                text: `Thank you for your order!\n\nItems:\n${itemList}\n\nTotal: $${totalPrice}\n\nDelivery Address: ${address}\nYour order will be delivered within 3 days.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("❌ Error sending email:", error);
                    return res.status(500).json({ error: "Failed to send email" });
                }
                res.status(200).json({ message: "✅ Order placed successfully" });
            });
        }
    );
});


// ✅ API to get all orders
app.get("/api/orders", (req, res) => {
    db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            console.error("❌ Database fetch error:", err.message);
            return res.status(500).json({ error: "Failed to retrieve orders" });
        }
        res.json(rows);
    });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
