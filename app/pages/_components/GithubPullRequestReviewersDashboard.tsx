import React from "react";
import AllPullRequests from "./AllPullRequests.tsx";

export default function GithubPullRequestReviewersDashboard({ data }) {
  if (!data) { return null; }
  return (
    <AllPullRequests data={data} />
  );
}
