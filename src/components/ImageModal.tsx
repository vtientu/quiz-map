"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  title: string;
  description: string;
};

export default function ImageModal({
  isOpen,
  onClose,
  image,
  title,
  description,
}: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            <Image
              src={image}
              alt={title}
              width={400}
              height={600}
              className="w-full h-96 lg:h-full object-cover rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 py-4">
              <DialogDescription className="text-gray-700 leading-relaxed text-lg">
                {description}
              </DialogDescription>
            </div>

            <DialogFooter>
              <Button onClick={onClose} className="px-6">
                Đóng
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
