import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyStep({ onComplete, onBack }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white shadow-2xl border border-white/20">
      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Shield className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Privacy & Data</h2>
      <p className="text-white/70 text-sm text-center mb-6">
        Before you start, here's a quick summary of how we use your data.
      </p>

      <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm text-white/80 space-y-2">
        <p className="font-semibold text-white">We collect:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Your chat history with the AI Tutor</li>
          <li>Quiz answers and scores</li>
          <li>Learning progress against NESA outcomes</li>
        </ul>
        <p className="mt-3 font-semibold text-white">We never:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Sell your data</li>
          <li>Show you ads</li>
          <li>Share data with third parties for commercial use</li>
        </ul>
        <p className="mt-3">
          You can delete your account and all data at any time in{" "}
          <span className="text-white font-medium">Settings</span>.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer mb-6">
        <div
          onClick={() => setChecked(!checked)}
          className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${
            checked ? "bg-white border-white" : "border-white/60 bg-transparent"
          }`}
        >
          {checked && <span className="text-purple-700 text-xs font-bold">✓</span>}
        </div>
        <span className="text-sm text-white/80">
          I have read and agree to the{" "}
          <Link to="/PrivacyPolicy" className="text-white underline font-medium">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <Button
        onClick={onComplete}
        disabled={!checked}
        className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold py-5 rounded-2xl text-base disabled:opacity-40 mb-3"
      >
        Let's Start Learning! 🚀
      </Button>
      <Button
        onClick={onBack}
        variant="ghost"
        className="w-full text-white/60 hover:text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </Button>
    </div>
  );
}