import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Camera, Pencil, Heart, ArrowRight } from "lucide-react";
import romanticBg from "@/assets/romantic-bg.jpg";

interface UserDetails {
  name: string;
  gender: "male" | "female" | null;
  age: string;
  status: "relationship" | "married" | null;
  partnerName: string;
  profilePhoto: string | null;
}

interface UserDetailsFormProps {
  onComplete: (details: UserDetails) => void;
  initialDetails?: UserDetails;
}

const UserDetailsForm = ({ onComplete, initialDetails }: UserDetailsFormProps) => {
  const [details, setDetails] = useState<UserDetails>(
    initialDetails || {
      name: "",
      gender: null,
      age: "",
      status: null,
      partnerName: "",
      profilePhoto: null,
    }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDetails({ ...details, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    return (
      details.name.trim() !== "" &&
      details.gender !== null &&
      details.age !== "" &&
      details.status !== null &&
      details.partnerName.trim() !== ""
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onComplete(details);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto py-8"
    >
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${romanticBg})` }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mx-4 w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Tell us about yourself
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create your profile for a personalized experience
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          {/* Profile Photo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div
                className="h-28 w-28 overflow-hidden rounded-full border-4 border-secondary/30 bg-muted"
                onClick={() => fileInputRef.current?.click()}
              >
                {details.profilePhoto ? (
                  <img
                    src={details.profilePhoto}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-transform hover:scale-110"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </motion.div>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Your Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                className="border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-secondary"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={details.gender === "male" ? "royal" : "glass"}
                  onClick={() => setDetails({ ...details, gender: "male" })}
                  className="h-12"
                >
                  Male
                </Button>
                <Button
                  type="button"
                  variant={details.gender === "female" ? "royal" : "glass"}
                  onClick={() => setDetails({ ...details, gender: "female" })}
                  className="h-12"
                >
                  Female
                </Button>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Age
              </label>
              <Input
                type="number"
                placeholder="Enter your age"
                value={details.age}
                onChange={(e) => setDetails({ ...details, age: e.target.value })}
                className="border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-secondary"
                min="18"
                max="100"
              />
            </div>

            {/* Relationship Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Relationship Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={details.status === "relationship" ? "royal" : "glass"}
                  onClick={() => setDetails({ ...details, status: "relationship" })}
                  className="h-12"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  In a Relationship
                </Button>
                <Button
                  type="button"
                  variant={details.status === "married" ? "royal" : "glass"}
                  onClick={() => setDetails({ ...details, status: "married" })}
                  className="h-12"
                >
                  💍 Married
                </Button>
              </div>
            </div>

            {/* Partner Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Partner's Name
              </label>
              <Input
                type="text"
                placeholder="Enter your partner's name"
                value={details.partnerName}
                onChange={(e) =>
                  setDetails({ ...details, partnerName: e.target.value })
                }
                className="border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground focus:border-secondary"
              />
            </div>

            {/* Submit Button */}
            <Button
              variant="gold"
              size="xl"
              className="mt-6 w-full"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              Continue to Lobby
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDetailsForm;