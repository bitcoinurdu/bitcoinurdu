import JobsClient from '../jobs-client';

export default function UpcomingJobsPage() {
  return <JobsClient defaultFilter="upcoming" />;
}
