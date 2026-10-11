export const site = {
  name: 'Syed Ali Hussain',
  title: 'DevOps Engineer',
  location: 'Rawalpindi, Pakistan',
  url: 'https://syedalihussain.dev',
  email: 'ali@syedalihussain.dev',
  github: 'https://github.com/frenzyali',
  linkedin: 'https://www.linkedin.com/in/alihussaindevops/',
  cv: '/cv/Syed-Ali-Hussain-CV.pdf',
  summary:
    'I run AWS infrastructure, CI/CD and monitoring for a multi-service SaaS; I cut its AWS bill by 53% and deploys from 12 to 4 minutes.',
  description:
    'Syed Ali Hussain, DevOps Engineer in Rawalpindi, Pakistan. AWS, Docker, GitHub Actions, Terraform, Prometheus and Grafana. Cut a SaaS AWS bill by 53% and deploy time from 12 to 4 minutes.',
};

/** Page sections in order; the numbers show in the nav and the section headings. */
export const sections = [
  { id: 'about', n: '01', title: 'About' },
  { id: 'experience', n: '02', title: 'Experience' },
  { id: 'projects', n: '03', title: 'Projects' },
  { id: 'education', n: '04', title: 'Education' },
  { id: 'skills', n: '05', title: 'Skills' },
  { id: 'contact', n: '06', title: 'Contact' },
] as const;
