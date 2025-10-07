"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapVietnam from "@/components/MapVietnam";
import { MapLocation, UserQuizProgress, emptyProgress } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );
  const [progress, setProgress] = useState<UserQuizProgress | null>(null);
  const [loading, setLoading] = useState(false);

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

  const completedLocationIds = useMemo(() => {
    if (!progress) return [];
    return Object.keys(progress.locations);
  }, [progress]);

  const answeredOf = (locId: string): string[] =>
    progress?.locations?.[locId]?.answeredQuestionIds ?? [];

  const previousAnswerOf = (locId: string): string | null => {
    const qid = `${locId}-riddle`;
    const ans = progress?.locations?.[locId]?.answers?.[qid];
    return ans ?? null;
  };

  const handleSubmitAnswer = async (params: {
    locationId: string;
    questionId: string;
    chosenOptionId: string;
    isCorrect: boolean;
  }) => {
    if (!user) return;
    if (!params.isCorrect) {
      // Không lưu khi sai để người dùng làm lại
      return;
    }
    const now = Date.now();
    const current = progress ?? emptyProgress();
    const prevLoc = current.locations[params.locationId] ?? {
      answeredQuestionIds: [],
      score: 0,
      answers: {},
    };
    if (prevLoc.answeredQuestionIds.includes(params.questionId)) return;

    const next = {
      ...current,
      locations: {
        ...current.locations,
        [params.locationId]: {
          answeredQuestionIds: [
            ...prevLoc.answeredQuestionIds,
            params.questionId,
          ],
          score: prevLoc.score + (params.isCorrect ? 1 : 0),
          answers: {
            ...(prevLoc.answers || {}),
            [params.questionId]: params.chosenOptionId,
          },
        },
      },
      updatedAt: now,
    } satisfies UserQuizProgress;

    setProgress(next);
    const ref = doc(db, "userQuizProgress", user.uid);
    await updateDoc(ref, {
      [`locations.${params.locationId}.answeredQuestionIds`]:
        next.locations[params.locationId].answeredQuestionIds,
      [`locations.${params.locationId}.score`]:
        next.locations[params.locationId].score,
      [`locations.${params.locationId}.answers.${params.questionId}`]:
        params.chosenOptionId,
      updatedAt: now,
    }).catch(async () => {
      await setDoc(ref, next, { merge: true });
    });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">LC</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Chào mừng đến với <span className="text-red-800">Lang Cham</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Hệ thống quiz tương tác với bản đồ - Học tập thông qua trải nghiệm
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🗺️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bản đồ tương tác
              </h3>
              <p className="text-gray-600">
                Khám phá kiến thức thông qua bản đồ trực quan và sinh động
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quiz thông minh
              </h3>
              <p className="text-gray-600">
                Hệ thống câu hỏi đa dạng giúp củng cố kiến thức hiệu quả
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Theo dõi tiến độ
              </h3>
              <p className="text-gray-600">
                Theo dõi và đánh giá quá trình học tập của bạn
              </p>
            </div>
          </div>
          <div className="mt-16 text-left">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Bản đồ Quiz Việt Nam</h2>
            </div>
            <MapVietnam
              onSelectLocation={(loc) => {
                // Điều hướng sang trang riêng của địa điểm
                setSelectedLocation(null);
                window.location.href = `/location/${loc.id}`;
              }}
              completedLocationIds={completedLocationIds}
            />
            {loading && (
              <p className="mt-4 text-sm text-gray-600">
                Đang tải tiến trình...
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Đã chuyển popup sang trang riêng */}
    </div>
  );
}
