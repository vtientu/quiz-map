"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapLocation, normalizeAnswer } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type QuizPanelProps = {
  location: MapLocation | null;
  onClose: () => void;
  onSubmitAnswer: (params: {
    locationId: string;
    questionId: string;
    chosenOptionId: string;
    isCorrect: boolean;
  }) => void;
  answeredQuestionIds?: string[];
  previousAnswer?: string | null;
  isLoggedIn?: boolean;
};

export default function QuizPanel({
  location,
  onClose,
  onSubmitAnswer,
  answeredQuestionIds = [],
  previousAnswer = null,
  isLoggedIn = true,
}: QuizPanelProps) {
  const router = useRouter();
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [riddleChars, setRiddleChars] = useState<string[]>([]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    submitted: string;
  }>(null);

  const nextQuestion = useMemo(() => {
    if (!location) return null;
    // chỉ 1 riddle duy nhất
    return answeredQuestionIds.includes(location.riddle.id)
      ? null
      : location.riddle;
  }, [location, answeredQuestionIds]);

  const riddleSource = useMemo(() => {
    return location?.riddle ?? null;
  }, [location]);

  const riddleLength = useMemo(() => {
    if (!riddleSource) return 0;
    return normalizeAnswer(riddleSource.answer).length;
  }, [riddleSource]);

  useEffect(() => {
    // reset khi đổi location/câu hỏi
    setSelectedOptionId("");
    setFeedback(null);
    if (riddleSource) {
      const initial = Array.from({ length: riddleLength }, (_, i) =>
        previousAnswer ? previousAnswer[i] || "" : ""
      );
      setRiddleChars(initial);
      inputsRef.current = Array.from({ length: riddleLength }, () => null);
    } else {
      setRiddleChars([]);
      inputsRef.current = [];
    }
  }, [location?.id, riddleSource, riddleLength, previousAnswer]);

  const isAnswered = Boolean(previousAnswer);
  const previouslyCorrect = useMemo(() => {
    if (!previousAnswer || !location) return false;
    return (
      normalizeAnswer(previousAnswer) ===
      normalizeAnswer(location.riddle.answer)
    );
  }, [previousAnswer, location]);

  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-fit min-w-lg bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{location.name}</h3>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!isLoggedIn && location ? (
          <div className="text-center space-y-4">
            <p className="text-gray-800 font-medium">
              Bạn cần đăng nhập để làm quiz và lưu tiến trình.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              <Button onClick={() => router.push("/login")}>Đăng nhập</Button>
            </div>
          </div>
        ) : riddleSource ? (
          <div>
            {
              <>
                <p className="text-2xl font-bold text-center mb-2">
                  Giải mã để mở khóa
                </p>
                <div className="text-center text-gray-700 mb-4">
                  {riddleSource.prompt}
                </div>
                <div className="flex items-center justify-center gap-3 mb-3">
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
                        if (val && idx < riddleChars.length - 1) {
                          inputsRef.current[idx + 1]?.focus();
                        }
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
                      onPaste={(e) => {
                        if (isAnswered) return;
                        const text = e.clipboardData.getData("text");
                        if (!text) return;
                        e.preventDefault();
                        const chars = normalizeAnswer(text)
                          .split("")
                          .slice(0, riddleChars.length);
                        const next = [...riddleChars];
                        for (let i = 0; i < chars.length; i++) {
                          const pos = idx + i;
                          if (pos < next.length) next[pos] = chars[i];
                        }
                        setRiddleChars(next);
                        const focusPos = Math.min(
                          idx + chars.length,
                          riddleChars.length - 1
                        );
                        inputsRef.current[focusPos]?.focus();
                      }}
                      maxLength={1}
                      className="w-14 h-14 text-center text-2xl rounded-xl border bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  ))}
                </div>
                {isAnswered && previouslyCorrect && (
                  <div className="mb-3 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      ✓ Bạn đã trả lời đúng và mở khóa địa điểm này
                    </span>
                  </div>
                )}
                <div className="flex justify-center">
                  <Button
                    className="px-8"
                    disabled={isAnswered}
                    onClick={() => {
                      if (isAnswered) return;
                      const input = normalizeAnswer(riddleChars.join(""));
                      const isCorrect =
                        input === normalizeAnswer(riddleSource.answer);
                      setFeedback({ correct: isCorrect, submitted: input });
                      if (isCorrect) {
                        onSubmitAnswer({
                          locationId: location.id,
                          questionId: riddleSource.id,
                          chosenOptionId: input,
                          isCorrect,
                        });
                        setRiddleChars(
                          Array.from({ length: riddleLength }, () => "")
                        );
                      }
                    }}
                  >
                    {isAnswered ? "Đã mở khóa" : "Mở khóa"}
                  </Button>
                </div>
                {feedback && (
                  <div className="mt-4 text-center">
                    {feedback.correct ? (
                      <p className="text-green-700 font-medium">
                        Chính xác! Bạn đã mở khóa địa điểm.
                      </p>
                    ) : (
                      <p className="text-red-700 font-medium">
                        Chưa đúng, hãy thử lại.
                      </p>
                    )}
                  </div>
                )}
              </>
            }
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-700 font-medium">Bạn đã hoàn thành!</p>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        )}
      </div>
    </div>
  );
}
