"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Facebook, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState<"email" | "details">("email");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    gender: "",
    month: "",
    date: "",
    year: "",
    marketingConsent: false,
  });
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes("@")) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }
    setError("");
    setFormStep("details");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: string) => {
    setError("");
    setLoading(true);

    try {
      let result;
      switch (provider) {
        case "google":
          result = await signInWithGoogle();
          break;
        case "facebook":
          result = await signInWithFacebook();
          break;
        default:
          throw new Error("Provider không được hỗ trợ");
      }

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setFormStep("email");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FFF8DB] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Logo */}
          <div className="hidden lg:flex justify-center">
            <div className="text-center">
              <Image
                src="/images/logo.png"
                alt="Lang Cham"
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-xl bg-white">
              <CardHeader className="space-y-1 text-center pb-6">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {formStep === "email"
                    ? "Create an account"
                    : "Complete your profile"}
                </CardTitle>
                <p className="text-gray-600">
                  {formStep === "email" ? (
                    <>
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-red-800 hover:text-red-900 underline font-medium"
                      >
                        Log in
                      </a>
                    </>
                  ) : (
                    <>Step 2 of 2 - Personal information</>
                  )}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Social Login Options - Only show on email step */}
                {formStep === "email" && (
                  <>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => handleSocialRegister("facebook")}
                        className="w-full flex items-center justify-center space-x-3 py-3 border-gray-300"
                        disabled={loading}
                      >
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <span>Continue with Facebook</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleSocialRegister("google")}
                        className="w-full flex items-center justify-center space-x-3 py-3 border-gray-300"
                        disabled={loading}
                      >
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            G
                          </span>
                        </div>
                        <span>Continue with Google</span>
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Step */}
                {formStep === "email" && (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Enter your email address to create an account.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Your email
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full"
                        disabled={loading}
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#FFF8DB] hover:bg-yellow-100 text-red-800 py-3 text-lg font-medium border border-red-800"
                      disabled={loading}
                    >
                      Continue with Email
                    </Button>
                  </form>
                )}

                {/* Details Step */}
                {formStep === "details" && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* Back Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBackToEmail}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back to email</span>
                    </Button>

                    {/* Email Display */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Email:</p>
                      <p className="font-medium text-gray-900">
                        {formData.email}
                      </p>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter your first name"
                          className="w-full"
                          disabled={loading}
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter your last name"
                          className="w-full"
                          disabled={loading}
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        What&apos;s your gender? (optional)
                      </label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                        disabled={loading}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <label
                            htmlFor="female"
                            className="text-sm text-gray-700"
                          >
                            Female
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <label
                            htmlFor="male"
                            className="text-sm text-gray-700"
                          >
                            Male
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-binary" id="non-binary" />
                          <label
                            htmlFor="non-binary"
                            className="text-sm text-gray-700"
                          >
                            Non-binary
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        What&apos;s your date of birth? (optional)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={formData.month}
                          onChange={(e) =>
                            handleInputChange("month", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
                          disabled={loading}
                        >
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={index} value={index + 1}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          value={formData.date}
                          onChange={(e) =>
                            handleInputChange("date", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
                          disabled={loading}
                        >
                          <option value="">Date</option>
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <select
                          value={formData.year}
                          onChange={(e) =>
                            handleInputChange("year", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
                          disabled={loading}
                        >
                          <option value="">Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full pr-20"
                          disabled={loading}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="text-xs">
                            {showPassword ? "Hide" : "Show"}
                          </span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use 8 or more characters with a mix of letters, numbers
                        & symbols
                      </p>
                    </div>

                    {/* Marketing Consent Checkbox */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        checked={formData.marketingConsent}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            "marketingConsent",
                            checked as boolean
                          )
                        }
                        disabled={loading}
                      />
                      <label className="text-xs text-gray-600 leading-relaxed">
                        Share my registration data with our content providers
                        for marketing purposes.
                      </label>
                    </div>

                    {/* Register Button */}
                    <Button
                      type="submit"
                      className="w-full bg-[#FFF8DB] hover:bg-yellow-100 text-red-800 py-3 text-lg font-medium border border-red-800"
                      disabled={loading}
                    >
                      {loading ? "Đang tạo tài khoản..." : "Create Account"}
                    </Button>
                  </form>
                )}

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-red-800 hover:text-red-900 underline font-medium"
                    >
                      Log in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
