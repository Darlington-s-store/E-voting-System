export type ElectionStatus = "draft" | "scheduled" | "open" | "closed" | "archived";

export interface Position {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
  code: string;
  winners: number;
  votingMethod: "Single Choice" | "Multiple Choice" | "Ranked Choice";
  startDate: string;
  endDate: string;
  minLevel: "100" | "200" | "300" | "400" | "500";
  minGpa: number;
  noDisciplinary: boolean;
  activeStudent: boolean;
  deptRestrictions: string;
  voterLevels: string;
  voterFaculties: string;
  voterDepts: string;
  requirePoster: boolean;
  requireManifesto: boolean;
  requireVideo: boolean;
  publicVisibility: "Visible to everyone" | "Visible only during election";
  resultVisibility:
    | "Show results immediately"
    | "Show after election closes"
    | "Only admins can view";
  anonymousVoting: boolean;
  voteConfirmation: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  positionId: string;
  electionId: string;
  bio: string;
  campaignMessage: string;
  photo: string;
  votes: number;
  poster?: string;
  manifesto?: string;
  funFact?: string;
  instagram?: string;
  twitter?: string;
  status: "active" | "inactive" | "pending";
  partylistId?: string;
}

export interface Partylist {
  id: string;
  name: string;
  acronym: string;
  description: string;
  logo: string;
  color: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "super" | "sub";
  status: "active" | "suspended";
  lastLogin: string;
  dateCreated: string;
}

export interface Election {
  id: string;
  name: string;
  description: string;
  type: "General" | "By-Election" | "Referendum" | "Campus Awards";
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  positionIds: string[];
  totalEligible: number;
  votesCast: number;
}

export interface Voter {
  id: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  faculty: string;
  level: string;
  status: "active" | "suspended";
  lastLogin: string;
  avatar: string;
  phoneNumber?: string;
  twoFactorEnabled?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: "admin" | "voter" | "system";
  action: "LOGIN" | "VOTE" | "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  ip: string;
  details?: string;
}

