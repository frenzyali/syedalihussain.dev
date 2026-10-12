// Strings in `points` may wrap tool names in backticks; <Rich> sets them in a heavier weight.
// Other fields are plain text.

interface Reading {
  value: number;
  label: string;
}

interface Month {
  iso: string;
  label: string;
}

export interface Result {
  metric: string;
  before: Reading;
  after: Reading;
  text: string;
}

interface Job {
  org: string;
  role: string;
  location: string;
  start: Month;
  end?: Month;
  lead?: string;
  /** One plain-text line under the role, e.g. how the internship came about. */
  note?: string;
  results?: Result[];
  points: string[];
}

export const aiit = {
  org: 'AIIT Solutions',
  role: 'DevOps Engineer',
  location: 'Islamabad (Hybrid)',
  start: { iso: '2026-01', label: 'Jan 2026' },
  lead: 'I own infrastructure, security and releases for HR360HUB, a multi-service Laravel HRMS SaaS on AWS with dev, UAT and production environments.',
  results: [
    {
      metric: 'Monthly AWS bill',
      before: { value: 425, label: '~$425' },
      after: { value: 200, label: '~$200' },
      text: 'Cut the monthly AWS bill from ~$425 to ~$200 (~53%), including ~$79/month from EC2 and RDS right-sizing.',
    },
    {
      metric: 'Deploy time per service',
      before: { value: 12, label: '12 min' },
      after: { value: 4, label: '4 min' },
      text: 'Cut per-service deploy time from 12 to 4 minutes with dependency and Docker layer caching.',
    },
    {
      metric: 'Recovery time',
      before: { value: 85, label: '1 h 25 min' },
      after: { value: 49, label: '49 min' },
      text: 'Cut recovery time from 1 h 25 min to 49 min with real-time replication, warm read replicas and standbys on AWS.',
    },
  ],
  points: [
    'Work in Scrum: sprint planning, daily stand-ups, reviews and retrospectives, estimating and delivering infrastructure and release work in two-week sprints alongside developers, QA and product.',
    'Replaced cron-driven `git pull` builds, which ran no tests, with CI/CD on `GitHub Actions`. Dockerized the stack and trained the developers on `Docker`.',
    'Set up monitoring and alerting with `CloudWatch` and `SNS`, `Prometheus`, `Grafana` and `Loki`.',
    'Run the on-prem side: `Hyper-V`, `Nginx`, `MikroTik` networking with dual-WAN failover, and `Active Directory`.',
  ],
} satisfies Job;

// The hero tiles and the result lines present every result as a cut ("−53%").
for (const r of aiit.results) {
  if (!(r.after.value >= 0 && r.after.value < r.before.value)) {
    throw new Error(`experience.ts: "${r.metric}" needs 0 <= after < before`);
  }
}

export const internships = [
  {
    org: 'Cloudlem (Pvt.) Ltd',
    role: 'DevOps Intern',
    location: 'Remote',
    start: { iso: '2025-11', label: 'Nov 2025' },
    end: { iso: '2025-12', label: 'Dec 2025' },
    points: [
      'Worked on CI/CD pipeline configuration, system monitoring and version-control workflows in a team environment, improving deployment reliability.',
      'Resolved recurring `Linux` file-permission conflicts between web servers and CI runners using ownership cascades and `umask` configuration, then scripted the fix into the deployment pipeline.',
      'Received a Letter of Recommendation from the Founder & CEO for technical ability, problem-solving and deployment-process improvements.',
    ],
  },
  {
    org: 'Al Nafi International College',
    role: 'DevOps Intern',
    location: 'Remote',
    note: 'Job training programme of the RQF Level 6 Diploma',
    start: { iso: '2024-07', label: 'Jul 2024' },
    end: { iso: '2025-07', label: 'Jul 2025' },
    points: [
      'Hands-on training on the Al Nafi Cloud Platform, a real-world infrastructure simulator, scoring 75–90% on complex lab assessments.',
      'Provisioned reproducible `AWS` infrastructure (EC2, RDS, VPC, S3, IAM) with `Terraform`.',
      'Ran containerised workloads with `Docker`, `Podman` and `Compose`, and troubleshot `Kubernetes` workloads on `AWS EKS` with RBAC and `OPA` policy enforcement.',
      'Linux administration: users and groups, `LVM`, `SELinux`, cron, package management, networking and firewalls.',
      'Deployed a `Prometheus` and `Grafana` monitoring stack; intrusion detection with `Snort` and `Suricata`; centralised logging with `rsyslog`.',
      'Capstones: a `Jenkins`-based `Docker` deployment pipeline with `S3` log archival, and a container-orchestrated web app on `AWS EKS`.',
    ],
  },
] satisfies Job[];

/** Percentage drop from before to after, e.g. "−53%". */
export function change(r: Result): string {
  return `−${Math.round((1 - r.after.value / r.before.value) * 100)}%`;
}
