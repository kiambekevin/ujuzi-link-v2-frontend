import { useMemo, useState } from "react";
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Info,
  MapPin,
  Users,
} from "lucide-react";
import { downloadReport, errorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Spinner } from "../../components/ui";
import { KENYA_COUNTIES } from "../../lib/constants";
import "./Reports.css";

/* ------------------------------------------------------------------ */
/* Report catalogue                                                    */
/* ------------------------------------------------------------------ */
const REPORTS = [
  {
    key: "trainee",
    label: "Trainee registrations",
    desc: "Sign-ups, demographics and profile completeness",
    icon: Users,
  },
  {
    key: "organizations",
    label: "Organisations",
    desc: "Registered employers, verification and status",
    icon: Building2,
  },
  {
    key: "opportunities",
    label: "Opportunities",
    desc: "Adverts, places available and county spread",
    icon: Briefcase,
  },
  {
    key: "applications",
    label: "Applications",
    desc: "All applications with current statuses",
    icon: ClipboardList,
  },
  {
    key: "placements",
    label: "Placements",
    desc: "Active, extended and completed placements",
    icon: GraduationCap,
  },
  {
    key: "passport",
    label: "Passport records",
    desc: "Verified experience, skills and certificates",
    icon: Award,
  },
];

const FORMATS = [
  { value: "csv", label: "CSV", icon: FileText, hint: "Universal, opens in Excel/Sheets" },
  { value: "xlsx", label: "Excel", icon: FileSpreadsheet, hint: "Formatted workbook" },
];

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */
export default function Reports() {
  const toast = useToast();
  const [report, setReport] = useState("opportunities");
  const [format, setFormat] = useState("csv");
  const [county, setCounty] = useState("");
  const [downloading, setDownloading] = useState(false);

  const activeReport = useMemo(
    () => REPORTS.find((r) => r.key === report) || REPORTS[0],
    [report]
  );
  const activeFormat = useMemo(
    () => FORMATS.find((f) => f.value === format) || FORMATS[0],
    [format]
  );

  const filename = `ujuzi_${report}${
    county ? `_${county.toLowerCase().replace(/\s+/g, "_")}` : ""
  }.${format}`;

  const download = async () => {
    const params = new URLSearchParams({ report, format });
    if (county) params.set("county", county);
    setDownloading(true);
    try {
      await downloadReport(params.toString(), `ujuzi_${report}`);
      toast.success(`${activeReport.label} report downloaded.`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="arpt-header">
        <div>
          <h2>Reports &amp; exports</h2>
          <p className="arpt-header-sub">
            Generate monitoring and evaluation extracts for any dataset on the
            platform. Exports reflect the data at the moment of download.
          </p>
        </div>
      </header>

      <div className="arpt-grid">
        {/* ---------- Left: picker ---------- */}
        <section className="arpt-panel">
          <div className="arpt-panel-head">
            <h4>
              <ClipboardList size={17} strokeWidth={2.25} /> Choose a report
            </h4>
          </div>

          <div className="arpt-reports">
            {REPORTS.map((r) => {
              const Icon = r.icon;
              const active = report === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  className={`arpt-report${active ? " active" : ""}`}
                  onClick={() => setReport(r.key)}
                >
                  <div className="arpt-report-icon">
                    <Icon size={16} strokeWidth={2.25} />
                  </div>
                  <div className="arpt-report-info">
                    <div className="arpt-report-title">{r.label}</div>
                    <div className="arpt-report-desc">{r.desc}</div>
                  </div>
                  <CheckCircle2
                    className="arpt-report-check"
                    size={16}
                    strokeWidth={2.5}
                  />
                </button>
              );
            })}
          </div>

          <div className="arpt-field">
            <span className="arpt-field-label">County filter</span>
            <select
              className="input"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            >
              <option value="">All counties</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="arpt-field-hint">
              Optional - limits rows to records associated with this county.
            </span>
          </div>
        </section>

        {/* ---------- Right: download + about ---------- */}
        <section className="arpt-panel">
          <div className="arpt-panel-head">
            <h4>
              <Download size={17} strokeWidth={2.25} /> Download
            </h4>
          </div>

          <div className="arpt-field">
            <span className="arpt-field-label">Format</span>
            <div className="arpt-format">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.value}
                    type="button"
                    className={`arpt-format-btn${
                      format === f.value ? " active" : ""
                    }`}
                    onClick={() => setFormat(f.value)}
                  >
                    <Icon size={15} strokeWidth={2.25} /> {f.label}
                  </button>
                );
              })}
            </div>
            <span className="arpt-field-hint">{activeFormat.hint}</span>
          </div>

          <div className="arpt-summary">
            <div className="arpt-summary-row">
              <span className="arpt-summary-label">
                <ClipboardList size={12} strokeWidth={2.5} /> Report
              </span>
              <span className="arpt-summary-value">{activeReport.label}</span>
            </div>
            <div className="arpt-summary-row">
              <span className="arpt-summary-label">
                <FileText size={12} strokeWidth={2.5} /> Format
              </span>
              <span className="arpt-summary-value">
                {activeFormat.label.toUpperCase()}
              </span>
            </div>
            <div className="arpt-summary-row">
              <span className="arpt-summary-label">
                <MapPin size={12} strokeWidth={2.5} /> County
              </span>
              <span className="arpt-summary-value">
                {county || "All counties"}
              </span>
            </div>
            <div className="arpt-summary-row">
              <span className="arpt-summary-label">
                <Download size={12} strokeWidth={2.5} /> Filename
              </span>
              <span className="arpt-filename" title={filename}>
                {filename}
              </span>
            </div>
          </div>

          <button
            className="arpt-download"
            onClick={download}
            disabled={downloading}
          >
            {downloading ? (
              <Spinner small />
            ) : (
              <>
                <Download size={15} strokeWidth={2.5} /> Download report
              </>
            )}
          </button>

          <div className="arpt-note">
            <Info size={14} strokeWidth={2.25} />
            <span>
              Exports contain personal data. Handle in line with the Data
              Protection Act, 2019. Do not share outside authorised M&amp;E
              workflows.
            </span>
          </div>
        </section>
      </div>

      {/* ---------- About strip ---------- */}
      <section className="arpt-panel" style={{ marginTop: 20 }}>
        <div className="arpt-panel-head">
          <h4>
            <Info size={17} strokeWidth={2.25} /> About these reports
          </h4>
        </div>
        <ul className="arpt-about-list">
          {REPORTS.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.key} className="arpt-about-item">
                <Icon size={14} strokeWidth={2.25} />
                <div>
                  <strong>{r.label}</strong>
                  <span>{r.desc}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}