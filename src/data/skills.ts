import type { IconSlug } from './icons';

interface Skill {
  name: string;
  /** simple-icons slug; tools without one get a text badge (`badge`). */
  icon?: IconSlug;
  badge?: string;
  /** Shown after the name, e.g. the AWS services. */
  detail?: string;
}

const aws: Skill = { name: 'AWS', badge: 'AWS', detail: 'EC2, RDS, S3, Lambda, CloudWatch, SNS' };
const docker: Skill = { name: 'Docker', icon: 'docker' };
const kubernetes: Skill = { name: 'Kubernetes', icon: 'kubernetes' };
const terraform: Skill = { name: 'Terraform', icon: 'terraform' };
const ansible: Skill = { name: 'Ansible', icon: 'ansible' };
const actions: Skill = { name: 'GitHub Actions', icon: 'githubactions', detail: 'incl. self-hosted runners' };
const jenkins: Skill = { name: 'Jenkins', icon: 'jenkins' };
const prometheus: Skill = { name: 'Prometheus', icon: 'prometheus' };
const grafana: Skill = { name: 'Grafana', icon: 'grafana' };
const linux: Skill = { name: 'Linux', icon: 'linux' };
const nginx: Skill = { name: 'Nginx', icon: 'nginx' };
const python: Skill = { name: 'Python', icon: 'python' };

/** The tools in the icon grid, most used first. */
export const core = [aws, docker, kubernetes, terraform, ansible, actions, jenkins, prometheus, grafana, linux, nginx, python];

/** Every skill, grouped; behind "Show all skills". */
export const groups: { name: string; items: Skill[] }[] = [
  { name: 'Cloud', items: [aws, { name: 'Azure', badge: 'AZ' }] },
  {
    name: 'Containers',
    items: [docker, { name: 'Docker Compose', icon: 'docker' }, kubernetes, { name: 'Helm', icon: 'helm' }],
  },
  { name: 'IaC & config', items: [terraform, ansible] },
  { name: 'CI/CD', items: [actions, jenkins] },
  {
    name: 'Observability',
    items: [prometheus, grafana, { name: 'Loki', badge: 'LK' }, { name: 'CloudWatch', badge: 'CW' }],
  },
  {
    name: 'Linux & networking',
    items: [
      { name: 'Ubuntu', icon: 'ubuntu' },
      { name: 'RHEL', icon: 'redhat' },
      { name: 'AlmaLinux', icon: 'almalinux' },
      { name: 'Rocky Linux', icon: 'rocky' },
      nginx,
      { name: 'MikroTik', icon: 'mikrotik' },
      { name: 'Hyper-V', badge: 'HV' },
      { name: 'Active Directory', badge: 'AD' },
    ],
  },
  {
    name: 'Data',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Redis', icon: 'redis' },
    ],
  },
  { name: 'Languages', items: [{ name: 'Bash', icon: 'bash' }, python] },
  {
    name: 'Ways of working',
    items: ['Scrum', 'Agile', 'Kanban', 'Sprint planning', 'Incident response', 'Runbooks', 'Documentation-first'].map(
      (name) => ({ name })
    ),
  },
];
