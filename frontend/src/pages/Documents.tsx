
import { useEffect, useRef, useState } from "react";

type Category =
  | "Income proof"
  | "Deduction proof"
  | "Financial record"
  | "Identity document"
  | "Other";

type DocumentItem = {
  id: string;
  name: string;
  category: Category;
  year: string;
  uploaded: string;
  size: number;
  file?: File;
};

const years = ["2025 / 2026", "2024 / 2025", "2023 / 2024"];

const categories: Category[] = [
  "Income proof",
  "Deduction proof",
  "Financial record",
  "Identity document",
  "Other",
];

const initialDocuments: DocumentItem[] = [
  {
    id: "1",
    name: "Salary_Certificate_2025.pdf",
    category: "Income proof",
    year: "2025 / 2026",
    uploaded: "18 Oct 2026",
    size: 245000,
  },
  {
    id: "2",
    name: "Medical_Expenses.pdf",
    category: "Deduction proof",
    year: "2025 / 2026",
    uploaded: "15 Oct 2026",
    size: 320000,
  },
  {
    id: "3",
    name: "Bank_Statement.pdf",
    category: "Financial record",
    year: "2025 / 2026",
    uploaded: "12 Oct 2026",
    size: 540000,
  },
];

const MAX_SIZE = 5 * 1024 * 1024;

const formatSize = (bytes: number) =>
  `${(bytes / 1024).toFixed(1)} KB`;

function Documents() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [documentName, setDocumentName] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500";

  const filteredDocuments = documents.filter((doc) => {
    const matchesYear = !yearFilter || doc.year === yearFilter;
    const matchesCategory =
      !categoryFilter || doc.category === categoryFilter;
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesYear && matchesCategory && matchesSearch;
  });

  const hasFilters = Boolean(yearFilter || categoryFilter || search);

  useEffect(() => {
    if (!showUpload && !deleteId) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowUpload(false);
        setDeleteId(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showUpload, deleteId]);

  const resetForm = () => {
    setFile(null);
    setCategory("");
    setYear("");
    setDocumentName("");
    setError("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const closeForm = () => {
    setShowUpload(false);
    resetForm();
  };

  const selectFile = (selected: File | undefined) => {
    if (!selected) return;

    const extension = selected.name.split(".").pop()?.toLowerCase();
    const validExtension = ["pdf", "jpg", "jpeg", "png"].includes(
      extension || ""
    );

    if (!validExtension) {
      setError("Only PDF, JPG and PNG files are allowed.");
      setFile(null);
      return;
    }

    if (selected.size > MAX_SIZE) {
      setError("File size must be 5 MB or less.");
      setFile(null);
      return;
    }

    setFile(selected);
    setDocumentName(selected.name);
    setError("");
  };

  const uploadDocument = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!file || !category || !year) {
      setError("Please select a file, category and tax year.");
      return;
    }

    if (!documentName.trim()) {
      setError("Please enter a document name.");
      return;
    }

    const newDocument: DocumentItem = {
      id: crypto.randomUUID(),
      name: documentName.trim(),
      category: category as Category,
      year,
      uploaded: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      size: file.size,
      file,
    };

    setDocuments((previous) => [newDocument, ...previous]);
    setYearFilter("");
    setCategoryFilter("");
    setSearch("");

    closeForm();
    setSuccess("Document uploaded successfully!");
  };

  const openDocument = (doc: DocumentItem, download = false) => {
    if (!doc.file) {
      setError(
        "This is a demo document. Upload a real file to view or download it."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const url = URL.createObjectURL(doc.file);
    const link = document.createElement("a");
    link.href = url;

    if (download) {
      link.download = doc.name;
    } else {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Allow the browser time to open or download the file.
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    setDocuments((previous) =>
      previous.filter((doc) => doc.id !== deleteId)
    );
    setDeleteId(null);
    setSuccess("Document deleted successfully.");
  };

  return (
    <div className="w-full space-y-7 p-6 text-left text-[#17324F]">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="mt-2 text-sm text-slate-500">
            Upload and manage your supporting tax documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowUpload(true);
            setSuccess("");
          }}
          className="rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Upload Document
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div
          role="status"
          className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <span>✓ {success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {error && !showUpload && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            className="ml-4 underline"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* FILTER SECTION */}
      <div className="rounded-xl border border-[#B7C9FF] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold">
          Filter Documents
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Tax Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className={inputClass}
            >
              <option value="">All Tax Years</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Document Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={inputClass}
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Search Documents
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file name..."
              className={inputClass}
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm text-blue-700">
              Filters applied
            </span>

            <button
              type="button"
              onClick={() => {
                setYearFilter("");
                setCategoryFilter("");
                setSearch("");
              }}
              className="text-sm font-semibold text-blue-600 underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* DOCUMENTS TABLE */}
      <div className="overflow-hidden rounded-xl border border-[#B7C9FF] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 p-5">
          <h2 className="text-lg font-semibold">Your Documents</h2>
          <span className="text-sm text-slate-500">
            {filteredDocuments.length} document(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#EEF4FF] text-[#17324F]">
              <tr>
                <th className="px-5 py-4">Document Name</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Tax Year</th>
                <th className="px-5 py-4">Uploaded</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium">{doc.name}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {formatSize(doc.size)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {doc.category}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {doc.year}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {doc.uploaded}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => openDocument(doc)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openDocument(doc, true)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(doc.id)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="px-5 py-16 text-center">
            <p className="text-lg font-medium text-slate-600">
              No documents found
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try changing your filters or upload a new document.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setYearFilter("");
                  setCategoryFilter("");
                  setSearch("");
                }}
                className="mt-4 font-medium text-blue-600"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            className="my-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="upload-title"
                className="text-xl font-bold"
              >
                Upload Document
              </h2>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close upload form"
                className="text-xl text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={uploadDocument} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select File *
                </label>

                <input
                  ref={fileInput}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => selectFile(e.target.files?.[0])}
                  className="block w-full rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white"
                />

                <p className="mt-2 text-xs text-slate-500">
                  PDF, JPG or PNG. Maximum size: 5 MB.
                </p>

                {file && (
                  <p className="mt-2 text-sm text-green-700">
                    ✓ Selected: {file.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Document Name *
                </label>
                <input
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Document Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tax Year *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Tax Year</option>
                  {years.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-title"
              className="text-lg font-bold"
            >
              Delete Document?
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete this document?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;
