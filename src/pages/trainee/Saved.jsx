import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { EmptyState, PageLoader, Pagination, useFetch } from "../../components/ui";
import OpportunityCard from "../../components/OpportunityCard";

export default function Saved() {
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(() => api.get(`/opportunities/saved/?page=${page}`), [page]);

  return (
    <div className="page">
      {loading ? (
        <PageLoader />
      ) : data?.count === 0 ? (
        <EmptyState
          icon="fa-bookmark"
          title="Nothing saved yet"
          text="Save opportunities you like and find them here later."
          action={<Link to="/app/opportunities" className="btn btn-primary btn-sm">Browse opportunities</Link>}
        />
      ) : (
        <>
          <p className="small muted mb-16">{data?.count} saved opportunit{data?.count === 1 ? "y" : "ies"}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(data?.results || []).map((item) => (
              <OpportunityCard key={item.opportunity?.id || item.id} opp={item.opportunity || item} />
            ))}
          </div>
          <Pagination page={page} count={data?.count || 0} onPage={setPage} />
        </>
      )}
    </div>
  );
}
