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
  status: "active" | "inactive";
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

const defaultPositions: Position[] = [];

const defaultElections: Election[] = [];

export const awardCategoriesPresets: string[] = [];

const candidateNames: Record<string, string[]> = {};

const awardNominees: { positionId: string; name: string }[] = [];

const defaultCandidates: Candidate[] = [];

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

const defaultVoters: Voter[] = [];

export const auditLogs: AuditLog[] = [];

const defaultNotifications: AppNotification[] = [];

export const votesByDay: { day: string; votes: number }[] = [];

export const electionStatusBreakdown: { name: string; value: number; color: string }[] = [];

// Mutable exported states (always start empty — localStorage persistence removed)
export const positions: Position[] = [];
export const elections: Election[] = [];
export const candidates: Candidate[] = [];
export const voters: Voter[] = [];
export const notifications: AppNotification[] = [];

export const savePositions = () => setStorageItem("votesecure_positions", positions);
export const saveElections = () => setStorageItem("votesecure_elections", elections);
export const saveCandidates = () => setStorageItem("votesecure_candidates", candidates);
export const saveVoters = () => setStorageItem("votesecure_voters", voters);
export const saveNotifications = () => setStorageItem("votesecure_notifications", notifications);

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
  saveElections();
  saveCandidates();
  savePositions();
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

  if (typeof window !== "undefined") {
    localStorage.removeItem("votesecure_voted_elections");
  }
};
