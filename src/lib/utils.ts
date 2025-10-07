import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==== Quiz Map constants ====
export type RiddleQuestion = {
  id: string;
  prompt: string; // câu đố hiển thị
  answer: string; // đáp án chuẩn hóa, không dấu, không khoảng trắng, upper-case
  label: string; // label hiển thị
  video: string; // video url
  image: string; // image url
  description: string; // description hiển thị
  icon: string; // icon url
};

export type MapLocation = {
  id: string;
  name: string;
  province: string;
  // Percent position over the map container (0..100)
  position: { x: number; y: number };
  riddle: RiddleQuestion;
};

export const VIETNAM_LOCATIONS: MapLocation[] = [
  {
    id: "hn",
    name: "Hà Nội",
    province: "Hà Nội",
    position: { x: 52, y: 20 },
    riddle: {
      id: "hn-riddle",
      prompt: "Tôi là 1 làng nghề ở miền bắc ......",
      answer: "BATTRANG",
      label: "Làng Gốm Bát Tràng",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
      image: "/images/battrang.png",
      description: "Làng Gốm Bát Tràng là một làng nghề ở miền bắc Việt Nam.",
      icon: "/images/battrang.png",
    },
  },
  {
    id: "hue",
    name: "Cố đô Huế",
    province: "Thừa Thiên Huế",
    position: { x: 65, y: 45 },
    riddle: {
      id: "hue-riddle",
      prompt: "Cố đô miền Trung ......",
      answer: "HUE",
      label: "Làng Gốm Hương Thư",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
      image: "/images/battrang.png",
      description: "Làng Gốm Hương Thư là một làng nghề ở miền trung Việt Nam.",
      icon: "/images/battrang.png",
    },
  },
  {
    id: "dn",
    name: "Đà Nẵng",
    province: "Đà Nẵng",
    position: { x: 72, y: 54 },
    riddle: {
      id: "dn-riddle",
      prompt: "Thành phố bên sông Hàn ......",
      answer: "DANANG",
      label: "Làng Gốm Đà Nẵng",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
      image: "/images/battrang.png",
      description: "Làng Gốm Đà Nẵng là một làng nghề ở miền trung Việt Nam.",
      icon: "/images/battrang.png",
    },
  },
  {
    id: "hcm",
    name: "TP. Hồ Chí Minh",
    province: "Hồ Chí Minh",
    position: { x: 60, y: 80 },
    riddle: {
      id: "hcm-riddle",
      prompt: "Thành phố phía Nam ......",
      answer: "SAIGON",
      label: "Làng Gốm Sài Gòn",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
      image: "/images/battrang.png",
      description: "Làng Gốm Sài Gòn là một làng nghề ở miền Nam Việt Nam.",
      icon: "/images/battrang.png",
    },
  },
  {
    id: "ct",
    name: "Cần Thơ",
    province: "Cần Thơ",
    position: { x: 50, y: 85 },
    riddle: {
      id: "ct-riddle",
      prompt: "Tây Đô miền Tây ......",
      answer: "CANTHO",
      label: "Làng Gốm Cần Thơ",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
      image: "/images/battrang.png",
      description: "Làng Gốm Cần Thơ là một làng nghề ở miền Nam Việt Nam.",
      icon: "/images/battrang.png",
    },
  },
];

export type UserQuizProgress = {
  // locationId -> { answeredQuestionIds, score }
  locations: Record<
    string,
    {
      answeredQuestionIds: string[];
      score: number;
      // Lưu đáp án đã chọn theo questionId (ví dụ riddle)
      answers?: Record<string, string>;
    }
  >;
  updatedAt: number;
};

export const emptyProgress = (): UserQuizProgress => ({
  locations: {},
  updatedAt: Date.now(),
});

// Utilities cho riddle: bỏ dấu + khoảng trắng và upper-case
export function normalizeAnswer(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}
