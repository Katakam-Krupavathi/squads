import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RepoInput } from '../components/RepoInput';
import { RankedIssues } from '../components/RankedIssues';
import { VerifiedEnvironment } from '../components/VerifiedEnvironment';
import { MOCK_ANALYSES } from '../mocks/analyses';

describe('Frontend UI Components', () => {
  const chalkAnalysis = MOCK_ANALYSES['chalk/chalk'];

  it('renders RepoInput with hero copy and demo chips', () => {
    const handleAnalyze = () => {};
    render(
      <RepoInput
        onAnalyze={handleAnalyze}
        isLoading={false}
        demoRepos={Object.values(MOCK_ANALYSES)}
      />
    );

    expect(screen.getByText(/Your first open-source PR/i)).toBeDefined();
    expect(screen.getByText(/shouldn't start with guesswork./i)).toBeDefined();
    expect(screen.getByTestId('repo-input')).toBeDefined();
    expect(screen.getByTestId('analyze-button')).toBeDefined();
    expect(screen.getByText('chalk/chalk')).toBeDefined();
    expect(screen.getByText('fastapi/fastapi')).toBeDefined();
  });

  it('renders RankedIssues with Mislabelled Spotlight banner', () => {
    const handleSelect = () => {};
    render(
      <RankedIssues
        issues={chalkAnalysis.ranked_issues}
        onSelectWalkthrough={handleSelect}
      />
    );

    expect(screen.getByText(/Best first contribution opportunities/i)).toBeDefined();
    expect(screen.getByText(/MISLABELLED ISSUE SPOTLIGHT/i)).toBeDefined();
    expect(screen.getByText(/Handle nested color reset correctly/i)).toBeDefined();
    expect(screen.getByText(/Refactor Windows ConHost TTY 24-bit color/i)).toBeDefined();
  });

  it('renders VerifiedEnvironment with execution details and terminal output toggle', () => {
    render(<VerifiedEnvironment environment={chalkAnalysis.environment} />);

    expect(screen.getByText(/Development environment/i)).toBeDefined();
    expect(screen.getByText(/VERIFIED/i)).toBeDefined();
    expect(screen.getAllByText(/npm ci/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/npm run build/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/npm test/i).length).toBeGreaterThan(0);
  });
});
