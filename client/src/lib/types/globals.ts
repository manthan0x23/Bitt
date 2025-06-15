import {
  FileText,
  ListOrdered,
  MessageCircle,
  BookOpenCheck,
  Hammer,
} from 'lucide-react';

export type FieldError = {
  key: string;
  error: string;
};

// Sections with icons
export const ContestProblemSections = [
  {
    public: false,
    key: 'builder',
    label: 'Builder',
    icon: Hammer,
  },
  {
    public: true,
    key: 'description',
    label: 'Description',
    icon: FileText,
  },
  {
    public: true,
    key: 'testcases',
    label: 'Testcases',
    icon: ListOrdered,
  },
  {
    public: true,
    key: 'discussions',
    label: 'Discussions',
    icon: MessageCircle,
  },
  {
    public: true,
    key: 'editorial',
    label: 'Editorial',
    icon: BookOpenCheck,
  },
] as const;

export type ContestProblemSectionT =
  (typeof ContestProblemSections)[number]['key'];

export type ContestSearchParamsT = {
  topic: number;
  problem: number;
  section: ContestProblemSectionT;
};

