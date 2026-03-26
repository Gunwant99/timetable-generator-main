export type SubjectType = 'Theory' | 'Lab' | 'Project';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type UserRole = 'admin' | 'teacher' | 'student';

export interface Faculty {
  id: string;
  name: string;
  shortCode: string;
  department: string;
  availability: Record<Day, number[]>; // slot indices available per day
  maxHoursPerDay: number;
  email?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: SubjectType;
  semester: number;
  department: string;
  facultyId?: string;
  color?: string;
}

export interface ClassSection {
  id: string;
  sectionName: string;
  semester: number;
  department: string;
  studentStrength: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  type: 'Classroom' | 'Lab';
  building?: string;
}

export interface TimetableEntry {
  id: string;
  day: Day;
  slotIndex: number;
  subjectId: string;
  facultyId: string;
  roomId: string;
  classId: string;
  isLab?: boolean;
  isLocked?: boolean; // Matches the SQL database column for Manual Overrides!
}

export interface TimeSlot {
  index: number;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  label: string;
}

export const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { index: 0, startTime: '09:55', endTime: '10:00', label: '9:00 - 10:00' },
  { index: 1, startTime: '10:00', endTime: '11:00', label: '10:00 - 11:00' },
  { index: 2, startTime: '11:00', endTime: '11:15', label: 'Break', isBreak: true },
  { index: 3, startTime: '11:15', endTime: '12:15', label: '11:15 - 12:15' },
  { index: 4, startTime: '12:15', endTime: '13:15', label: '12:15 - 1:15' },
  { index: 5, startTime: '13:15', endTime: '14:15', label: 'Lunch', isBreak: true },
  { index: 6, startTime: '14:15', endTime: '15:15', label: '2:15 - 3:15' },
  { index: 7, startTime: '15:15', endTime: '16:15', label: '3:15 - 4:15' },

];

export const SUBJECT_COLORS: string[] = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
  '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
];