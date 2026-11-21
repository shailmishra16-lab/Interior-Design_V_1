import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { AskQuestionForm } from '../components/AskQuestionForm';
import { SmartEnquiryForm } from '../components/SmartEnquiryForm';
import { siteConfig } from '../config/siteConfig';
import {
  DEMO_REFERENCE_TODAY,
  demoSyntheticLeads,
  demoSyntheticQueries,
} from '../data/demoDataset';
import type { DemoLeadRecord, DemoQueryRecord } from '../types/studio';

interface DemoStudioPageProps {
  isDemoMode: boolean;
  onToggleDemoMode: (next: boolean) => void;
}

interface HealthState {
  liveSheetsConnected: boolean;
  demoSheetsConnected: boolean;
  secretConfigured: boolean;
}

function formatInrCompact(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function estimateInrFromBudgetBand(budget: string): number {
  if (budget.includes('₹25 lakh+')) return 2_800_000;
  if (budget.includes('₹12–25')) return 1_800_000;
  if (budget.includes('₹6–12')) return 900_000;
  if (budget.includes('₹3–6')) return 450_000;
  return 350_000;
}

export function DemoStudioPage({ isDemoMode, onToggleDemoMode }: DemoStudioPageProps) {
  const [leads, setLeads] = useState<DemoLeadRecord[]>(demoSyntheticLeads);
  const [queries, setQueries] = useState<DemoQueryRecord[]>(demoSyntheticQueries);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'queries' | 'sandbox' | 'setup'>('dashboard');
  const [sandboxForm, setSandboxForm] = useState<'enquiry' | 'query'>('enquiry');
  const [health, setHealth] = useState<HealthState | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok) {
          setHealth({
            liveSheetsConnected: Boolean(data.liveSheetsConnected),
            demoSheetsConnected: Boolean(data.demoSheetsConnected),
            secretConfigured: Boolean(data.secretConfigured),
          });
        }
      })
      .catch(() => {
        setHealth(null);
      });
  }, []);

  // Compute all 14 Automated Business Dashboard KPIs & Distributions
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((l) => l.leadStatus === 'New Lead').length;
    const openLeads = leads.filter(
      (l) => l.leadStatus !== 'Converted' && l.leadStatus !== 'Lost'
    );
    const pendingFollowUps = openLeads.length;
    const overdueFollowUps = openLeads.filter(
      (l) => l.followUpDate && l.followUpDate < DEMO_REFERENCE_TODAY
    ).length;
    const consultationsScheduled = leads.filter(
      (l) => l.leadStatus === 'Consultation Scheduled'
    ).length;
    const quotationsShared = leads.filter(
      (l) => l.leadStatus === 'Quotation Shared'
    ).length;
    const convertedLeads = leads.filter((l) => l.leadStatus === 'Converted').length;
    const lostLeads = leads.filter((l) => l.leadStatus === 'Lost').length;
    const conversionRate = total > 0 ? (convertedLeads / total) * 100 : 0;

    const estimatedPipelineValue = openLeads.reduce(
      (sum, l) => sum + l.estimatedValueInr,
      0
    );
    const actualConvertedValue = leads
      .filter((l) => l.leadStatus === 'Converted')
      .reduce((sum, l) => sum + l.actualConvertedInr, 0);

    const pendingQueries = queries.filter((q) => q.status !== 'Resolved').length;
    const resolvedQueries = queries.filter((q) => q.status === 'Resolved').length;

    // Enquiries by Service
    const serviceCounts = siteConfig.enquiryOptions.requirementsList.map((svc) => ({
      label: svc,
      count: leads.filter((l) => l.requirements.includes(svc)).length,
    }));

    // Budget distribution
    const budgetCounts = siteConfig.enquiryOptions.budgetBands.map((band) => ({
      label: band,
      count: leads.filter((l) => l.budgetBand === band).length,
    }));

    // Monthly trends
    const monthMap = new Map<string, number>();
    for (const l of leads) {
      const m = l.submittedDate.slice(0, 7);
      monthMap.set(m, (monthMap.get(m) || 0) + 1);
    }
    const monthlyTrends = Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }));

    return {
      total,
      newLeads,
      pendingFollowUps,
      overdueFollowUps,
      consultationsScheduled,
      quotationsShared,
      convertedLeads,
      lostLeads,
      conversionRate,
      estimatedPipelineValue,
      actualConvertedValue,
      pendingQueries,
      resolvedQueries,
      serviceCounts,
      budgetCounts,
      monthlyTrends,
    };
  }, [leads, queries]);

  const filteredLeads = useMemo(() => {
    if (statusFilter === 'ALL') return leads;
    if (statusFilter === 'OVERDUE') {
      return leads.filter(
        (l) =>
          l.leadStatus !== 'Converted' &&
          l.leadStatus !== 'Lost' &&
          l.followUpDate < DEMO_REFERENCE_TODAY
      );
    }
    return leads.filter((l) => l.leadStatus === statusFilter);
  }, [leads, statusFilter]);

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-16 lg:px-16 space-y-10">
      {/* Synthetic Demonstration Banner */}
      <div className="border border-[#B69A68] bg-[#FEF9EC] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            <ShieldAlert className="h-4 w-4" />
            <span>Demonstration Environment · Synthetic Sample Data Only</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#252824]">
            Automated Lead Management &amp; Google Sheets Preview
          </h1>
          <p className="text-sm text-[#454843]">
            {siteConfig.developer.demoBannerText} (
            <a
              href={siteConfig.developer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium text-[#252824] hover:text-[#725B2F]"
            >
              ai-business-growth-lab.vercel.app
            </a>
            ). Displays 25 synthetic NCR leads and 10 synthetic customer queries. External email &amp; WhatsApp outreach to fictional customers are strictly disabled.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onToggleDemoMode(!isDemoMode)}
            className={`px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] border transition-colors cursor-pointer ${
              isDemoMode
                ? 'bg-[#626B55] border-[#626B55] text-[#F8F5EF]'
                : 'bg-[#252824] border-[#252824] text-[#F8F5EF]'
            }`}
          >
            {isDemoMode ? 'Site Mode: Demonstration Active' : 'Switch Site Forms to Demo Mode'}
          </button>
          <span className="text-[11px] text-[#454843]">
            {isDemoMode
              ? 'All website form submissions route to Demo Mode'
              : 'Website forms currently route to Live Mode'}
          </span>
        </div>
      </div>

      {/* Honest Google Sheets Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-5 flex items-start gap-3">
          {health?.liveSheetsConnected ? (
            <CheckCircle2 className="h-5 w-5 text-[#626B55] shrink-0 mt-0.5" />
          ) : (
            <Info className="h-5 w-5 text-[#725B2F] shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
              Live Google Sheet Webhook
            </p>
            <p className="mt-1 text-sm font-medium text-[#252824]">
              {health?.liveSheetsConnected ? 'Connected (APPS_SCRIPT_WEBHOOK_URL)' : 'Not Configured (Preview Mode)'}
            </p>
          </div>
        </div>

        <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-5 flex items-start gap-3">
          {health?.demoSheetsConnected ? (
            <CheckCircle2 className="h-5 w-5 text-[#626B55] shrink-0 mt-0.5" />
          ) : (
            <Info className="h-5 w-5 text-[#725B2F] shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
              Demo Google Sheet Webhook
            </p>
            <p className="mt-1 text-sm font-medium text-[#252824]">
              {health?.demoSheetsConnected ? 'Connected (APPS_SCRIPT_DEMO_WEBHOOK_URL)' : 'Not Configured (Local Simulation)'}
            </p>
          </div>
        </div>

        <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-5 flex items-start gap-3">
          <Info className="h-5 w-5 text-[#626B55] shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
              WhatsApp Integration Scope
            </p>
            <p className="mt-1 text-xs text-[#454843]">
              Prefilled WhatsApp links open the user’s WhatsApp app. Conversations do not auto-sync to Google Sheets.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#D8C8B4] pb-4">
        {[
          { id: 'dashboard', label: '01. Executive Dashboard' },
          { id: 'leads', label: `02. Customer Leads (${leads.length})` },
          { id: 'queries', label: `03. Customer Queries (${queries.length})` },
          { id: 'sandbox', label: '04. End-to-End Test Submission' },
          { id: 'setup', label: '05. Google Sheets & Apps Script Setup' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`border px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#252824] bg-[#252824] text-[#F8F5EF]'
                : 'border-[#D8C8B4] bg-[#FCF9F3] text-[#252824] hover:border-[#B69A68]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Enquiries', value: String(stats.total) },
              { label: 'New Leads', value: String(stats.newLeads) },
              { label: 'Pending Follow-Ups', value: String(stats.pendingFollowUps) },
              { label: 'Overdue Follow-Ups', value: String(stats.overdueFollowUps), alert: stats.overdueFollowUps > 0 },
              { label: 'Consultations Scheduled', value: String(stats.consultationsScheduled) },
              { label: 'Quotations Shared', value: String(stats.quotationsShared) },
              { label: 'Converted Leads', value: String(stats.convertedLeads) },
              { label: 'Lost Leads', value: String(stats.lostLeads) },
              { label: 'Conversion Rate', value: `${stats.conversionRate.toFixed(1)}%` },
              { label: 'Active Pipeline Value', value: formatInrCompact(stats.estimatedPipelineValue) },
              { label: 'Actual Converted Value', value: formatInrCompact(stats.actualConvertedValue) },
              { label: 'Pending Queries', value: String(stats.pendingQueries) },
              { label: 'Resolved Queries', value: String(stats.resolvedQueries) },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`border p-5 ${
                  kpi.alert
                    ? 'border-[#ba1a1a]/50 bg-[#ffdad6]/25'
                    : 'border-[#D8C8B4] bg-[#FCF9F3]'
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
                  {kpi.label}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="font-serif text-2xl text-[#252824] tabular-nums">{kpi.value}</p>
                  {kpi.alert && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-[#93000a]">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Action
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enquiries by Service */}
            <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 space-y-4">
              <h2 className="font-serif text-xl text-[#252824]">Enquiries by Service</h2>
              <div className="space-y-3">
                {stats.serviceCounts.map((item) => {
                  const pct = Math.min(100, Math.round((item.count / Math.max(1, stats.total)) * 100));
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#252824]">{item.label}</span>
                        <span className="font-mono tabular-nums text-[#454843]">{item.count}</span>
                      </div>
                      <div className="h-2 bg-[#EBE8E2]">
                        <div className="h-full bg-[#626B55]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget Distribution */}
            <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 space-y-4">
              <h2 className="font-serif text-xl text-[#252824]">Customer Budget Distribution</h2>
              <div className="space-y-3">
                {stats.budgetCounts.map((item) => {
                  const pct = Math.min(100, Math.round((item.count / Math.max(1, stats.total)) * 100));
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#252824]">{item.label}</span>
                        <span className="font-mono tabular-nums text-[#454843]">{item.count}</span>
                      </div>
                      <div className="h-2 bg-[#EBE8E2]">
                        <div className="h-full bg-[#B69A68]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Enquiry Trends */}
            <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 space-y-4">
              <h2 className="font-serif text-xl text-[#252824]">Monthly Enquiry Trends</h2>
              <div className="space-y-3">
                {stats.monthlyTrends.map((m) => {
                  const pct = Math.min(100, Math.round((m.count / Math.max(1, stats.total)) * 100));
                  return (
                    <div key={m.month} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-mono text-[#252824]">{m.month}</span>
                        <span className="font-mono tabular-nums text-[#454843]">{m.count} enquiries</span>
                      </div>
                      <div className="h-2 bg-[#EBE8E2]">
                        <div className="h-full bg-[#252824]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEADS TABLE */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'OVERDUE', 'New Lead', 'Consultation Scheduled', 'Quotation Shared', 'Converted', 'Lost'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`border px-3 py-1.5 text-xs cursor-pointer ${
                  statusFilter === f
                    ? 'border-[#626B55] bg-[#626B55] text-[#F8F5EF]'
                    : 'border-[#D8C8B4] bg-[#FCF9F3] text-[#252824]'
                }`}
              >
                {f === 'ALL' ? 'All Synthetic Leads' : f === 'OVERDUE' ? 'Overdue Follow-Ups' : f}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto border border-[#D8C8B4] bg-[#FCF9F3]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#252824] text-[#F8F5EF] uppercase tracking-[0.08em] text-[10px]">
                  <th className="p-3.5">Lead ID</th>
                  <th className="p-3.5">Client (Synthetic)</th>
                  <th className="p-3.5">Property &amp; Society</th>
                  <th className="p-3.5">Budget Band</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Follow-Up</th>
                  <th className="p-3.5">Est. Value</th>
                  <th className="p-3.5">Designer &amp; Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C8B4]">
                {filteredLeads.map((lead) => {
                  const isOverdue =
                    lead.leadStatus !== 'Converted' &&
                    lead.leadStatus !== 'Lost' &&
                    lead.followUpDate < DEMO_REFERENCE_TODAY;
                  return (
                    <tr key={lead.leadId} className={isOverdue ? 'bg-[#ffdad6]/25' : ''}>
                      <td className="p-3.5 font-mono tabular-nums text-[#252824] whitespace-nowrap">
                        {lead.leadId}
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-[#252824]">{lead.customerName}</p>
                        <p className="text-[#757873] font-mono">{lead.mobileMasked}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="text-[#252824]">{lead.propertyType}</p>
                        <p className="text-[#454843]">{lead.locationSociety}</p>
                      </td>
                      <td className="p-3.5 tabular-nums whitespace-nowrap">{lead.budgetBand}</td>
                      <td className="p-3.5 font-medium whitespace-nowrap">{lead.leadStatus}</td>
                      <td className="p-3.5 font-mono tabular-nums whitespace-nowrap">
                        <span>{lead.followUpDate}</span>
                        {isOverdue && (
                          <span className="block text-[10px] font-semibold text-[#93000a]">
                            OVERDUE
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono tabular-nums whitespace-nowrap">
                        {formatInrCompact(lead.estimatedValueInr)}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <p className="font-medium text-[#252824]">{lead.assignedDesigner}</p>
                        <p className="text-[#454843]">{lead.ownerRemarks}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUERIES TABLE */}
      {activeTab === 'queries' && (
        <div className="overflow-x-auto border border-[#D8C8B4] bg-[#FCF9F3]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#252824] text-[#F8F5EF] uppercase tracking-[0.08em] text-[10px]">
                <th className="p-3.5">Query ID</th>
                <th className="p-3.5">Customer (Synthetic)</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Question</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Resolution Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C8B4]">
              {queries.map((q) => (
                <tr key={q.queryId}>
                  <td className="p-3.5 font-mono tabular-nums whitespace-nowrap">{q.queryId}</td>
                  <td className="p-3.5">
                    <p className="font-medium text-[#252824]">{q.customerName}</p>
                    <p className="font-mono text-[#757873]">{q.contactMasked}</p>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">{q.category}</td>
                  <td className="p-3.5 max-w-md text-[#252824]">{q.question}</td>
                  <td className="p-3.5 font-medium whitespace-nowrap">{q.status}</td>
                  <td className="p-3.5 text-[#454843]">{q.resolutionNotes || 'Awaiting studio review'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: TEST SUBMISSION SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSandboxForm('enquiry')}
              className={`border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] cursor-pointer ${
                sandboxForm === 'enquiry'
                  ? 'border-[#252824] bg-[#252824] text-[#F8F5EF]'
                  : 'border-[#D8C8B4] bg-[#FCF9F3] text-[#252824]'
              }`}
            >
              Test Multi-Step Enquiry
            </button>
            <button
              type="button"
              onClick={() => setSandboxForm('query')}
              className={`border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] cursor-pointer ${
                sandboxForm === 'query'
                  ? 'border-[#252824] bg-[#252824] text-[#F8F5EF]'
                  : 'border-[#D8C8B4] bg-[#FCF9F3] text-[#252824]'
              }`}
            >
              Test Ask a Question
            </button>
          </div>

          {sandboxForm === 'enquiry' ? (
            <SmartEnquiryForm
              mode="demo"
              onSuccessRecord={(rec) => {
                setLeads((prev) => [
                  {
                    leadId: rec.leadId,
                    submittedDate: DEMO_REFERENCE_TODAY,
                    customerName: `${rec.customerName} [Demo Test]`,
                    mobileMasked: 'Test Submission',
                    emailMasked: 'demo-session',
                    propertyType: rec.propertyType,
                    locationSociety: rec.propertyLocation,
                    propertyStatus: rec.propertyStatus,
                    requirements: rec.requirements,
                    budgetBand: rec.estimatedBudget,
                    estimatedValueInr: estimateInrFromBudgetBand(rec.estimatedBudget),
                    actualConvertedInr: 0,
                    leadStatus: 'New Lead',
                    followUpDate: '2026-11-22',
                    assignedDesigner: 'Unassigned',
                    ownerRemarks: rec.persistedToGoogleSheets
                      ? 'Saved to Demo Google Sheet'
                      : 'Preview session simulation (Sheets not connected)',
                    isSynthetic: true,
                  },
                  ...prev,
                ]);
              }}
            />
          ) : (
            <AskQuestionForm
              mode="demo"
              onSuccessRecord={(rec) => {
                setQueries((prev) => [
                  {
                    queryId: rec.queryId,
                    submittedDate: DEMO_REFERENCE_TODAY,
                    customerName: `${rec.customerName} [Demo Test]`,
                    contactMasked: 'Test Submission',
                    category: rec.queryCategory,
                    question: rec.question,
                    status: 'Pending',
                    assignedPerson: 'Unassigned',
                    resolutionNotes: rec.persistedToGoogleSheets
                      ? 'Saved to Demo Google Sheet'
                      : 'Preview session simulation',
                    isSynthetic: true,
                  },
                  ...prev,
                ]);
              }}
            />
          )}
        </div>
      )}

      {/* TAB 5: SETUP GUIDE */}
      {activeTab === 'setup' && (
        <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 md:p-10 space-y-6 text-sm leading-relaxed text-[#454843]">
          <h2 className="font-serif text-2xl text-[#252824]">
            Google Sheets &amp; Vercel Architecture
          </h2>
          <p className="font-mono text-xs bg-[#F0EEE8] border border-[#D8C8B4] p-4 text-[#252824]">
            Website (React + Vite) → Vercel Serverless API (/api/enquiry, /api/query) → Google Apps Script Web App (doPost) → Private Google Sheets (5 Tabs + Charts + Email Triggers)
          </p>
          <ol className="space-y-3 list-decimal pl-5">
            <li>
              <strong>Create Two Separate Google Sheets:</strong> One for your <em>Live Studio</em> and one for your <em>Demonstration Environment</em> so synthetic data never mixes with customer records.
            </li>
            <li>
              <strong>Install Apps Script:</strong> Open <code>Extensions → Apps Script</code> in each Google Sheet and paste the contents of <code>google-apps-script/Code.gs</code> from this repository.
            </li>
            <li>
              <strong>Configure Script Properties:</strong> In Apps Script <code>Project Settings → Script Properties</code>, add <code>WEBHOOK_SECRET</code> (random 32+ char token) and <code>OWNER_EMAIL</code>.
            </li>
            <li>
              <strong>Initialize Tabs &amp; Charts:</strong> Run <code>setupLiveWorkspace()</code> on the Live sheet (or <code>setupDemoWorkspace()</code> on the Demo sheet to auto-populate all 25 synthetic leads + 10 queries + native charts).
            </li>
            <li>
              <strong>Deploy Web App:</strong> Click <code>Deploy → New deployment → Web app</code> (Execute as: <em>Me</em>, Who has access: <em>Anyone</em>) and add the URL to Vercel environment variables as <code>APPS_SCRIPT_WEBHOOK_URL</code> (and <code>APPS_SCRIPT_DEMO_WEBHOOK_URL</code>) plus <code>APPS_SCRIPT_SECRET</code>.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
