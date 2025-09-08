import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Eye, EyeOff, User, Building, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import Navigation from "@/components/Navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState("player");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = formState;

    if (!email || !password) {
      alert("❌ Please enter both email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      alert(`✅ Login Successful as ${activeTab}! Redirecting...`);

      let redirectPath = "/";
      if (activeTab === "player") redirectPath = "/user-dashboard";
      if (activeTab === "owner") redirectPath = "/owner-dashboard";
      if (activeTab === "organizer") redirectPath = "/organizer";

      navigate(redirectPath);
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Login - PadelBook Pakistan</title>
      </Helmet>

      <div className="bg-gradient-to-t from-[#010e1f] to-[#021835] min-h-screen flex items-center justify-center px-4 py-12">
        <Navigation />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold gradient-text mb-2">
                PadelBook
              </h1>
            </Link>
            <p className="text-gray-400">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          <Card className="glass-effect rounded-2xl p-6">
            <Tabs
              defaultValue="player"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="player" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Player
                </TabsTrigger>
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <Building className="h-4 w-4" /> Owner
                </TabsTrigger>
                <TabsTrigger
                  value="organizer"
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" /> Organizer
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <Label htmlFor="login-email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="login-password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formState.password}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          password: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  {loading
                    ? "Signing In..."
                    : `Sign In as ${
                        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                      }`}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
