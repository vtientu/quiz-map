import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 text-lg"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-red-800 text-red-800 hover:bg-red-50 px-8 py-4 text-lg"
              >
                Đăng ký
              </Button>
            </Link>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
