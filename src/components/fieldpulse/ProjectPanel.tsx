import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Download,
  FileJson,
  FolderOpen,
  Mail,
  MapPin,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  buildDeskSummary,
  buildPrintHtml,
  buildReadinessPacket,
} from "@/lib/fieldpulse/domain";
import {
  US_JURISDICTION_TEMPLATES,
  US_PRODUCT_NOTICE,
  US_STATES,
} from "@/lib/fieldpulse/jurisdictions";
import {
  buildMailtoHref,
  downloadPack,
  openPrintPacket,
} from "@/lib/fieldpulse/pack";
import { useFieldpulseStore } from "@/lib/fieldpulse/store";
import type {
  ConstructionIndustry,
  ProjectIdentity,
} from "@/lib/fieldpulse/types";
import {
  CONSTRUCTION_INDUSTRIES,
  industryLabel,
} from "@/lib/fieldpulse/schedules";
import {
  CODE_DISCLAIMER,
  resolveAhjCodePack,
} from "@/lib/fieldpulse/codes";
import {
  cycleStalenessMessage,
  resolveStateCodeCycle,
} from "@/lib/fieldpulse/code-cycles";
import { todayYmd } from "@/lib/fieldpulse/gantt";
import { cn } from "@/lib/utils";

export function UsScopeBanner({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[color-mix(in_oklab,var(--color-gold)_22%,var(--color-border))] bg-surface px-3 py-3 sm:px-4",
        compact && "py-2.5",
      )}
    >
      <p className="text-xs font-medium text-gold">
        United States · jobsite board
      </p>
      <p className="mt-1 text-xs leading-relaxed text-fg-muted text-pretty">
        {US_PRODUCT_NOTICE.notCityPortal} {US_PRODUCT_NOTICE.openSource}{" "}
        {US_PRODUCT_NOTICE.later}
      </p>
    </div>
  );
}

function syncFormFromJobsite(jobsite: {
  name: string;
  location: string;
  cityState?: string;
  permitNumber: string;
  permittingOffice: string;
  stateCode?: string;
  captainName?: string;
  notes?: string;
}) {
  return {
    name: jobsite.name,
    location: jobsite.location,
    cityState: jobsite.cityState ?? "",
    permitNumber: jobsite.permitNumber,
    permittingOffice: jobsite.permittingOffice,
    stateCode: jobsite.stateCode ?? "",
    captainName: jobsite.captainName ?? "",
    notes: jobsite.notes ?? "",
  };
}

