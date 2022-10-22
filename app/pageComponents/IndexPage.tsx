export default function IndexPage() {
  return (
    <div className="l-center">
      <header className="l-box pb-s1">
        <h1>Do You Like Graphs?</h1>
      </header>
      <main className="l-stack recursive space-s0">
        <ul>
          <li>
            <a href="/github/pull-request-frequency">
              GitHub Pull Request Frequency
            </a>
          </li>
          <li>
            <a href="/github/pull-request-over-time">
              GitHub Pull Requests Over Time
            </a>
          </li>
          <li>
            <a href="/github/reviewer-preference">
              GitHub Reviewer Preference
            </a>
          </li>
          <li>
            <a href="/github/review-requesters">
              GitHub Review Requesters
            </a>
          </li>
          <li>
            <a href="/github/time-to-merge">
              GitHub Pull Request Time To Merge
            </a>
          </li>
          <li>
            <a href="/github/time-to-first-review">
              GitHub Pull Request Time To First Review
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}
