export type ElectionStatus = "draft" | "scheduled" | "open" | "closed" | "archived";

export interface Position {
  id: string;
  name: string;
  description: string;
  maxVotes: number;
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
}

export interface Election {
  id: string;
  name: string;
  description: string;
  type: "General" | "By-Election" | "Referendum";
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

export const positions: Position[] = [
  { id: "p1", name: "President", description: "Leads the student union", maxVotes: 1 },
  { id: "p2", name: "Vice President", description: "Supports the president", maxVotes: 1 },
  { id: "p3", name: "Secretary", description: "Records and communications", maxVotes: 1 },
  { id: "p4", name: "Treasurer", description: "Financial oversight", maxVotes: 1 },
  { id: "p5", name: "PRO", description: "Public relations officer", maxVotes: 1 },
  { id: "p6", name: "Organizing Secretary", description: "Coordinates events", maxVotes: 1 },
];

export const elections: Election[] = [
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
    id: "e3",
    name: "Hostel Governor Elections",
    description: "Election of hostel governors for 2025/26 session.",
    type: "By-Election",
    status: "closed",
    startDate: "2026-05-01T08:00:00Z",
    endDate: "2026-05-05T20:00:00Z",
    positionIds: ["p1", "p2"],
    totalEligible: 1800,
    votesCast: 1640,
  },
];

const candidateNames: Record<string, string[]> = {
  p1: ["Amara Okafor", "Daniel Mensah", "Fatima Bello"],
  p2: ["Kwame Boateng", "Chioma Eze"],
  p3: ["Ifeoma Nwosu", "Kojo Asante", "Linda Adams"],
  p4: ["Yusuf Idris", "Grace Owusu"],
  p5: ["Esi Quartey", "Tunde Akin", "Ama Serwaa"],
  p6: ["Nana Akoto", "Zainab Musa"],
};

export const candidates: Candidate[] = Object.entries(candidateNames).flatMap(
  ([positionId, names]) =>
    names.map((name, i) => ({
      id: `c-${positionId}-${i}`,
      name,
      positionId,
      electionId: "e1",
      bio: `Dedicated student leader with a track record of organizing campus initiatives, advocating for student welfare, and driving real change.`,
      campaignMessage: `A vote for ${name.split(" ")[0]} is a vote for transparency, progress, and unity on our campus.`,
      photo: avatar(name),
      votes: Math.floor(200 + Math.random() * 2200),
    })),
);

const departments = ["Computer Science", "Business Admin", "Engineering", "Law", "Medicine", "Arts"];
const faculties = ["Science", "Business", "Engineering", "Law", "Health Sciences", "Humanities"];
const levels = ["100", "200", "300", "400", "500"];
const firstNames = ["Ada", "Tunde", "Kwesi", "Aisha", "Chinedu", "Esi", "Bola", "Nadia", "Yaw", "Funke", "Sade", "Kojo"];
const lastNames = ["Okeke", "Mensah", "Adeyemi", "Boateng", "Bello", "Owusu", "Nwankwo", "Asare", "Eze", "Quaye"];

export const voters: Voter[] = Array.from({ length: 120 }, (_, i) => {
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

export const auditLogs: AuditLog[] = Array.from({ length: 40 }, (_, i) => {
  const actions: AuditLog["action"][] = ["LOGIN", "VOTE", "CREATE", "UPDATE", "DELETE"];
  const action = actions[i % actions.length];
  return {
    id: `log-${i}`,
    timestamp: new Date(Date.now() - i * 13 * 60000).toISOString(),
    user: voters[i % voters.length].name,
    role: i % 6 === 0 ? "admin" : "voter",
    action,
    entity: action === "VOTE" ? "Election e1" : action === "LOGIN" ? "Auth" : "Position p3",
    ip: `196.${i % 255}.${(i * 3) % 255}.${(i * 7) % 255}`,
    details: `${action} performed successfully`,
  };
});

export const notifications: AppNotification[] = [
  { id: "n1", type: "info", title: "Election starts soon", message: "Student Union Elections opens in 2 hours.", time: "2h ago", read: false },
  { id: "n2", type: "success", title: "Vote recorded", message: "Your vote for President has been recorded.", time: "1d ago", read: false },
  { id: "n3", type: "warning", title: "Profile incomplete", message: "Please add a phone number to your profile.", time: "3d ago", read: true },
  { id: "n4", type: "alert", title: "New login detected", message: "Sign-in from Chrome on Windows.", time: "5d ago", read: true },
  { id: "n5", type: "info", title: "Faculty Council scheduled", message: "Mark your calendar for July 10.", time: "1w ago", read: true },
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
