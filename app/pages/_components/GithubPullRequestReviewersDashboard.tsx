import React, { Fragment } from "react";
import AllPullRequests from "./AllPullRequests.tsx";

export default function GithubPullRequestReviewersDashboard({ data }) {
  if (!data) { return null; }
  return (
    <Fragment>
      <style>{`
        .all-pull-requests {
          width: 100%;
          max-height: 250px;
        }
      `}</style>
      <div className='all-pull-requests'>
        <AllPullRequests data={data} />
      </div>
    </Fragment>
  );
}
