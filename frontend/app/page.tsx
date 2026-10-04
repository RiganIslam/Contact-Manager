"use client";

import { useEffect, useMemo, useState } from "react";
import ContactModal from "@/components/ContactModal";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
};

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingContact, setEditingContact] =
    useState<Contact | null>(null);

  // =========================
  // GET CONTACTS
  // =========================

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/contacts"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch contacts"
        );
      }

      const data = await response.json();

      setContacts(data);
    } catch (error) {
      console.error(error);

      setError(
        "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredContacts = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return contacts;
    }

    return contacts.filter((contact) =>
      contact.name
        .toLowerCase()
        .includes(searchText)
    );
  }, [contacts, search]);

  // =========================
  // ADD
  // =========================

  const openAddModal = () => {
    setEditingContact(null);
    setModalOpen(true);
  };

  // =========================
  // EDIT
  // =========================

  const openEditModal = (
    contact: Contact
  ) => {
    setEditingContact(contact);
    setModalOpen(true);
  };

  // =========================
  // DELETE
  // =========================

  const deleteContact = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/contacts/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete contact"
        );
      }

      await fetchContacts();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#29251f]">
      {/* ================= HEADER ================= */}

      <header className="border-b border-[#ddd4c8] bg-[#f7f3ed]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c96b32]">
              Personal Directory
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight">
              Contact<span className="text-[#c96b32]">ly</span>
            </h1>
          </div>

          <button
            onClick={openAddModal}
            className="rounded-full bg-[#29251f] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#c96b32]"
          >
            + Add Contact
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-[#e3d7c8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#c96b32]">
              Your contacts, organised.
            </div>

            <h2 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Keep every important
              <span className="text-[#c96b32]">
                {" "}
                connection
              </span>{" "}
              close.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#756e64]">
              Add, search, edit and manage your
              contacts from one simple and elegant
              workspace.
            </p>
          </div>

          {/* STAT CARD */}

          <div className="rounded-[2rem] bg-[#29251f] p-7 text-white shadow-xl">
            <p className="text-sm text-[#bcb4a9]">
              Total contacts
            </p>

            <p className="mt-3 text-6xl font-black">
              {contacts.length}
            </p>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-sm text-[#bcb4a9]">
                Currently showing
              </p>

              <p className="mt-1 text-2xl font-bold text-[#f1a36f]">
                {filteredContacts.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-16">
        {/* SEARCH */}

        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-[#e3d7c8] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8a8176]">
              Search contacts
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by contact name..."
              className="w-full rounded-2xl border border-[#ddd4c8] bg-[#faf8f5] px-5 py-4 outline-none transition focus:border-[#c96b32] focus:ring-4 focus:ring-[#c96b32]/10"
            />
          </div>

          <button
            onClick={openAddModal}
            className="rounded-2xl border border-[#c96b32] px-6 py-4 font-bold text-[#c96b32] transition hover:bg-[#c96b32] hover:text-white"
          >
            + New Contact
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {/* ================= CONTACT LIST ================= */}

        {loading ? (
          <div className="rounded-3xl bg-white p-20 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e6ddd3] border-t-[#c96b32]" />

            <p className="mt-5 text-[#8a8176]">
              Loading contacts...
            </p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d6cabc] bg-white p-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3ebe2] text-3xl">
              👤
            </div>

            <h3 className="mt-6 text-xl font-black">
              No contacts found
            </h3>

            <p className="mt-2 text-[#8a8176]">
              Try another name or add a new contact.
            </p>

            <button
              onClick={openAddModal}
              className="mt-6 rounded-full bg-[#c96b32] px-6 py-3 font-bold text-white transition hover:bg-[#a95325]"
            >
              Add First Contact
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map(
              (contact) => (
                <article
                  key={contact._id}
                  className="group rounded-[2rem] border border-[#e4dbd1] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* TOP */}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3ebe2] text-xl font-black text-[#c96b32]">
                        {contact.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-black">
                          {contact.name}
                        </h3>

                        {contact.company && (
                          <p className="mt-1 text-sm text-[#8a8176]">
                            {contact.company}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="rounded-full bg-[#f7f3ed] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8a8176]">
                      Contact
                    </span>
                  </div>

                  {/* INFO */}

                  <div className="mt-7 space-y-3">
                    <div className="rounded-xl bg-[#faf8f5] px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#a0988e]">
                        Email
                      </p>

                      <p className="mt-1 truncate text-sm font-medium">
                        {contact.email}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#faf8f5] px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#a0988e]">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {contact.phone}
                      </p>
                    </div>

                    {contact.address && (
                      <div className="rounded-xl bg-[#faf8f5] px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#a0988e]">
                          Address
                        </p>

                        <p className="mt-1 truncate text-sm font-medium">
                          {contact.address}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 flex gap-3 border-t border-[#eee7df] pt-5">
                    <button
                      onClick={() =>
                        openEditModal(contact)
                      }
                      className="flex-1 rounded-xl bg-[#29251f] py-3 text-sm font-bold text-white transition hover:bg-[#c96b32]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteContact(
                          contact._id
                        )
                      }
                      className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {/* MODAL */}

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchContacts}
        editingContact={editingContact}
      />
    </main>
  );
}