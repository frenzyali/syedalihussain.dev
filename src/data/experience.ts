// Text fields may wrap tool names in backticks; <Rich> renders them in the mono face.

export interface Result {
  metric: string;
  /** Axis unit for the chart. */
  unit: string;
  before: { value: number; label: string };
  after: { value: number; label: string };
  text: string;
}

export interface Job {
  org: string;
  role: string;
  location?: string;
  start: { iso: string; label: string };
  end?: { iso: string; label: string };
  lead?: string;
  results?: Result[];
  points: string[];
}

export const aiit: Job = {
  org: 'AIIT Solutions',
  role: 'DevOps Engineer',
  location: 'Rawalpindi',
  start: { iso: '2026-01', label: 'Jan 2026' },
  lead: 'I own infrastructure, security and releases for HR360HUB, a multi-service Laravel HRMS SaaS on AWS with dev, UAT and production environments.',
  results: [
    {
      metric: 'Monthly AWS bill',
      unit: 'USD',
      before: { value: 425, label: '~$425' },
      after: { value: 200, label: '~$200' },
      text: 'Cut the monthly AWS bill from ~$425 to ~$200 (~53%), including ~$79/month from EC2 and RDS right-sizing — beating projected savings.',
    },
    {
      metric: 'Deploy time per service',
      unit: 'min',
      before: { value: 12, label: '12 min' },
      after: { value: 4, label: '4 min' },
      text: 'Cut per-service deploy time from 12 to 4 minutes with dependency and Docker layer caching.',
    },
    {
      metric: 'Recovery time',
      unit: 'min',
      before: { value: 85, label: '1 h 25 min' },
      after: { value: 49, label: '49 min' },
      text: 'Cut recovery time from 1 h 25 min to 49 min with real-time replication, warm read replicas and standbys on AWS.',
    },
  ],
  points: [
    'Replaced cron-driven `git pull` builds, which ran no tests, with CI/CD on `GitHub Actions`. Dockerized the stack and trained the developers on `Docker`.',
    'Set up monitoring and alerting with `CloudWatch` and `SNS`, `Prometheus`, `Grafana` and `Loki`.',
    'Run the on-prem side: `Hyper-V`, `Nginx`, `MikroTik` networking with dual-WAN failover, and `Active Directory`.',
  ],
};

export const internships: Job[] = [
  {
    org: 'Cloudlem',
    role: 'Internship',
    start: { iso: '2025-11', label: 'Nov 2025' },
    end: { iso: '2025-12', label: 'Dec 2025' },
    points: ['Worked on CI/CD pipeline reliability and Linux file permissions.'],
  },
  {
    org: 'Al Nafi',
    role: 'Internship',
    start: { iso: '2024-07', label: 'Jul 2024' },
    end: { iso: '2025-07', label: 'Jul 2025' },
    points: [
      'Worked with `AWS`, `Terraform`, `Kubernetes` on `EKS`, and `Prometheus` and `Grafana`.',
    ],
  },
];

/** Percentage drop from before to after, e.g. "−53%". */
export const change = (r: Result) =>
  `−${Math.round((1 - r.after.value / r.before.value) * 100)}%`;

/** After as a share of before, as an SVG width, e.g. "47.1%". */
export const share = (r: Result) => `${((r.after.value / r.before.value) * 100).toFixed(1)}%`;

/** Round axis ticks from 0 up to the before value (at most about 5 of them). */
export function ticks(r: Result): { value: number; at: string }[] {
  const max = r.before.value;
  const raw = max / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = ([1, 2, 3, 5, 10].find((m) => m * magnitude >= raw) ?? 10) * magnitude;
  const out = [];
  for (let v = 0; v <= max; v += step) out.push({ value: v, at: `${(v / max) * 100}%` });
  return out;
}
