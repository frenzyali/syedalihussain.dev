// Education and certifications. Shared by the Education section and the JSON-LD in Base.astro.

export const diploma = {
  title: 'Diploma in Artificial Intelligence Operations',
  level: 'EduQual Level 6',
  issuer: 'EduQual (UK regulated awarding organisation)',
  issuerName: 'EduQual',
  school: 'Al Nafi International College',
  start: { iso: '2024-07', label: 'Jul 2024' },
  end: { iso: '2025-10', label: 'Oct 2025' },
  grade: { score: 88, label: 'Distinction' },
  project:
    'Designing a GitOps-Based Multi-Cloud DevSecOps Pipeline for Financial Services Compliance',
  units: [
    'Docker',
    'Kubernetes Admin',
    'Kubernetes App Developer',
    'Kubernetes Security',
    'Ansible',
    'AWS Solution Architecture',
    'Azure Administration',
    'Cloud Security',
    'Python automation',
    'Machine Learning',
    'Deep Learning',
    'Computer Vision',
    'NLP',
  ],
};

export const school = {
  title: 'HSSC (Intermediate), Science General group',
  board: 'Board of Intermediate Education Karachi (BIEK)',
  year: '2025',
  grade: 'Grade A',
};

/** Add `url` (the verification link) once a certification is earned; the card then shows "Verify". */
export const certifications: { title: string; issuer: string; initials: string; logo: string; url?: string }[] = [
  {
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    initials: 'AWS',
    logo: 'aws',
  },
  {
    title: 'Certified Kubernetes Security Specialist (CKS)',
    issuer: 'The Linux Foundation',
    initials: 'LF',
    logo: 'linuxfoundation',
  },
];
