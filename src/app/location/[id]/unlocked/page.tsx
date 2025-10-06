"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { VIETNAM_LOCATIONS, MapLocation } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

export default function LocationUnlockedPage() {
  const params = useParams();
  const router = useRouter();

  const location = useMemo<MapLocation | null>(() => {
    const id = (params?.id as string) || "";
    return VIETNAM_LOCATIONS.find((l) => l.id === id) ?? null;
  }, [params?.id]);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy địa điểm.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/resolve.png')] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Main video */}
          <div className="mx-auto rounded-3xl max-w-lg overflow-hidden shadow relative">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={location.riddle.video}
                title={`${location.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              <span className="text-red-800">{location.riddle.label}</span>
            </h1>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              className="bg-[#C3771D] hover:bg-[#C3771D]/90 text-white"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon /> Quay về bản đồ
            </Button>
            <Button className="bg-[#C3771D] hover:bg-[#C3771D]/90 text-white">
              Thu thập về tem làng nghề
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
