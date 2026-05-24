import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeStep from "./steps/WelcomeStep";
import AgeStep from "./steps/AgeStep";
import ParentConsentStep from "./steps/ParentConsentStep";
import PrivacyStep from "./steps/PrivacyStep";

const ONBOARDING_KEY = "sciencespark_onboarding_complete";

export default function OnboardingGate({ children }) {
  const [done, setDone] = useState(true); // default true to avoid flash
  const [step, setStep] = useState(0);
  const [isUnder13, setIsUnder13] = useState(false);

  useEffect(() => {
    const complete = localStorage.getItem(ONBOARDING_KEY);
    if (!complete) setDone(false);
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setDone(true);
  };

  const handleAgeConfirmed = (under13) => {
    setIsUnder13(under13);
    setStep(under13 ? 2 : 3); // under 13 → parent consent, else → privacy
  };

  if (done) return <>{children}</>;

  const steps = [
    <WelcomeStep key="welcome" onNext={() => setStep(1)} />,
    <AgeStep key="age" onConfirm={handleAgeConfirmed} />,
    <ParentConsentStep key="parent" onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <PrivacyStep key="privacy" onComplete={handleComplete} onBack={() => setStep(isUnder13 ? 2 : 1)} />,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      {/* Step dots */}
      <div className="absolute bottom-8 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === step ? "bg-white w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}