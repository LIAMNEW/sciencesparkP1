import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, Eye, Trash2, Lock, Mail } from "lucide-react";

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
    </div>
    <div className="pl-11 text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: May 2026</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-purple-100 dark:border-gray-700">
            ScienceSpark is an educational app designed for NSW students in Years 7–8. We take your privacy seriously, especially because our users include young learners. This policy explains what we collect, why, and how we protect it.
          </p>
        </div>

        {/* Sections */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-purple-100 dark:border-gray-700">

          <Section icon={Database} title="What Data We Collect">
            <p><strong className="text-gray-800 dark:text-gray-200">Account Information:</strong> Your email address and display name, provided when you register.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Chat History:</strong> Conversations with the AI Tutor, including questions asked and responses received, stored to maintain session continuity.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Quiz Results:</strong> Your answers, scores, and pass/fail outcomes for quizzes you complete.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Learning Progress:</strong> Mastery levels and activity counts mapped to NSW NESA syllabus outcomes.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Usage Data:</strong> Which topics and features you use, to improve the app experience.</p>
          </Section>

          <Section icon={Eye} title="How We Use Your Data">
            <p>• To provide personalised AI tutoring aligned with the NSW Science 7–10 (2023) Syllabus.</p>
            <p>• To track your progress against NESA learning outcomes.</p>
            <p>• To generate quiz recommendations based on your performance.</p>
            <p>• To improve the quality and relevance of educational content.</p>
            <p>We <strong className="text-gray-800 dark:text-gray-200">do not</strong> sell your data, use it for advertising, or share it with third parties for commercial purposes.</p>
          </Section>

          <Section icon={Lock} title="How We Protect Your Data">
            <p>• All data is transmitted over encrypted HTTPS connections.</p>
            <p>• Access to your data is restricted to authenticated sessions only.</p>
            <p>• We do not store payment information (the app is free).</p>
            <p>• Chat conversations with the AI are processed by a third-party AI provider (OpenAI) and are subject to their data handling policies. We do not include personally identifiable information in AI prompts.</p>
          </Section>

          <Section icon={Database} title="Data Retention">
            <p>Your data is retained for as long as your account is active. If you delete your account, all associated data — including chat history, quiz attempts, and progress records — is permanently deleted within 30 days.</p>
          </Section>

          <Section icon={Trash2} title="Your Rights">
            <p>You have the right to:</p>
            <p>• <strong className="text-gray-800 dark:text-gray-200">Access</strong> your personal data at any time via the app.</p>
            <p>• <strong className="text-gray-800 dark:text-gray-200">Delete</strong> your account and all associated data from the Settings page.</p>
            <p>• <strong className="text-gray-800 dark:text-gray-200">Request a copy</strong> of your data by contacting us.</p>
            <p>If you are under 18, a parent or guardian may exercise these rights on your behalf.</p>
          </Section>

          <Section icon={Shield} title="Children's Privacy">
            <p>ScienceSpark is designed for students approximately 12–16 years of age. We do not knowingly collect data from children under 13 without verifiable parental consent. If you believe a child under 13 has registered without consent, please contact us immediately and we will delete their account.</p>
          </Section>

          <Section icon={Mail} title="Contact Us">
            <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at:</p>
            <p className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg font-medium text-purple-700 dark:text-purple-300">
              privacy@sciencespark.app
            </p>
            <p className="mt-2">We will respond within 5 business days.</p>
          </Section>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 text-center">
            This privacy policy applies to the ScienceSpark iOS and web applications. We may update this policy periodically — continued use of the app constitutes acceptance of any changes.
          </div>
        </div>
      </div>
    </div>
  );
}