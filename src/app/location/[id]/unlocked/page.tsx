"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { VIETNAM_LOCATIONS, MapLocation } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import ImageModal from "@/components/ImageModal";

export default function LocationUnlockedPage() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

          <div className="flex space-x-5">
            <div>
              <Image
                src={location.riddle.image}
                alt={location.riddle.label}
                width={300}
                height={420}
                className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
            <div className="mx-auto w-full rounded-3xl max-w-3xl overflow-hidden shadow relative">
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
            <div>
              <Image
                src={location.riddle.icon}
                alt={location.riddle.label}
                width={300}
                height={420}
                className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
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
          </div>
        </div>
      </main>
      <Footer />

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        image={location.riddle.image}
        title={location.riddle.label}
        description={location.riddle.description}
      />
    </div>
  );
}
