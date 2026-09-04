export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserSettingsType {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  animationSpeed: "fast" | "normal" | "slow";
  locale: string;
}

export interface ClassItem {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    students: number;
    rounds: number;
  };
  latestRound?: {
    id: string;
    roundNumber: number;
    status: string;
  } | null;
}

export interface StudentItem {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
  selectionCount?: number;
}

export interface RoundDetail {
  id: string;
  classId: string;
  roundNumber: number;
  status: "ACTIVE" | "COMPLETED";
  startedAt: string;
  completedAt: string | null;
  selections: {
    id: string;
    studentId: string;
    selectionOrder: number;
    selectedAt: string;
    student: {
      id: string;
      name: string;
    };
  }[];
}

export interface DrawResponse {
  success: boolean;
  selectedStudent?: {
    id: string;
    name: string;
  };
  selectionOrder?: number;
  roundStatus: "ACTIVE" | "COMPLETED";
  totalStudents: number;
  selectedCount: number;
  remainingCount: number;
  isRoundComplete: boolean;
  error?: string;
}

export interface ExcelPreviewRow {
  rowNumber: number;
  name: string;
  isDuplicate: boolean;
  isValid: boolean;
  notes?: string;
}

export interface ExcelPreviewResponse {
  totalRowsFound: number;
  validStudentsCount: number;
  duplicatesCount: number;
  detectedColumnName: string;
  availableColumns?: string[];
  detectedClassMeta?: string;
  sheetNames: string[];
  selectedSheet: string;
  previewStudents: ExcelPreviewRow[];
  uniqueStudents: string[];
}
