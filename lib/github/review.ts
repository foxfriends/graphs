export type Review = {
  id: number;
  pullRequestId: number;
  repositoryOwner: string;
  repositoryName: string;
  reviewer: string;
  commentCount: number;
  submittedAt: string;
};