export function ProjectView() {
  const jobsite = useFieldpulseStore((s) => s.jobsite);
  const updateProject = useFieldpulseStore((s) => s.updateProject);
  const startNewProject = useFieldpulseStore((s) => s.startNewProject);
  const loadDemo = useFieldpulseStore((s) => s.loadDemo);
  const importPackText = useFieldpulseStore((s) => s.importPackText);
  const applyIndustrySchedule = useFieldpulseStore((s) => s.applyIndustrySchedule);
  const setView = useFieldpulseStore((s) => s.setView);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() => syncFormFromJobsite(jobsite));
  const [templateId, setTemplateId] = useState("us-custom");
  const [pendingAction, setPendingAction] = useState<
    null | "blank" | "demo"
  >(null);
  const [industry, setIndustry] = useState<ConstructionIndustry | "">(
    jobsite.industry ?? "",
  );
  const [projectStartDate, setProjectStartDate] = useState(
    jobsite.projectStartDate ?? todayYmd(),
  );
  const [materialsBudget, setMaterialsBudget] = useState(
    jobsite.materialsBudget != null ? String(jobsite.materialsBudget) : "",
  );

  useEffect(() => {
    setForm(syncFormFromJobsite(jobsite));
    setIndustry(jobsite.industry ?? "");
    setProjectStartDate(jobsite.projectStartDate ?? todayYmd());
    setMaterialsBudget(
      jobsite.materialsBudget != null ? String(jobsite.materialsBudget) : "",
    );
    setTemplateId(
      jobsite.stateCode
        ? US_JURISDICTION_TEMPLATES.find((t) => t.stateCode === jobsite.stateCode)
            ?.id ?? "us-custom"
        : "us-custom",
    );
  }, [jobsite.id, jobsite.isDemo, jobsite.updatedAt]);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function identity(): ProjectIdentity {
    const budget = materialsBudget.trim()
      ? Number(materialsBudget)
      : undefined;
    return {
      name: form.name,
      location: form.location,
      cityState: form.cityState || undefined,
      permitNumber: form.permitNumber,
      permittingOffice: form.permittingOffice,
      stateCode: form.stateCode || undefined,
      captainName: form.captainName || undefined,
      notes: form.notes || undefined,
      industry: industry || undefined,
      projectStartDate: projectStartDate || undefined,
      materialsBudget:
        budget != null && !Number.isNaN(budget) ? budget : undefined,
    };
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    const t = US_JURISDICTION_TEMPLATES.find((x) => x.id === id);
    if (!t || id === "us-custom") return;
    setForm((f) => ({
      ...f,
      cityState: t.cityState,
      location: t.locationHint,
      permittingOffice: t.permittingOffice,
      stateCode: t.stateCode,
      permitNumber:
        !f.permitNumber ||
        f.permitNumber.includes("demo") ||
        f.permitNumber === "TBD"
          ? t.permitNumberHint
          : f.permitNumber,
    }));
  }

  function saveIdentity() {
    if (!form.name.trim()) {
      toast.error("Jobsite name is required.");
      return;
    }
    updateProject(identity());
    toast.success("Jobsite saved on this device.");
  }

  function executeBlank() {
    startNewProject({
      name: "My jobsite",
      location: "United States",
      permitNumber: "TBD",
      permittingOffice: "City / County Building Department",
    });
    setPendingAction(null);
    toast.success("Blank jobsite ready — enter your site details and save.");
  }

  function executeDemo() {
    loadDemo();
    setPendingAction(null);
    toast.message("Sample multi-family board loaded.");
    setView("feed");
  }

  function onExport() {
    try {
      downloadPack(useFieldpulseStore.getState().jobsite);
      toast.success("Project pack downloaded (.lpin-jobsite.json).");
    } catch {
      toast.error("Could not download pack.");
    }
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text();
      const result = importPackText(text);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Project pack imported — board updated.");
      setView("feed");
    } catch {
      toast.error("Could not read that file.");
    }
  }

  function onPrint() {
    try {
      const j = useFieldpulseStore.getState().jobsite;
      openPrintPacket(buildPrintHtml(j), `LPIN Suite Jobsite — ${j.name}`);
      toast.message("Print dialog — choose Save as PDF for a file.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Print failed.");
    }
  }

  async function onCopyPacket() {
    try {
      await navigator.clipboard.writeText(
        buildReadinessPacket(useFieldpulseStore.getState().jobsite),
      );
      toast.success("Full readiness packet copied.");
    } catch {
      toast.error("Could not copy.");
    }
  }

  function onEmail() {
    const j = useFieldpulseStore.getState().jobsite;
    window.location.href = buildMailtoHref(j, buildDeskSummary(j));
  }

  return (
    <div className="animate-enter space-y-4 sm:space-y-6">
      <header className="space-y-2">
        <span className="lpin-chip">
          <FolderOpen className="size-3" />
          Jobsite setup · US
        </span>
        <h1 className="font-display text-2xl font-medium tracking-tight text-fg sm:text-3xl">
          Jobsite setup & handoff
        </h1>
        <p className="text-sm text-fg-muted text-pretty">
          Put <strong className="font-medium text-fg">your</strong> project on
          this board — name, permit, and building department. Data stays on this
          device. Export a pack to move the board to another phone or laptop.
        </p>
      </header>

      <UsScopeBanner />

      {jobsite.isDemo ? (
        <div className="rounded-2xl border border-unproven/35 bg-unproven/10 px-4 py-3 text-sm text-fg">
          <p className="font-medium text-unproven">Sample board is loaded</p>
          <p className="mt-1 text-xs text-fg-muted text-pretty">
            Walk the wired lanes, then start a blank jobsite for real work.
            Sample permits are labeled demo so they are never mistaken for a live
            file.
          </p>
          <Button
            type="button"
            className="mt-3 w-full sm:w-auto"
            onClick={() => setPendingAction("blank")}
          >
            <Sparkles />
            Start blank jobsite
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-supported/30 bg-supported/10 px-4 py-3 text-xs text-supported text-pretty">
          Live jobsite board · {jobsite.reports.length} report
          {jobsite.reports.length === 1 ? "" : "s"} ·{" "}
          {jobsite.inspections.length} inspection
          {jobsite.inspections.length === 1 ? "" : "s"}
        </div>
      )}

      {pendingAction ? (
        <div
          className="rounded-2xl border border-disputed/40 bg-disputed/10 p-4"
          role="alertdialog"
          aria-labelledby="confirm-title"
        >
          <p id="confirm-title" className="text-sm font-medium text-fg">
            {pendingAction === "blank"
              ? "Replace the current board with a blank jobsite?"
              : "Reload the sample multi-family board?"}
          </p>
          <p className="mt-1 text-xs text-fg-muted text-pretty">
            {pendingAction === "blank"
              ? "Reports, messages, and inspections on this device will be cleared. Export a pack first if you need a backup."
              : "Any real project data on this device will be replaced by the sample."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() =>
                pendingAction === "blank" ? executeBlank() : executeDemo()
              }
            >
              {pendingAction === "blank"
                ? "Yes — start blank jobsite"
                : "Yes — load sample"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingAction(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <section className="card-lpin space-y-4 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-gold" />
          <h2 className="text-sm font-medium text-fg">Site identity</h2>
        </div>

        {/* Primary: State from full US_STATES */}
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fg-muted">State</span>
          <select
            className="field-input"
            value={form.stateCode}
            onChange={(e) => {
              const code = e.target.value;
              setField("stateCode", code);
              setTemplateId("us-custom");
            }}
          >
            <option value="">— select state —</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
          {US_STATES.find((s) => s.code === form.stateCode)?.note ? (
            <span className="block text-[11px] text-fg-subtle">
              {US_STATES.find((s) => s.code === form.stateCode)!.note}
            </span>
          ) : null}
        </label>

        {/* Secondary: optional city / county starter */}
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fg-muted">
            City / county starter (optional)
          </span>
          <select
            className="field-input"
            value={templateId}
            onChange={(e) => applyTemplate(e.target.value)}
          >
            {US_JURISDICTION_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <span className="block text-[11px] text-fg-subtle">
            Fills building-department name only — not a live city portal. County / muni details stay freeform or user-side.
          </span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fg-muted">Jobsite name</span>
          <input
            className="field-input"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Building name or contract"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fg-muted">
              Site address / location
            </span>
            <input
              className="field-input"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="Street or site description"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fg-muted">City, ST</span>
            <input
              className="field-input"
              value={form.cityState}
              onChange={(e) => setField("cityState", e.target.value)}
              placeholder="Austin, TX"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fg-muted">
              Building permit number
            </span>
            <input
              className="field-input"
              value={form.permitNumber}
              onChange={(e) => setField("permitNumber", e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fg-muted">State code</span>
            <input
              className="field-input"
              value={form.stateCode}
              maxLength={2}
              onChange={(e) => setField("stateCode", e.target.value.toUpperCase())}
              placeholder="TX"
            />
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fg-muted">
            Building / development department (team copy)
          </span>
          <input
            className="field-input"
            value={form.permittingOffice}
            onChange={(e) => setField("permittingOffice", e.target.value)}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fg-muted">
            Superintendent / project lead
          </span>
          <input
            className="field-input"
            value={form.captainName}
            onChange={(e) => setField("captainName", e.target.value)}
            placeholder="Who owns this board on site"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fg-muted">Site notes</span>
          <textarea
            className="field-input"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Shift handoff, laydown yard, access, etc."
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fg-muted">
              Construction industry
            </span>
            <select
              className="field-input"
              value={industry}
              onChange={(e) =>
                setIndustry(e.target.value as ConstructionIndustry | "")
              }
            >
              <option value="">— select type —</option>
              {CONSTRUCTION_INDUSTRIES.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fg-muted">
              Project start date
            </span>
            <input
              type="date"
              className="field-input"
              value={projectStartDate}
              onChange={(e) => setProjectStartDate(e.target.value)}
            />
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-fg-muted">
            Materials budget ceiling (USD, optional)
          </span>
          <input
            className="field-input"
            inputMode="decimal"
            value={materialsBudget}
            onChange={(e) => setMaterialsBudget(e.target.value)}
            placeholder="e.g. 250000"
          />
        </label>
        {industry ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => {
              if (!form.name.trim()) {
                toast.error("Save a jobsite name first.");
                return;
              }
              updateProject(identity());
              applyIndustrySchedule(
                industry as ConstructionIndustry,
                projectStartDate,
              );
              toast.success(
                `Loaded ${industryLabel(industry as ConstructionIndustry)} schedule + materials.`,
              );
            }}
          >
            Save & load industry schedule + materials
          </Button>
        ) : null}

        <Button type="button" className="w-full" size="lg" onClick={saveIdentity}>
          <Save />
          Save jobsite on this device
        </Button>
      </section>

      {(() => {
        const pack = resolveAhjCodePack({
          stateCode: form.stateCode || jobsite.stateCode,
          cityState: form.cityState || jobsite.cityState,
          permittingOffice: form.permittingOffice || jobsite.permittingOffice,
        });
        const cycle = resolveStateCodeCycle(form.stateCode || jobsite.stateCode);
        const cycleNote = cycleStalenessMessage(cycle);
        return (
          <section className="card-lpin space-y-3 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-fg">
              AHJ & code pack (by location)
            </h2>
            <p className="text-xs text-gold font-medium">{pack.label}</p>
            <p className="text-xs text-fg-muted text-pretty">
              {pack.ahjName}
            </p>
            {cycleNote ? (
              <p className="rounded-lg border border-unproven/30 bg-unproven/10 px-3 py-2 text-[11px] text-fg-muted text-pretty">
                {cycleNote}
              </p>
            ) : null}
            <ul className="space-y-1 text-xs text-fg-muted">
              {pack.modelCodes.map((c) => (
                <li key={c}>· {c}</li>
              ))}
            </ul>
            <div className="space-y-2">
              {pack.requirements.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-border bg-surface-1 px-3 py-2"
                >
                  <p className="text-xs font-medium text-fg">{r.title}</p>
                  <p className="text-[11px] text-fg-subtle text-pretty">
                    {r.summary}
                  </p>
                  <p className="mt-1 text-[10px] text-fg-subtle">
                    Hold points: {r.holdPoints.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
            <ul className="space-y-1 text-[11px] text-fg-subtle">
              {pack.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="text-[10px] text-fg-subtle text-pretty">
              {CODE_DISCLAIMER}
            </p>
          </section>
        );
      })()}

      <section className="card-lpin space-y-3 rounded-2xl p-4 sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-medium text-fg">
          <FileJson className="size-4 text-gold" />
          Backup · handoff · open pack
        </h2>
        <p className="text-xs text-fg-muted text-pretty">
          Download a portable pack for another device, or import one from the
          office. Plain JSON — anyone can open it.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onExport}>
            <Download />
            Export pack
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            <Upload />
            Import pack
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json,.lpin-jobsite.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImportFile(f);
              e.target.value = "";
            }}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button type="button" variant="outline" onClick={onPrint}>
            <Printer />
            Print / PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void onCopyPacket()}
          >
            <Camera />
            Copy packet
          </Button>
          <Button type="button" variant="outline" onClick={onEmail}>
            <Mail />
            Email summary
          </Button>
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setPendingAction("blank")}
        >
          <Sparkles />
          Start blank jobsite
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setPendingAction("demo")}
        >
          <RotateCcw />
          Load sample board
        </Button>
      </section>

      <p className="text-[11px] leading-relaxed text-fg-subtle text-pretty">
        One superintendent can run this board on a shared tablet, or each person
        keeps a pack. No login required — works offline after you install the app
        on the home screen.
      </p>
    </div>
  );
}
