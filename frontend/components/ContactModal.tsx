"use client";

import { useEffect, useState } from "react";

type Contact = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingContact: Contact | null;
};

export default function ContactModal({
  isOpen,
  onClose,
  onSaved,
  editingContact,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOAD EDIT DATA
  // =========================

  useEffect(() => {
    if (editingContact) {
      setName(editingContact.name);
      setEmail(editingContact.email);
      setPhone(editingContact.phone);
      setCompany(editingContact.company);
      setAddress(editingContact.address);
    } else {
      resetForm();
    }
  }, [editingContact, isOpen]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setAddress("");
  };

  if (!isOpen) {
    return null;
  }

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      alert(
        "Name, email and phone are required."
      );

      return;
    }

    setLoading(true);

    try {
      let url =
        "http://localhost:5000/contacts";

      let method = "POST";

      if (editingContact?._id) {
        url = `http://localhost:5000/contacts/${editingContact._id}`;

        method = "PUT";
      }

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong"
        );
      }

      resetForm();

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#29251f]/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#f7f3ed] shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between bg-[#29251f] px-7 py-6 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f1a36f]">
              Contactly
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {editingContact
                ? "Edit Contact"
                : "Add Contact"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-7"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Full Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="John Doe"
                className="w-full rounded-xl border border-[#ddd4c8] bg-white px-4 py-3 outline-none transition focus:border-[#c96b32] focus:ring-4 focus:ring-[#c96b32]/10"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Email *
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="john@example.com"
                className="w-full rounded-xl border border-[#ddd4c8] bg-white px-4 py-3 outline-none transition focus:border-[#c96b32] focus:ring-4 focus:ring-[#c96b32]/10"
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Phone *
              </label>

              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  if (/^\d*$/.test(value)) {
                    setPhone(value);
                  }
                }}
                maxLength={11}
                placeholder="01700000000"
                className="w-full rounded-xl border border-[#ddd4c8] bg-white px-4 py-3 outline-none transition focus:border-[#c96b32] focus:ring-4 focus:ring-[#c96b32]/10"
              />
            </div>

            {/* COMPANY */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Company
              </label>

              <input
                type="text"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                placeholder="ABC Company"
                className="w-full rounded-xl border border-[#ddd4c8] bg-white px-4 py-3 outline-none transition focus:border-[#c96b32] focus:ring-4 focus:ring-[#c96b32]/10"
              />
            </div>
          </div>

          {/* ADDRESS */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold">
              Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              rows={3}
              placeholder="Enter contact address..."
              className="w-full resize-none rounded-xl border border-[#ddd4c8] bg-white px-4 py-3 outline-none transition focus:border-[#c96b32] focus:ring-4 focus:ring-[#c96b32]/10"
            />
          </div>

          {/* BUTTONS */}

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#d8cec2] px-6 py-3 font-bold text-[#756e64] transition hover:bg-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#c96b32] px-7 py-3 font-bold text-white transition hover:bg-[#a95325] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingContact
                ? "Update Contact"
                : "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}