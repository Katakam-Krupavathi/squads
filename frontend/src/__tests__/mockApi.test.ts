import { describe, it, expect } from 'vitest';
import { mockFirstPRService } from '../services/mockApi';

describe('MockFirstPRService', () => {
  it('loads all 5 mock demo repositories', async () => {
    const repos = await mockFirstPRService.getDemoRepositories();
    expect(repos.length).toBe(5);
    const repoNames = repos.map(r => r.summary.full_name);
    expect(repoNames).toContain('chalk/chalk');
    expect(repoNames).toContain('fastapi/fastapi');
    expect(repoNames).toContain('vercel/ms');
    expect(repoNames).toContain('example/broken-build');
    expect(repoNames).toContain('example/unsupported-stack');
  });

  it('runs analysis pipeline through 9 stages for chalk/chalk', async () => {
    const job = await mockFirstPRService.analyzeRepository('https://github.com/chalk/chalk');
    expect(job.status).toBe('INGESTING');
    expect(job.stages.length).toBe(9);
    expect(job.report_id).toBe('chalk-chalk');
    expect(job.metrics_sidebar?.files_inspected).toBe(146);
  });

  it('retrieves chalk/chalk report with beginner and mislabelled issues', async () => {
    const report = await mockFirstPRService.getReport('chalk-chalk');
    expect(report.summary.full_name).toBe('chalk/chalk');
    expect(report.environment.status).toBe('Verified');
    expect(report.ranked_issues.length).toBe(3);

    const beginnerIssue = report.ranked_issues.find(i => i.difficulty.category === 'Genuinely Beginner');
    const mislabelledIssue = report.ranked_issues.find(i => i.difficulty.is_mislabelled);

    expect(beginnerIssue).toBeDefined();
    expect(beginnerIssue?.number).toBe(524);
    expect(beginnerIssue?.difficulty.total_score).toBeLessThanOrEqual(35);

    expect(mislabelledIssue).toBeDefined();
    expect(mislabelledIssue?.number).toBe(491);
    expect(mislabelledIssue?.difficulty.total_score).toBeGreaterThan(65);
    expect(mislabelledIssue?.difficulty.mislabelled_reasons?.length).toBeGreaterThan(0);
  });

  it('retrieves broken build environment with error diagnostics and recommended fix', async () => {
    const report = await mockFirstPRService.getReport('example-broken-build');
    expect(report.environment.status).toBe('Partially Verified');
    expect(report.environment.failure_stage).toBe('build');
    expect(report.environment.error_summary).toContain('Node.js >=22.0.0');
    expect(report.environment.recommended_fix).toContain('nvm use 22');
  });

  it('retrieves unsupported stack scenario', async () => {
    const report = await mockFirstPRService.getReport('example-unsupported-stack');
    expect(report.environment.status).toBe('Unsupported Stack');
    expect(report.environment.error_summary).toContain('Bare-metal');
  });

  it('generates grounded walkthrough with zero hallucinated paths and 6-step plan', async () => {
    const walkthrough = await mockFirstPRService.getWalkthrough('chalk-chalk', 524);
    expect(walkthrough.issue_number).toBe(524);
    expect(walkthrough.grounding_validated).toBe(true);
    expect(walkthrough.files_to_read.length).toBe(3);
    expect(walkthrough.files_to_read[0].path).toBe('source/index.js');
    expect(walkthrough.files_to_read[1].path).toBe('source/utilities.js');
    expect(walkthrough.files_to_read[2].path).toBe('test/nested.test.js');
    expect(walkthrough.contribution_plan.length).toBe(6);
    expect(walkthrough.test_commands.focused_command).toBe('npm test -- nested');
    expect(walkthrough.test_commands.full_suite_command).toBe('npm test');
  });
});
