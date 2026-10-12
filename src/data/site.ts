export const site = {
  name: 'Syed Ali Hussain',
  title: 'DevOps Engineer',
  location: 'Rawalpindi, Pakistan',
  url: 'https://syedalihussain.dev',
  email: 'ali@syedalihussain.dev',
  github: 'https://github.com/frenzyali',
  linkedin: 'https://www.linkedin.com/in/alihussaindevops/',
  cv: '/cv/Syed-Ali-Hussain-CV.pdf',
  availability: 'Open to remote & hybrid roles',
  focus: 'DevOps · Cloud · Infrastructure Engineering',
  summary:
    'Running AWS infrastructure, CI/CD and monitoring for a multi-service SaaS, I cut its AWS bill by ~53% and per-service deploys from 12 to 4 minutes.',
  description:
    'Syed Ali Hussain, DevOps Engineer in Rawalpindi, Pakistan, working in Agile/Scrum teams. AWS, Docker, GitHub Actions, Terraform, Prometheus and Grafana. Cut a SaaS AWS bill by ~53% and per-service deploy time from 12 to 4 minutes. Open to remote & hybrid roles: DevOps · Cloud · Infrastructure Engineering.',
};

/** Page sections in order; `nav` marks the ones linked from the top bar. */
export const sections = [
  { id: 'about', title: 'About', nav: false },
  { id: 'experience', title: 'Experience', nav: true },
  { id: 'projects', title: 'Projects', nav: true },
  { id: 'education', title: 'Education & Certifications', label: 'Education', nav: true },
  { id: 'skills', title: 'Skills', nav: false },
  { id: 'contact', title: 'Contact', nav: true },
] as const;
