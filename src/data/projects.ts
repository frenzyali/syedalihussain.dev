// Descriptions state only what each repo's README shows.
export const featured = [
  {
    repo: 'aws-terraform-3tier',
    status: { state: 'pending', label: 'validated in CI, not yet applied' },
    text: 'A 3-tier AWS environment in modular Terraform: a VPC across two availability zones, ALB, Auto Scaling Group and RDS MySQL, with S3 remote state and DynamoDB locking. CI runs fmt, validate, tflint and checkov. It has not yet been applied to a real AWS account.',
    stack: ['Terraform', 'AWS', 'Secrets Manager', 'tflint', 'checkov', 'GitHub Actions'],
  },
  {
    repo: 'observability-stack',
    status: { state: 'ok', label: 'tested in CI' },
    text: 'Prometheus, Alertmanager and Grafana on Docker Compose, with dashboards and alerts as code. All 13 alert rules are unit-tested with promtool, SLO burn-rate alerts follow the Google SRE Workbook, and CI breaks a sample app to prove the alerts fire, route and resolve.',
    stack: ['Prometheus', 'Alertmanager', 'Grafana', 'Docker Compose', 'Python', 'Trivy'],
  },
  {
    repo: 'ansible-linux-hardening',
    status: { state: 'ok', label: 'tested in CI' },
    text: 'Eight idempotent Ansible roles that harden Ubuntu 24.04 and Rocky Linux 9: baseline, SSH, users, firewall, fail2ban, kernel, auditd and updates. Molecule runs every role in CI, plus a scenario proving the SSH lockout guard refuses unsafe configs.',
    stack: ['Ansible', 'Molecule', 'Docker', 'ansible-lint', 'GitHub Actions'],
  },
];

export const earlier = [
  {
    repo: 'reddit-clone-k8s',
    text: 'Next.js app on Kubernetes: a 2-replica Deployment with probes and limits, a NodePort Service and an optional Ingress. kubeconform validates the manifests in CI.',
  },
  {
    repo: 'Automated-Deployment-With-S3-Logs',
    text: 'Dockerized Python app deployed to EC2 by a Jenkins pipeline over SSH, with container logs shipped to S3 hourly by cron.',
  },
];
