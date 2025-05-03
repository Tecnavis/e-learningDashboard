import { useState } from "react";
import { Eye, EyeOff, LucideBook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/app/service/userData";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [loginUser, { isLoading: isPosting }] = useLoginUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "" && password.trim() === "") return;

    const logData = {
      email,
      password,
    };
    try {
      const response = await loginUser(logData);
      if (response?.data?.status == 200) {
        localStorage.setItem("admin", JSON.stringify(response?.data));
        setEmail("");
        setPassword("");
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add discussion:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-2 bg-primary rounded-full">
              <LucideBook className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">E-Learning Admin</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-gray-700 bg-gray-800 pl-10 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative pb-4">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="border-gray-700 bg-gray-800 pl-10 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2  hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4  text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPosting}>
                {isPosting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
