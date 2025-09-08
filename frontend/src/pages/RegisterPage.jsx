import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { User, Building, Trophy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [ownerForm, setOwnerForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [organizerForm, setOrganizerForm] = useState({
    name: "",
    email: "",
    phone: "",
    organizationName: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔹 Common register handler
  const handleRegister = async (formData, role) => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const mappedRole = role === "user" ? "player" : role;

      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ...(formData.phone && { phone: formData.phone }),
        role: mappedRole,
        ...(mappedRole === "owner" && {
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
        }),
        ...(mappedRole === "organizer" && {
          organizationName: formData.organizationName,
        }),
      };

      const res = await axios.post(`${API_BASE}/auth/register`, registrationData, {
        withCredentials: true,
      });

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);

        toast({
          title: "Registration Successful!",
          description: "Welcome to PadelBook! Redirecting to your dashboard...",
        });

        let redirectPath = "/";
        if (mappedRole === "player") redirectPath = "/user-dashboard";
        if (mappedRole === "owner") redirectPath = "/owner-dashboard";
        if (mappedRole === "organizer") redirectPath = "/organizer";

        setTimeout(() => navigate(redirectPath), 1000);
      }
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: err.response?.data?.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reusable password field with toggle
  const PasswordField = ({ label, value, onChange, placeholder }) => (
    <div>
      <Label className="text-white">{label}</Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Register - PadelBook Pakistan</title>
        <meta
          name="description"
          content="Join PadelBook Pakistan. Register as a player, court owner, or tournament organizer."
        />
      </Helmet>

      <div className="bg-gradient-to-t from-[#010e1f] to-[#021835] min-h-screen flex items-center justify-center px-4 py-12">
        <Navigation />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <br />
          <br />
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold gradient-text mb-2">PadelBook</h1>
            </Link>
            <p className="text-gray-400">
              Create your account and start your journey!
            </p>
          </div>

          <Card className="glass-effect rounded-2xl p-6">
            <Tabs defaultValue="player" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="player" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Player
                </TabsTrigger>
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <Building className="h-4 w-4" /> Owner
                </TabsTrigger>
                <TabsTrigger value="organizer" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" /> Organizer
                </TabsTrigger>
              </TabsList>

              {/* Player Form */}
              <TabsContent value="player">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister(userForm, "user");
                  }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Full Name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Phone"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  />
                  <PasswordField
                    label="Password"
                    placeholder="Enter password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  />
                  <PasswordField
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={userForm.confirmPassword}
                    onChange={(e) =>
                      setUserForm({ ...userForm, confirmPassword: e.target.value })
                    }
                  />
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register as Player"}
                  </Button>
                </form>
              </TabsContent>

              {/* Owner Form */}
              <TabsContent value="owner">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister(ownerForm, "owner");
                  }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Full Name"
                    value={ownerForm.name}
                    onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={ownerForm.email}
                    onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Phone"
                    value={ownerForm.phone}
                    onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                  />
                  <Input
                    placeholder="Business Name"
                    value={ownerForm.businessName}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, businessName: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Business Address"
                    value={ownerForm.businessAddress}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, businessAddress: e.target.value })
                    }
                    required
                  />
                  <PasswordField
                    label="Password"
                    placeholder="Enter password"
                    value={ownerForm.password}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, password: e.target.value })
                    }
                  />
                  <PasswordField
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={ownerForm.confirmPassword}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, confirmPassword: e.target.value })
                    }
                  />
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register as Court Owner"}
                  </Button>
                </form>
              </TabsContent>

              {/* Organizer Form */}
              <TabsContent value="organizer">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister(organizerForm, "organizer");
                  }}
                  className="space-y-4"
                >
                  <Input
                    placeholder="Full Name"
                    value={organizerForm.name}
                    onChange={(e) =>
                      setOrganizerForm({ ...organizerForm, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={organizerForm.email}
                    onChange={(e) =>
                      setOrganizerForm({ ...organizerForm, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Phone"
                    value={organizerForm.phone}
                    onChange={(e) =>
                      setOrganizerForm({ ...organizerForm, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Organization Name"
                    value={organizerForm.organizationName}
                    onChange={(e) =>
                      setOrganizerForm({ ...organizerForm, organizationName: e.target.value })
                    }
                    required
                  />
                  <PasswordField
                    label="Password"
                    placeholder="Enter password"
                    value={organizerForm.password}
                    onChange={(e) =>
                      setOrganizerForm({ ...organizerForm, password: e.target.value })
                    }
                  />
                  <PasswordField
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={organizerForm.confirmPassword}
                    onChange={(e) =>
                      setOrganizerForm({ ...organizerForm, confirmPassword: e.target.value })
                    }
                  />
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register as Organizer"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
