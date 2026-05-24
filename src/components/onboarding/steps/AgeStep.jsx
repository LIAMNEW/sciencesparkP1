import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function AgeStep({ onConfirm }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white text-center shadow-2xl border border-white/20">
      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <User className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-3">How old are you?</h2>
      <p className="text-white/70 text-sm mb-8">
        We ask because privacy laws require us to handle younger students' data differently.
      </p>

      <div className="space-y-3">
        <Button
          onClick={() => onConfirm(false)}
          className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold py-5 rounded-2xl text-base"
        >
          I am 13 or older
        </Button>
        <Button
          onClick={() => onConfirm(true)}
          variant="outline"
          className="w-full border-white/40 text-white hover:bg-white/10 font-semibold py-5 rounded-2xl text-base bg-transparent"
        >
          I am under 13
        </Button>
      </div>
    </div>
  );
}