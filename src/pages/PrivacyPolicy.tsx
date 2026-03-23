import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-300 pb-12">
      <div className="border-b border-slate-800/60 pb-6">
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: March 22, 2026</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-100">1. Information We Collect</h2>
          </div>
          <p className="leading-relaxed text-slate-400">
            At EdgeTrade, we collect information that you provide directly to us when you create an account, verify your identity, or interact with our trading terminal. This includes your email address, trading activity, and portfolio metrics. We also collect automated data such as IP addresses and browser fingerprints to ensure the security and integrity of our platform.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <Database className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-100">2. How We Use Your Data</h2>
          </div>
          <p className="leading-relaxed text-slate-400">
            Your data is primarily used to provide, maintain, and improve our services. We use your trading history to calculate your Edge, PnL, and provide personalized analytics. We may also use aggregated, anonymized data for market research and algorithmic model training. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <Lock className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-100">3. Data Security</h2>
          </div>
          <p className="leading-relaxed text-slate-400">
            We implement industry-standard security measures to protect your personal information and trading data. All sensitive data is encrypted at rest and in transit. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <Eye className="w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-100">4. Your Rights</h2>
          </div>
          <p className="leading-relaxed text-slate-400">
            Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. You can manage your account settings directly within the EdgeTrade terminal or contact our support team for assistance with data privacy requests.
          </p>
        </section>
      </div>

      <div className="mt-12 p-6 bg-slate-900/40 border border-slate-800/60 rounded-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-2">Contact Us</h3>
        <p className="text-sm text-slate-400">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@edgetrade.io" className="text-indigo-400 hover:underline">privacy@edgetrade.io</a>.
        </p>
      </div>
    </div>
  );
}
