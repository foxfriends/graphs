import React, { Fragment } from "react";
import AllPullRequests from "./AllPullRequests.tsx";
import ReviewerPreference from "./ReviewerPreference.tsx";
import ReviewRequesters from "./ReviewRequesters.tsx";

export default function GithubPullRequestReviewersDashboard({ data }) {
  if (!data) { return null; }
  return (
    <div className="dashboard">
      <style>{`
        .dashboard {
          display: grid;
          grid-template:
            "allprs allprs" 300px
            "revprf revreq" auto
          / 1fr     1fr;
          width: 100%;
          height: 100%;
        }

        .all-pull-requests {
          grid-area: allprs;
        }

        .reviewer-preference {
          grid-area: revprf;
        }

        .review-requesters {
          grid-area: revreq;
        }
      `}</style>
      <div className="all-pull-requests">
        <AllPullRequests data={data} />
      </div>
      <div className="reviewer-preference">
        <ReviewerPreference data={data} />
      </div>
      <div className="review-requesters">
        <ReviewRequesters data={data} />
      </div>
    </div>
  );
}
