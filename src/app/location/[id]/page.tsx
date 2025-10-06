"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  VIETNAM_LOCATIONS,
  MapLocation,
  normalizeAnswer,
  UserQuizProgress,
  emptyProgress,
} from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function LocationPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const location = useMemo<MapLocation | null>(() => {
    const id = (params?.id as string) || "";
    return VIETNAM_LOCATIONS.find((l) => l.id === id) ?? null;
  }, [params?.id]);

  const [progress, setProgress] = useState<UserQuizProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [riddleChars, setRiddleChars] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    submitted: string;
  }>(null);

  const riddleLength = useMemo(() => {
    if (!location) return 0;
    return normalizeAnswer(location.riddle.answer).length;
  }, [location]);

  const previousAnswer: string | null = useMemo(() => {
    if (!location) return null;
    const qid = `${location.id}-riddle`;
    const ans = progress?.locations?.[location.id]?.answers?.[qid];
    return ans ?? null;
  }, [location, progress]);

  const isAnswered = Boolean(previousAnswer);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!user) {
        setProgress(null);
        return;
      }
      setLoading(true);
      try {
        const ref = doc(db, "userQuizProgress", user.uid);
        const snap = await getDoc(ref);
        if (!mounted) return;
        if (snap.exists()) setProgress(snap.data() as UserQuizProgress);
        else {
          const base = emptyProgress();
          await setDoc(ref, base);
          setProgress(base);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    // reset inputs khi đổi location hoặc có dữ liệu cũ
    if (!location) return;
    const initial = Array.from({ length: riddleLength }, (_, i) =>
      previousAnswer ? previousAnswer[i] || "" : ""
    );
    setRiddleChars(initial);
    inputsRef.current = Array.from({ length: riddleLength }, () => null);
  }, [location, location?.id, riddleLength, previousAnswer]);

  const handleSubmit = async () => {
    if (!user || !location) return;
    if (isAnswered) return;
    const input = normalizeAnswer(riddleChars.join(""));
    const isCorrect = input === normalizeAnswer(location.riddle.answer);
    setFeedback({ correct: isCorrect, submitted: input });
    if (!isCorrect) return;

    const now = Date.now();
    const questionId = location.riddle.id;
    const current = progress ?? emptyProgress();
    const prevLoc = current.locations[location.id] ?? {
      answeredQuestionIds: [],
      score: 0,
      answers: {},
    };

    if (prevLoc.answeredQuestionIds.includes(questionId)) return;

    const next: UserQuizProgress = {
      ...current,
      locations: {
        ...current.locations,
        [location.id]: {
          answeredQuestionIds: [...prevLoc.answeredQuestionIds, questionId],
          score: prevLoc.score + 1,
          answers: { ...(prevLoc.answers || {}), [questionId]: input },
        },
      },
      updatedAt: now,
    };

    setProgress(next);
    const ref = doc(db, "userQuizProgress", user.uid);
    await updateDoc(ref, {
      [`locations.${location.id}.answeredQuestionIds`]:
        next.locations[location.id].answeredQuestionIds,
      [`locations.${location.id}.score`]: next.locations[location.id].score,
      [`locations.${location.id}.answers.${questionId}`]: input,
      updatedAt: now,
    }).catch(async () => {
      await setDoc(ref, next, { merge: true });
    });

    // Điều hướng tới trang nội dung đã mở khóa
    router.push(`/location/${location.id}/unlocked`);
  };

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy địa điểm.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/banner.png')] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="text-6xl md:text-7xl font-extrabold text-black text-center mb-2">
              Làng Chạm
            </h1>
            <p className="text-center text-2xl md:text-3xl font-bold tracking-wide mb-8">
              BẠN ĐÃ ĐẾN CỔNG LÀNG CHẠM
            </p>

            <div className="mx-auto  bg-amber-400 rounded-3xl p-6 md:p-10 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
                Giải mã để mở khóa
              </h2>

              <div className="bg-amber-50 rounded-2xl p-6 md:p-8 mb-6 text-center">
                <p className="text-gray-800 text-lg md:text-xl">
                  {location.riddle.prompt}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
                {riddleChars.map((ch, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputsRef.current[idx] = el;
                    }}
                    value={ch}
                    disabled={isAnswered}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/[^a-zA-Z0-9]/g, "")
                        .toUpperCase();
                      const next = [...riddleChars];
                      next[idx] = val.slice(-1);
                      setRiddleChars(next);
                      if (val && idx < riddleChars.length - 1)
                        inputsRef.current[idx + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (!isAnswered && e.key === "Backspace") {
                        if (riddleChars[idx]) {
                          const next = [...riddleChars];
                          next[idx] = "";
                          setRiddleChars(next);
                        } else if (idx > 0) {
                          inputsRef.current[idx - 1]?.focus();
                        }
                      }
                    }}
                    maxLength={1}
                    className="w-16 h-16 md:w-20 md:h-20 text-center text-2xl md:text-3xl rounded-2xl border bg-white shadow-inner"
                  />
                ))}
              </div>

              {isAnswered && (
                <div className="mb-3 text-center">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    ✓ Bạn đã mở khóa địa điểm này
                  </span>
                </div>
              )}

              <div className="text-center">
                {isAnswered ? (
                  <Button
                    size="lg"
                    className="px-10 py-6 text-lg font-semibold"
                    onClick={() =>
                      router.push(`/location/${location.id}/unlocked`)
                    }
                  >
                    Thông tin thêm
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="px-10 py-6 text-lg font-semibold"
                    disabled={loading || !user}
                    onClick={handleSubmit}
                  >
                    Mở khóa
                  </Button>
                )}
                {!user && (
                  <p className="mt-3 text-sm text-gray-700">
                    Hãy đăng nhập để lưu tiến trình.
                  </p>
                )}
              </div>

              {feedback && (
                <div className="mt-4 text-center">
                  {feedback.correct ? (
                    <p className="text-green-700 font-medium">
                      Chính xác! Bạn đã mở khóa.
                    </p>
                  ) : (
                    <p className="text-red-700 font-medium">
                      Chưa đúng, hãy thử lại.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
