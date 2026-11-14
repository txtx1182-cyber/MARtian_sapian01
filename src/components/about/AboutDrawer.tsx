import React from "react";
import { Drawer } from "../common/Drawer";
import { useAppStore } from "../../store/useAppStore";
import { SCIENTIFIC_STATEMENT, APP_NAME } from "../../lib/constants";
import { ShieldCheck, AlertTriangle, BookOpen, Layers, CheckCircle2 } from "lucide-react";

export const AboutDrawer: React.FC = () => {
  const { aboutOpen, openAbout } = useAppStore();

  return (
    <Drawer
      isOpen={aboutOpen}
      onClose={() => openAbout(false)}
      title={`About ${APP_NAME}`}
      subtitle="Scientific methodology, data sources, uncertainty framework, and operational rules"
      widthClass="max-w-3xl"
    >
      <div className="space-y-6 text-xs text-text/90 leading-relaxed font-body">
        {/* Core Scientific Statement Banner */}
        <div className="p-4 rounded-xl bg-accent-soft border-2 border-accent/60 space-y-2">
          <div className="flex items-center gap-2 text-accent font-bold text-sm font-display">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>The Scientific Position</span>
          </div>
          <blockquote className="text-xs text-text font-medium italic border-l-2 border-accent pl-3 leading-relaxed">
            "{SCIENTIFIC_STATEMENT}"
          </blockquote>
        </div>

        {/* What this is & What this is not */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-2">
            <h3 className="font-display font-semibold text-sm text-text flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>What This Is</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted text-[11px]">
              <li>A local-scale, evidence-first science map of Jezero Crater.</li>
              <li>Nine documented science targets with qualitative assessments.</li>
              <li>Full traceability to peer-reviewed literature and NASA PDS data.</li>
              <li>A fixed science traverse (R1) with authentic rover telemetry.</li>
              <li>Visible counter-evidence and explicit uncertainty disclosure.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-2">
            <h3 className="font-display font-semibold text-sm text-text flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span>What This Is Not</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-muted text-[11px]">
              <li>NOT confirmed Martian life or proof of biology.</li>
              <li>NOT a human-rated route or safety certification.</li>
              <li>NOT a global Mars atlas or arbitrary route generator.</li>
              <li>NOT a real-time radiation or weather monitoring feed.</li>
              <li>NOT an ungrounded composite ranking.</li>
            </ul>
          </div>
        </div>

        {/* Why Jezero Crater */}
        <div className="p-4 rounded-xl bg-surface-2/40 border border-border space-y-2">
          <h3 className="font-display font-semibold text-sm text-text">Why Jezero Crater?</h3>
          <p className="text-xs text-muted leading-relaxed">
            Jezero combines an ancient delta and lake system, crater-floor igneous rocks (Séítah,
            Máaz), carbonate-bearing units (Margin Unit), altered phyllosilicates, and extensive
            ground-truth observations from the Perseverance rover. It represents one of the most
            thoroughly documented geological terrains on Mars.
          </p>
        </div>

        {/* The Four Independent Assessments */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-sm text-text flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-accent" />
            <span>The Four Assessment Dimensions</span>
          </h3>
          <p className="text-xs text-muted">
            The application maintains strict separation between four qualitative dimensions. They are
            never collapsed into a single composite score in the default view:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-surface-2 border border-[#5CC8D7]/30">
              <span className="font-mono text-cyan text-[11px] font-bold block mb-1 uppercase">
                1. Habitability Potential
              </span>
              <p className="text-[11px] text-muted">
                Evaluates whether past aqueous, chemical, and energetic conditions could have sustained
                microbial life.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-[#A78BFA]/30">
              <span className="font-mono text-violet text-[11px] font-bold block mb-1 uppercase">
                2. Biosignature Evidence
              </span>
              <p className="text-[11px] text-muted">
                Evaluates morphological, chemical, or isotopic features consistent with biogenic
                processes. Capped at "Potential (not confirmed)."
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-[#F2A33A]/30">
              <span className="font-mono text-accent text-[11px] font-bold block mb-1 uppercase">
                3. Scientific Value
              </span>
              <p className="text-[11px] text-muted">
                Evaluates contribution to regional geology, magmatic evolution, impact chronometry, and
                Martian history.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-[#6FCF97]/30">
              <span className="font-mono text-success text-[11px] font-bold block mb-1 uppercase">
                4. Accessibility
              </span>
              <p className="text-[11px] text-muted">
                First-order terrain difficulty and distance from landing. Does NOT imply safety.
              </p>
            </div>
          </div>
        </div>

        {/* Coordinate Frame & Basemap Caveats */}
        <div className="p-4 rounded-xl bg-surface-2/40 border border-border space-y-2">
          <h3 className="font-display font-semibold text-sm text-text">
            Geographic Reference &amp; Basemap Alignment
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-muted text-[11px]">
            <li>
              <strong className="text-text">Coordinate Reference System:</strong> Mars 2000
              planetocentric, equirectangular, positive east.
            </li>
            <li>
              <strong className="text-text">Planetocentric vs Planetodetic:</strong> At Jezero Crater
              (~18.4°N), planetocentric latitude differs from planetodetic by ~0.0984° (~5.8 km). The
              app exclusively uses planetocentric coordinates.
            </li>
            <li>
              <strong className="text-text">Basemap Alignment:</strong> The demo basemap is a 1024 px
              browse image from the USGS Mars 2020 TRN HiRISE orthomosaic (~20 m/px). Alignment is
              approximate. For precision measurement, consult the full 6.9 GB USGS GeoTIFF product
              (0.25 m/px).
            </li>
          </ul>
        </div>

        {/* Primary Scientific Literature */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-sm text-text flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan" />
            <span>Primary Sources &amp; Literature</span>
          </h3>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded bg-surface-2/60 border border-border">
              <strong className="text-text block">Farley et al. (2020) — Space Science Reviews</strong>
              <span className="text-muted">Mars 2020 Mission Overview: Mission architecture, instruments, sampling strategy.</span>
            </div>
            <div className="p-2.5 rounded bg-surface-2/60 border border-border">
              <strong className="text-text block">Farley et al. (2022) — Science</strong>
              <span className="text-muted">Aqueously altered igneous rocks on crater floor: Séítah olivine cumulate, Máaz, grain-boundary carbonates.</span>
            </div>
            <div className="p-2.5 rounded bg-surface-2/60 border border-border">
              <strong className="text-text block">Mangold et al. (2021) — Science</strong>
              <span className="text-muted">Perseverance reveals ancient delta-lake system and energetic flood deposits.</span>
            </div>
            <div className="p-2.5 rounded bg-surface-2/60 border border-border">
              <strong className="text-text block">Hurowitz et al. (2025) — Nature</strong>
              <span className="text-muted">Redox-driven mineral and organic associations in Jezero Crater (Bright Angel / Cheyava Falls).</span>
            </div>
            <div className="p-2.5 rounded bg-surface-2/60 border border-border">
              <strong className="text-text block">Scheller et al. (2024) — Science Advances</strong>
              <span className="text-muted">Inorganic counter-evidence for luminescent signals in Jezero minerals.</span>
            </div>
          </div>
        </div>

        {/* Attribution & Credits */}
        <div className="pt-4 border-t border-border text-[11px] text-dim space-y-1">
          <div>
            Data courtesy of NASA / JPL-Caltech / MSSS / University of Arizona / USGS Astrogeology / ESA.
          </div>
          <div>Built for NASA Space Apps Challenge 2026, Challenge 11: Interplanetary Survival Guide.</div>
        </div>
      </div>
    </Drawer>
  );
};