export interface AppNotification {
  id: string;
  type: "info" | "success" | "warning" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const avatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E3A5F&color=fff&bold=true&size=256`;

// Local Storage Sync Helpers
const isBrowser = typeof window !== "undefined";

const getStorageItem = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const val = localStorage.getItem(key);
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const setStorageItem = <T>(key: string, value: T) => {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const initialPositions = [
  { id: "p1", name: "President", description: "Leads the student union", maxVotes: 1 },
  { id: "p2", name: "Vice President", description: "Supports the president", maxVotes: 1 },
  { id: "p3", name: "Secretary", description: "Records and communications", maxVotes: 1 },
  { id: "p4", name: "Treasurer", description: "Financial oversight", maxVotes: 1 },
  { id: "p5", name: "PRO", description: "Public relations officer", maxVotes: 1 },
  { id: "p6", name: "Organizing Secretary", description: "Coordinates events", maxVotes: 1 },
];

const makePosition = (p: {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
}): Position => {
  let code = "POS-001";
  let winners = 1;
  let minLevel: Position["minLevel"] = "200";
  let minGpa = 2.0;

  if (p.name.includes("President")) {
    code = "PRES001";
    winners = 1;
    minLevel = "300";
    minGpa = 2.5;
  } else if (p.name.includes("Secretary")) {
    code = "SEC001";
    winners = 1;
    minLevel = "200";
    minGpa = 2.2;
  } else if (p.name.includes("Treasurer") || p.name.includes("Financial")) {
    code = "TRES001";
    winners = 1;
    minLevel = "300";
    minGpa = 2.5;
  }

  return {
    ...p,
    code,
    winners,
    votingMethod: "Single Choice",
    startDate: "2026-10-01T08:00",
    endDate: "2026-10-03T18:00",
    minLevel,
    minGpa,
    noDisciplinary: true,
    activeStudent: true,
    deptRestrictions: "",
    voterLevels: "All Levels",
    voterFaculties: "All Faculties",
    voterDepts: "All Departments",
    requirePoster: true,
    requireManifesto: true,
    requireVideo: false,
    publicVisibility: "Visible to everyone",
    resultVisibility: "Show after election closes",
    anonymousVoting: true,
    voteConfirmation: true,
  };
};

const awardPositions: Position[] = [
  {
    id: "a1",
    name: "Best Dressed Male",
    description: "Celebrating style, elegance, and fashion in male students.",
    maxVotes: 1,
    code: "AW-BDM",
    winners: 1,
    votingMethod: "Single Choice",
    startDate: "2026-06-20T08:00:00Z",
    endDate: "2026-06-28T20:00:00Z",
    minLevel: "100",
    minGpa: 1.0,
    noDisciplinary: false,
    activeStudent: true,
    deptRestrictions: "",
    voterLevels: "All Levels",
    voterFaculties: "All Faculties",
    voterDepts: "All Departments",
    requirePoster: true,
    requireManifesto: false,
    requireVideo: false,
    publicVisibility: "Visible to everyone",
    resultVisibility: "Show after election closes",
    anonymousVoting: true,
    voteConfirmation: true,
  },
  {
    id: "a2",
    name: "Best Dressed Female",
    description: "Celebrating style, elegance, and fashion in female students.",
    maxVotes: 1,
    code: "AW-BDF",
    winners: 1,
    votingMethod: "Single Choice",
    startDate: "2026-06-20T08:00:00Z",
    endDate: "2026-06-28T20:00:00Z",
    minLevel: "100",
    minGpa: 1.0,
    noDisciplinary: false,
    activeStudent: true,
    deptRestrictions: "",
    voterLevels: "All Levels",
    voterFaculties: "All Faculties",
    voterDepts: "All Departments",
    requirePoster: true,
    requireManifesto: false,
    requireVideo: false,
    publicVisibility: "Visible to everyone",
    resultVisibility: "Show after election closes",
    anonymousVoting: true,
    voteConfirmation: true,
  },
  {
    id: "a3",
    name: "Face of the Campus",
    description: "Recognizing outstanding charisma, charm, and presence.",
    maxVotes: 1,
    code: "AW-FOC",
    winners: 1,
    votingMethod: "Single Choice",
    startDate: "2026-06-20T08:00:00Z",
    endDate: "2026-06-28T20:00:00Z",
    minLevel: "100",
    minGpa: 1.0,
    noDisciplinary: false,
    activeStudent: true,
    deptRestrictions: "",
    voterLevels: "All Levels",
    voterFaculties: "All Faculties",
    voterDepts: "All Departments",
    requirePoster: true,
    requireManifesto: false,
    requireVideo: false,
    publicVisibility: "Visible to everyone",
    resultVisibility: "Show after election closes",
    anonymousVoting: true,
    voteConfirmation: true,
  },
  {
    id: "a4",
    name: "Most Hardworking Student",
    description: "Honoring academic resilience, work ethic, and dedication.",
    maxVotes: 1,
    code: "AW-MHW",
    winners: 1,
    votingMethod: "Single Choice",
    startDate: "2026-06-20T08:00:00Z",
    endDate: "2026-06-28T20:00:00Z",
    minLevel: "100",
    minGpa: 1.0,
    noDisciplinary: false,
    activeStudent: true,
    deptRestrictions: "",
    voterLevels: "All Levels",
    voterFaculties: "All Faculties",
    voterDepts: "All Departments",
    requirePoster: true,
    requireManifesto: false,
    requireVideo: false,
    publicVisibility: "Visible to everyone",
    resultVisibility: "Show after election closes",
    anonymousVoting: true,
    voteConfirmation: true,
  },
  {
    id: "a5",
    name: "Campus Comedian",
    description: "Celebrating students bringing joy and laughter to campus.",
    maxVotes: 1,
    code: "AW-COM",
    winners: 1,
    votingMethod: "Single Choice",
    startDate: "2026-06-20T08:00:00Z",
    endDate: "2026-06-28T20:00:00Z",
    minLevel: "100",
    minGpa: 1.0,
    noDisciplinary: false,
    activeStudent: true,
    deptRestrictions: "",
    voterLevels: "All Levels",
    voterFaculties: "All Faculties",
    voterDepts: "All Departments",
    requirePoster: true,
    requireManifesto: false,
    requireVideo: false,
    publicVisibility: "Visible to everyone",
    resultVisibility: "Show after election closes",
    anonymousVoting: true,
    voteConfirmation: true,
  },
];

const defaultPositions: Position[] = [...initialPositions.map(makePosition), ...awardPositions];

const defaultElections: Election[] = [
  {
    id: "e1",
    name: "2025 Student Union Elections",
    description: "Annual election for the student union executive council.",
    type: "General",
    status: "open",
    startDate: "2026-06-20T08:00:00Z",
    endDate: "2026-06-28T20:00:00Z",
    positionIds: ["p1", "p2", "p3", "p4", "p5", "p6"],
    totalEligible: 12480,
    votesCast: 8421,
  },
  {
    id: "e2",
    name: "Faculty Council Elections",
    description: "Selection of faculty council representatives.",
    type: "General",
    status: "scheduled",
    startDate: "2026-07-10T08:00:00Z",
    endDate: "2026-07-15T20:00:00Z",
    positionIds: ["p1", "p3", "p4"],
    totalEligible: 4200,
    votesCast: 0,
  },
  {
    id: "e-awards",
    name: "Campus Awards 2026",
    description: "Celebrating student excellence and talent across campus.",
    type: "Campus Awards",
    status: "open",
    startDate: "2026-06-20T08:00:00Z",
    endDate: "2026-06-28T20:00:00Z",
    positionIds: ["a1", "a2", "a3", "a4", "a5"],
    totalEligible: 12480,
    votesCast: 4210,
  },
];

export const awardCategoriesPresets: string[] = [
  "Best Dressed Male",
  "Best Dressed Female",
  "Face of the Campus",
  "Most Hardworking Student",
  "Campus Comedian",
  "Student Artiste of the Year",
  "Student Influencer of the Year",
  "Sports Personality of the Year",
  "Most Popular Student",
  "Outstanding Student Leader",
  "Tech Genius of the Year",
  "Entrepreneur of the Year",
];

const candidateNames: Record<string, string[]> = {
  p1: ["Amara Okafor", "Daniel Mensah", "Fatima Bello"],
  p2: ["Kwame Boateng", "Chioma Eze"],
  p3: ["Ifeoma Nwosu", "Kojo Asante", "Linda Adams"],
  p4: ["Yusuf Idris", "Grace Owusu"],
  p5: ["Esi Quartey", "Tunde Akin", "Ama Serwaa"],
  p6: ["Nana Akoto", "Zainab Musa"],
};

const awardNominees: { positionId: string; name: string }[] = [
  { positionId: "a1", name: "Kofi Owusu" },
  { positionId: "a1", name: "David Tetteh" },
  { positionId: "a2", name: "Abena Mansa" },
  { positionId: "a2", name: "Naa Ayeley" },
  { positionId: "a3", name: "Prince Osei" },
  { positionId: "a3", name: "Blessing Alao" },
  { positionId: "a4", name: "Kwaku Mensah" },
  { positionId: "a4", name: "Emeka Obi" },
  { positionId: "a5", name: "Uncle Rich" },
  { positionId: "a5", name: "Comedian Waris" },
];

export const departments = [
  "Computer Science",
  "Business Admin",
  "Engineering",
  "Law",
  "Medicine",
  "Arts",
];

export const faculties = [
  "Science",
  "Business",
  "Engineering",
  "Law",
  "Health Sciences",
  "Humanities",
];

export const levels = ["100", "200", "300", "400", "500"];

const firstNames = [
  "Ada",
  "Tunde",
  "Kwesi",
  "Aisha",
  "Chinedu",
  "Esi",
  "Bola",
  "Nadia",
  "Yaw",
  "Funke",
  "Sade",
  "Kojo",
];

const lastNames = [
  "Okeke",
  "Mensah",
  "Adeyemi",
  "Boateng",
  "Bello",
  "Owusu",
  "Nwankwo",
  "Asare",
  "Eze",
  "Quaye",
];

const defaultCandidates: Candidate[] = [
  ...Object.entries(candidateNames).flatMap(([positionId, names]) =>
    names.map((name, i) => ({
      id: `c-${positionId}-${i}`,
      name,
      positionId,
      electionId: "e1",
      bio: `Dedicated student leader with a track record of organizing campus initiatives, advocating for student welfare, and driving real change.`,
      campaignMessage: `A vote for ${name.split(" ")[0]} is a vote for transparency, progress, and unity on our campus.`,
      photo: avatar(name),
      votes: Math.floor(200 + Math.random() * 2200),
      status: "active" as const,
      partylistId: `party-${(i % 3) + 1}`,
    })),
  ),
  ...awardNominees.map((nom, i) => ({
    id: `c-${nom.positionId}-${i}`,
    name: nom.name,
    positionId: nom.positionId,
    electionId: "e-awards",
    bio: `Passionate nominee for the ${nom.positionId} category. Thank you for your support!`,
    campaignMessage: `Support excellence, support ${nom.name.split(" ")[0]}!`,
    photo: avatar(nom.name),
    votes: Math.floor(100 + Math.random() * 1500),
    status: "active" as const,
  })),
];

const defaultPartylists: Partylist[] = [
  {
    id: "party-1",
    name: "Progressive Alliance",
    acronym: "PA",
    description:
      "Fostering campus unity, academic progress, and transparent student representation.",
    logo: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=150&auto=format&fit=crop&q=60",
    color: "#2E86AB",
  },
  {
    id: "party-2",
    name: "Democratic Student Front",
    acronym: "DSF",
    description:
      "Advocating for student welfare, inclusivity, and campus infrastructure improvement.",
    logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=60",
    color: "#A23B72",
  },
  {
    id: "party-3",
    name: "Students First Initiative",
    acronym: "SFI",
    description:
      "Putting students first in all union policies, financial administration, and event organizing.",
    logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=60",
    color: "#3B7A57",
  },
];

const defaultAdminAccounts: AdminAccount[] = [
  {
    id: "admin-acc-1",
    name: "Super Admin User",
    email: "superadmin@votesecure.admin",
    phone: "+1 (555) 019-2834",
    role: "super",
    status: "active",
    lastLogin: "2026-06-25T14:32:00Z",
    dateCreated: "2026-01-10T08:00:00Z",
  },
  {
    id: "admin-acc-2",
    name: "Sub Admin Assistant",
    email: "subadmin@votesecure.admin",
    phone: "+1 (555) 014-9821",
    role: "sub",
    status: "active",
    lastLogin: "2026-06-26T09:15:00Z",
    dateCreated: "2026-03-15T09:30:00Z",
  },
  {
    id: "admin-acc-3",
    name: "Junior Moderator",
    email: "moderator@votesecure.admin",
    phone: "+1 (555) 018-7744",
    role: "sub",
    status: "suspended",
    lastLogin: "2026-06-10T11:20:00Z",
    dateCreated: "2026-04-01T10:00:00Z",
  },
];

const defaultVoters: Voter[] = Array.from({ length: 120 }, (_, i) => {
  const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
  return {
    id: `v${i + 1}`,
    name,
    studentId: `SC/2022/${String(1000 + i).padStart(5, "0")}`,
    email: `${name.toLowerCase().replace(" ", ".")}${i}@uni.edu`,
    department: departments[i % departments.length],
    faculty: faculties[i % faculties.length],
    level: levels[i % levels.length],
    status: i % 17 === 0 ? "suspended" : "active",
    lastLogin: new Date(Date.now() - i * 36e5).toISOString(),
    avatar: avatar(name),
  };
});

export const auditLogs: AuditLog[] = [];

const defaultNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "info",
    title: "Election starts soon",
    message: "Student Union Elections opens in 2 hours.",
    time: "2h ago",
    read: false,
  },
  {
    id: "n2",
    type: "success",
    title: "Vote recorded",
    message: "Your vote for President has been recorded.",
    time: "1d ago",
    read: false,
  },
  {
    id: "n3",
    type: "warning",
    title: "Profile incomplete",
    message: "Please add a phone number to your profile.",
    time: "3d ago",
    read: true,
  },
  {
    id: "n4",
    type: "alert",
    title: "New login detected",
    message: "Sign-in from Chrome on Windows.",
    time: "5d ago",
    read: true,
  },
  {
    id: "n5",
    type: "info",
    title: "Faculty Council scheduled",
    message: "Mark your calendar for July 10.",
    time: "1w ago",
    read: true,
  },
];

export const votesByDay = [
  { day: "Mon", votes: 420 },
  { day: "Tue", votes: 980 },
  { day: "Wed", votes: 1420 },
  { day: "Thu", votes: 1180 },
  { day: "Fri", votes: 1640 },
  { day: "Sat", votes: 1320 },
  { day: "Sun", votes: 1461 },
];

export const electionStatusBreakdown = [
  { name: "Open", value: 1, color: "var(--color-success)" },
  { name: "Scheduled", value: 1, color: "var(--color-brand)" },
  { name: "Closed", value: 1, color: "var(--color-danger)" },
];

// Mutable exported states (loaded from localStorage with empty fallback).
// Storage keys bumped to v2 to clear any previously seeded demo data.
export const positions: Position[] = getStorageItem<Position[]>("votesecure_positions_v2", []);
export const elections: Election[] = getStorageItem<Election[]>("votesecure_elections_v2", []);
export const candidates: Candidate[] = getStorageItem<Candidate[]>("votesecure_candidates_v2", []);
export const voters: Voter[] = getStorageItem<Voter[]>("votesecure_voters_v2", []);
export const notifications: AppNotification[] = getStorageItem<AppNotification[]>(
  "votesecure_notifications_v2",
  [],
);
export const partylists: Partylist[] = getStorageItem<Partylist[]>(
  "votesecure_partylists_v2",
  defaultPartylists,
);
export const adminAccounts: AdminAccount[] = getStorageItem<AdminAccount[]>(
  "votesecure_admin_accounts_v2",
  defaultAdminAccounts,
);

export const savePositions = () => setStorageItem("votesecure_positions_v2", positions);
export const saveElections = () => setStorageItem("votesecure_elections_v2", elections);
export const saveCandidates = () => setStorageItem("votesecure_candidates_v2", candidates);
export const saveVoters = () => setStorageItem("votesecure_voters_v2", voters);
export const saveNotifications = () => setStorageItem("votesecure_notifications_v2", notifications);
export const savePartylists = () => setStorageItem("votesecure_partylists_v2", partylists);
export const saveAdminAccounts = () =>
  setStorageItem("votesecure_admin_accounts_v2", adminAccounts);

// Clean up any legacy seeded data from earlier versions on first load.
if (isBrowser) {
  [
    "votesecure_positions",
    "votesecure_elections",
    "votesecure_candidates",
    "votesecure_voters",
    "votesecure_notifications",
    "votesecure_voted_elections",
    "votesecure_partylists",
    "votesecure_admin_accounts",
  ].forEach((k) => localStorage.removeItem(k));
}

export function getElection(id: string) {
  return elections.find((e) => e.id === id);
}

export function getPositionsForElection(id: string) {
  const e = getElection(id);
  if (!e) return [];
  return positions.filter((p) => e.positionIds.includes(p.id));
}

export function getCandidatesForPosition(electionId: string, positionId: string) {
  return candidates.filter((c) => c.electionId === electionId && c.positionId === positionId);
}

// System Maintenance Utilities
export const resetVoteCounts = () => {
  elections.forEach((e) => {
    e.votesCast = 0;
  });
  candidates.forEach((c) => {
    c.votes = 0;
  });
  saveElections();
  saveCandidates();
  if (typeof window !== "undefined") {
    localStorage.removeItem("votesecure_voted_elections");
  }
};

export const wipeAllElectionsAndVotes = () => {
  elections.length = 0;
  candidates.length = 0;
  positions.length = 0;
  partylists.length = 0;
  saveElections();
  saveCandidates();
  savePositions();
  savePartylists();
  if (typeof window !== "undefined") {
    localStorage.removeItem("votesecure_voted_elections");
  }
};

export const restoreDemoData = () => {
  // Restore default positions
  positions.length = 0;
  defaultPositions.forEach((p) => positions.push(p));
  savePositions();

  // Restore default elections with mock votes
  elections.length = 0;
  defaultElections.forEach((e) => elections.push({ ...e }));
  saveElections();

  // Restore default candidates with mock votes
  candidates.length = 0;
  defaultCandidates.forEach((c) => candidates.push({ ...c }));
  saveCandidates();

  // Restore default partylists
  partylists.length = 0;
  defaultPartylists.forEach((p) => partylists.push(p));
  savePartylists();

  // Restore default admin accounts
  adminAccounts.length = 0;
  defaultAdminAccounts.forEach((a) => adminAccounts.push(a));
  saveAdminAccounts();

  if (typeof window !== "undefined") {
    localStorage.removeItem("votesecure_voted_elections");
  }
};

export const restoreCleanDefaults = () => {
  // Restore default positions
  positions.length = 0;
  defaultPositions.forEach((p) => positions.push(p));
  savePositions();

  // Restore default elections with 0 votes
  elections.length = 0;
  defaultElections.forEach((e) => elections.push({ ...e, votesCast: 0 }));
  saveElections();

  // Restore default candidates with 0 votes
  candidates.length = 0;
  defaultCandidates.forEach((c) => candidates.push({ ...c, votes: 0 }));
  saveCandidates();

  // Restore default partylists
  partylists.length = 0;
  defaultPartylists.forEach((p) => partylists.push(p));
  savePartylists();

  // Restore default admin accounts
  adminAccounts.length = 0;
  defaultAdminAccounts.forEach((a) => adminAccounts.push(a));
  saveAdminAccounts();

  if (typeof window !== "undefined") {
    localStorage.removeItem("votesecure_voted_elections");
  }
};
