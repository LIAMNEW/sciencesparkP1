import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function ParentConsentStep({ onNext, onBack }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white shadow-2xl border border-white/20">
      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Parental Consent Required</h2>
      <p className="text-white/70 text-sm text-center mb-6">
        Because you are under 13, a parent or guardian must agree before you can use ScienceSpark.
      </p>

      <div className="bg-white/10 rounded-2xl p-4 mb-6 text-sm text-white/80 space-y-2">
        <p>By continuing, a parent or guardian confirms that they:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Have read the Privacy Policy</li>
          <li>Consent to their child using ScienceSpark</li>
          <li>Consent to the collection of educational data (chat history, quiz results, progress) to provide the tutoring service</li>
          <li>Understand data can be deleted at any time via Settings</li>
        </ul>
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
          I am a parent or guardian and I give my consent for this child to use ScienceSpark.
        </span>
      </label>

      <Button
        onClick={onNext}
        disabled={!checked}
        className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold py-5 rounded-2xl text-base disabled:opacity-40 mb-3"
      >
        I Agree — Continue
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