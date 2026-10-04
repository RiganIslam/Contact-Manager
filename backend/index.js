const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let contactsCollection;

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Contact Manager API is running",
  });
});

// =========================
// GET ALL CONTACTS
// =========================

app.get("/contacts", async (req, res) => {
  try {
    const contacts = await contactsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(contacts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get contacts",
    });
  }
});

// =========================
// GET SINGLE CONTACT
// =========================

app.get("/contacts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid contact ID",
      });
    }

    const contact = await contactsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.json(contact);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get contact",
    });
  }
});

// =========================
// CREATE CONTACT
// =========================

app.post("/contacts", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      address,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email and phone are required",
      });
    }

    const contact = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company ? company.trim() : "",
      address: address ? address.trim() : "",
      createdAt: new Date(),
    };

    const result =
      await contactsCollection.insertOne(contact);

    res.status(201).json({
      message: "Contact created successfully",
      contact: {
        _id: result.insertedId,
        ...contact,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create contact",
    });
  }
});

// =========================
// UPDATE CONTACT
// =========================

app.put("/contacts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid contact ID",
      });
    }

    const {
      name,
      email,
      phone,
      company,
      address,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email and phone are required",
      });
    }

    const updatedContact = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company ? company.trim() : "",
      address: address ? address.trim() : "",
    };

    const result =
      await contactsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedContact,
        }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.json({
      message: "Contact updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update contact",
    });
  }
});

// =========================
// DELETE CONTACT
// =========================

app.delete("/contacts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid contact ID",
      });
    }

    const result =
      await contactsCollection.deleteOne({
        _id: new ObjectId(id),
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete contact",
    });
  }
});

// =========================
// START SERVER
// =========================

async function startServer() {
  try {
    await client.connect();

    const database = client.db("contactManagerDB");

    contactsCollection =
      database.collection("contacts");

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error
    );
  }
}

startServer();