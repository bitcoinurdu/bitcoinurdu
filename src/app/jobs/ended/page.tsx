import JobsClient from '../jobs-client';

export default function EndedJobsPage() {
  return <JobsClient defaultFilter="ended" />;
}
