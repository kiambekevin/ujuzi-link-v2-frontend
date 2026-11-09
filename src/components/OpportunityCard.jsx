import { Link } from "react-router-dom";
import { Card, StatusBadge } from "./ui";
import { fmtDate, fmtMoney, labelFor, COMPENSATION_TYPES, WORK_MODES } from "../lib/constants";

export default function OpportunityCard({ opp, linkPrefix = "/app/opportunities" }) {
  const placesLeft = opp.places_available ?? 0;
  return (
    <Card hover pad>
      <div className="row between mb-8" style={{ alignItems: "flex-start" }}>
        <div>
          <h4 style={{ fontSize: "1.05rem" }}>
            <Link to={`${linkPrefix}/${opp.id}`} style={{ color: "inherit" }}>{opp.title}</Link>
          </h4>
          <div className="tiny muted mt-8">
            <i className="fas fa-building" style={{ marginRight: 6 }} />
            {opp.organization?.name}
            {opp.organization?.verified && (
              <span className="badge badge-verified" style={{ marginLeft: 8 }}>
                <i className="fas fa-circle-check" /> Verified
              </span>
            )}
          </div>
        </div>
        {opp.status && opp.status !== "ACTIVE" && <StatusBadge status={opp.status} />}
        {opp.is_closing_soon && <span className="badge badge-amber"><i className="fas fa-clock" /> Closing soon</span>}
      </div>

      <div className="row wrap mt-8" style={{ gap: 8 }}>
        <span className="badge badge-indigo">{opp.type_display || opp.type}</span>
        <span className="badge badge-purple">{opp.work_mode_display || labelFor(WORK_MODES, opp.work_mode)}</span>
        {opp.compensation !== "UNPAID" && (
          <span className="badge badge-green">{opp.compensation_display || labelFor(COMPENSATION_TYPES, opp.compensation)}</span>
        )}
        {opp.stipend_amount && <span className="tiny muted" style={{ alignSelf: "center" }}>{fmtMoney(opp.stipend_amount)}</span>}
      </div>

      {(opp.skills || []).length > 0 && (
        <div className="mt-8" style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {opp.skills.slice(0, 4).map((s) => <span key={s} className="badge badge-neutral">{s}</span>)}
        </div>
      )}

      <div className="row between mt-16 small muted">
        <span><i className="fas fa-location-dot" style={{ marginRight: 6 }} />{opp.county}{opp.location ? `, ${opp.location}` : ""}</span>
        <span><i className="fas fa-calendar" style={{ marginRight: 6 }} />Closes {fmtDate(opp.closing_date)}</span>
      </div>
      <div className="row between mt-8 small">
        <span className="muted">{opp.duration_display || `${opp.duration_value ?? "-"} ${opp.duration_unit ?? ""}`}</span>
        <span className={placesLeft <= 2 ? "bold" : "muted"} style={{ color: placesLeft <= 2 ? "var(--warning)" : undefined }}>
          {placesLeft} of {opp.places_total} places left
        </span>
      </div>

      {opp.match_score != null && (
        <div className="row between mt-16" style={{ borderTop: "1px solid var(--border-light)", paddingTop: 12 }}>
          <div className="small bold" style={{ color: "var(--accent-dark)" }}>
            <i className="fas fa-wand-magic-sparkles" style={{ marginRight: 6 }} />{opp.match_score}% match
          </div>
          {opp.match_reasons?.length > 0 && (
            <details className="tiny">
              <summary className="clickable" style={{ color: "var(--text-muted)" }}>Why this match?</summary>
              <ul className="match-reasons mt-8">
                {opp.match_reasons.map((r) => <li key={r}><i className="fas fa-check" />{r}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}
    </Card>
  );
}
