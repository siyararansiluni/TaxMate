export type TaxStatus = "Not Started" | "In Progress" | "Filed";
export type DocStatus = "Verified" | "Needs review";

export interface Client {
  id: string;
  name: string;
  nic: string;
  tin: string;
  email: string;
  phone: string;
  assignedOn: string;
  lastActivityDate: string;
  lastActivityText: string;
  status: TaxStatus;
  totalIncome: number;
  reliefs: number;
  estimatedTax: number;
  documents: { name: string; uploaded: string; status: DocStatus }[];
  income: { source: string; amount: number; status: DocStatus }[];
  activity: { text: string; date: string }[];
}

// Mock data – replace with your API response later.
export const CLIENTS: Client[] = [
  {
    id: "1",
    name: "Kamal Perera",
    nic: "987654321V",
    tin: "1234567890",
    email: "kamal.perera@gmail.com",
    phone: "077 123 4567",
    assignedOn: "2025-10-08",
    lastActivityDate: "2025-10-15",
    lastActivityText: "Documents uploaded",
    status: "Filed",
    totalIncome: 2535000,
    reliefs: 1200000,
    estimatedTax: 128500,
    documents: [
      { name: "Salary slips – Oct 2025.pdf", uploaded: "2025-10-15", status: "Verified" },
      { name: "Bank interest certificate.pdf", uploaded: "2025-10-12", status: "Verified" },
      { name: "Relief claim form.pdf", uploaded: "2025-10-10", status: "Needs review" },
    ],
    income: [
      { source: "Employment income", amount: 2450000, status: "Verified" },
      { source: "Interest income", amount: 85000, status: "Verified" },
      { source: "Personal relief", amount: 1200000, status: "Needs review" },
    ],
    activity: [
      { text: "Documents uploaded", date: "2025-10-15" },
      { text: "Income details updated", date: "2025-10-12" },
      { text: "Assigned to you", date: "2025-10-08" },
    ],
  },
  {
    id: "2",
    name: "Nimali Fernando",
    nic: "876543210V",
    tin: "2345678901",
    email: "nimali.fernando@gmail.com",
    phone: "071 234 5678",
    assignedOn: "2025-10-05",
    lastActivityDate: "2025-10-12",
    lastActivityText: "Income details updated",
    status: "In Progress",
    totalIncome: 1800000,
    reliefs: 1200000,
    estimatedTax: 36000,
    documents: [{ name: "Salary slips – Sep 2025.pdf", uploaded: "2025-10-12", status: "Verified" }],
    income: [{ source: "Employment income", amount: 1800000, status: "Verified" }],
    activity: [
      { text: "Income details updated", date: "2025-10-12" },
      { text: "Assigned to you", date: "2025-10-05" },
    ],
  },
  {
    id: "3",
    name: "Sahan Wijesinghe",
    nic: "200012345678",
    tin: "3456789012",
    email: "sahan.w@gmail.com",
    phone: "076 345 6789",
    assignedOn: "2025-10-03",
    lastActivityDate: "2025-10-10",
    lastActivityText: "Profile updated",
    status: "Not Started",
    totalIncome: 0,
    reliefs: 0,
    estimatedTax: 0,
    documents: [],
    income: [],
    activity: [
      { text: "Profile updated", date: "2025-10-10" },
      { text: "Assigned to you", date: "2025-10-03" },
    ],
  },
];

export const STATUSES: TaxStatus[] = ["Not Started", "In Progress", "Filed"];

export const STATUS_HELP: Record<TaxStatus, string> = {
  "Not Started": "Work has not begun",
  "In Progress": "Preparing the return",
  Filed: "Return submitted",
};

export const statusClass = (s: TaxStatus | DocStatus) =>
  ({
    Filed: "ac-green",
    Verified: "ac-green",
    "In Progress": "ac-peach",
    "Needs review": "ac-peach",
    "Not Started": "ac-violet",
  })[s];

export const lkr = (n: number) => "LKR " + n.toLocaleString("en-US");