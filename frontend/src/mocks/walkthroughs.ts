import { GroundedWalkthrough } from '../types';

export const MOCK_WALKTHROUGHS: Record<string, Record<number, GroundedWalkthrough>> = {
  'chalk/chalk': {
    524: {
      issue_number: 524,
      issue_title: 'Handle nested color reset correctly when mixing bold and foreground styles',
      simple_explanation: 'The current formatter resets nested styles too early when combining bold modifiers with foreground colors. The expected fix is to adjust how reset escape sequences are replaced in nested strings without modifying public styling signatures.',
      difficulty_justification: 'FirstPR calculated difficulty score: 24.0/100 (Genuinely Beginner). Small blast radius (2 localized files), dedicated regression test harness in `test/nested.test.js`, and explicit reproduction steps.',
      estimated_scope: {
        files_count: 2,
        test_count: 1,
        scope_description: 'Small isolated string replacement fix in utility helper.'
      },
      files_to_read: [
        {
          order: 1,
          path: 'source/index.js',
          phase_label: 'Start here',
          purpose: 'Entry point for styling chains; understand how modifier wrappers delegate to string replacement helpers.',
          why_it_matters: 'Shows how `chalk.bold(...)` wraps child expressions before emitting ANSI codes.',
          is_target_file: false,
          key_symbols: ['createChalk', 'applyStyle'],
          exists_in_repo: true
        },
        {
          order: 2,
          path: 'source/utilities.js',
          phase_label: 'Understand this next',
          purpose: 'Provides the `replaceClose()` helper responsible for swapping out reset sequences in nested styling.',
          why_it_matters: 'This is where the premature reset bug originates and where your change should be made.',
          is_target_file: true,
          key_symbols: ['replaceClose', 'stringReplaceAll'],
          exists_in_repo: true
        },
        {
          order: 3,
          path: 'test/nested.test.js',
          phase_label: 'Then inspect the tests',
          purpose: 'Contains existing nested color tests and edge cases; best place to add your regression test.',
          why_it_matters: 'Ensures your fix doesn\'t regress standard single-color strings while proving the nested bug is solved.',
          is_target_file: false,
          key_symbols: ['test("nested styling retains modifier")', 'test("deeply nested reset")'],
          exists_in_repo: true
        }
      ],
      likely_change_location: {
        file: 'source/utilities.js',
        symbol: 'function replaceClose(string, close, replace, index)',
        confidence: 'High confidence',
        reason: 'The issue behavior directly maps to the reset replacement branch used for nested modifier tokens.'
      },
      contribution_plan: [
        {
          step_number: 1,
          title: 'Reproduce the bug in a focused test',
          detail: 'Add a new test case in `test/nested.test.js` asserting that bold weight is preserved after an inner red style reset.',
          command: 'npm test -- nested'
        },
        {
          step_number: 2,
          title: 'Inspect nested reset handling',
          detail: 'Open `source/utilities.js` and trace how `replaceClose()` handles index matches for multiple overlapping ANSI reset codes.'
        },
        {
          step_number: 3,
          title: 'Modify the smallest branch that produces the bug',
          detail: 'Update the replacement branch to only substitute matching close sequences instead of global resets.'
        },
        {
          step_number: 4,
          title: 'Run the focused test suite',
          detail: 'Ensure the new test passes without warnings.',
          command: 'npm test -- nested'
        },
        {
          step_number: 5,
          title: 'Run the full test suite & linter',
          detail: 'Verify all 48 test assertions pass across colors and terminal detection suites.',
          command: 'npm test'
        },
        {
          step_number: 6,
          title: 'Submit the pull request',
          detail: 'Push your branch and submit the PR following the repository Conventional Commits standard (`fix: preserve bold modifier in nested color resets`).'
        }
      ],
      relevant_tests: ['test/nested.test.js', 'test/index.test.js'],
      test_commands: {
        focused_command: 'npm test -- nested',
        full_suite_command: 'npm test'
      },
      test_validation_guidance: 'Run `npm test -- nested` for fast sub-second iteration while implementing the fix, then run `npm test` before pushing.',
      before_opening_pr_checklist: [
        { label: 'Add or update regression unit test', source: 'CONTRIBUTING.md' },
        { label: 'Ensure all tests pass via `npm test`', source: 'CI workflow' },
        { label: 'Follow existing JavaScript code style and formatting', source: 'README' },
        { label: 'PR title should describe behavior change (`fix: ...`)', source: 'PR template' },
        { label: 'No custom branch naming constraint detected', source: 'CONTRIBUTING.md' }
      ],
      repository_conventions: {
        branch_naming: 'feature/issue-524-nested-reset',
        commit_style: 'Conventional Commits (`fix:`, `feat:`)',
        lint_tool: 'xo / ESLint',
        formatting_tool: 'Prettier',
        contributing_guide_path: 'CONTRIBUTING.md'
      },
      why_firstpr_chose_this: [
        'Low blast radius (only 2 localized files affected)',
        'Strong nearby regression tests (`test/nested.test.js`)',
        'Clear reproduction code in issue description',
        'No active assignee or conflicting PR in flight',
        'Minimal domain prerequisites (standard JavaScript string logic)'
      ],
      grounding_validated: true,
      validated_file_count: 3,
      model_provider: 'Amazon Bedrock (Claude 3.5 Sonnet) + Grounding Verifier'
    }
  },

  'fastapi/fastapi': {
    9820: {
      issue_number: 9820,
      issue_title: 'Fix broken anchor link and typo in Query Parameters tutorial documentation',
      simple_explanation: 'This documentation issue requires updating an invalid anchor slug (`#optional-parameters` -> `#optional-query-parameters`) and fixing a typo in the tutorial markdown guide.',
      difficulty_justification: 'FirstPR calculated difficulty score: 14.5/100 (Genuinely Beginner). Single markdown file modification with automated docs build verification.',
      estimated_scope: {
        files_count: 1,
        test_count: 1,
        scope_description: 'Simple markdown documentation edit in tutorial section.'
      },
      files_to_read: [
        {
          order: 1,
          path: 'docs/en/docs/tutorial/query-params.md',
          phase_label: 'Start here',
          purpose: 'Tutorial documentation page containing the broken anchor slug and typo.',
          why_it_matters: 'The exact lines to modify are located around line 42.',
          is_target_file: true,
          key_symbols: ['#optional-query-parameters', 'Query parameters'],
          exists_in_repo: true
        },
        {
          order: 2,
          path: 'README.md',
          phase_label: 'Reference',
          purpose: 'Provides documentation preview and live-reload instructions via MkDocs.',
          why_it_matters: 'Shows the command to preview the tutorial locally in your browser.',
          is_target_file: false,
          key_symbols: [],
          exists_in_repo: true
        }
      ],
      likely_change_location: {
        file: 'docs/en/docs/tutorial/query-params.md',
        symbol: 'Section: Optional parameters heading',
        confidence: 'High confidence',
        reason: 'Typo in slug anchor and keyword text directly identified in line 42.'
      },
      contribution_plan: [
        {
          step_number: 1,
          title: 'Locate the broken anchor',
          detail: 'Open `docs/en/docs/tutorial/query-params.md` and find the broken anchor link around line 42.'
        },
        {
          step_number: 2,
          title: 'Apply the text correction',
          detail: 'Replace `#optional-parameters` with `#optional-query-parameters` and fix `paramters` typo.'
        },
        {
          step_number: 3,
          title: 'Verify docs build',
          detail: 'Run documentation live preview or build test.',
          command: 'mkdocs build'
        },
        {
          step_number: 4,
          title: 'Submit the pull request',
          detail: 'Commit with `docs: fix typo and anchor in query parameters tutorial`.'
        }
      ],
      relevant_tests: ['tests/test_tutorial.py'],
      test_commands: {
        focused_command: 'pytest tests/test_tutorial.py',
        full_suite_command: 'pytest'
      },
      test_validation_guidance: 'Verify tutorial documentation build passes with zero broken internal links.',
      before_opening_pr_checklist: [
        { label: 'Follow FastAPI translation and docs conventions', source: 'CONTRIBUTING.md' },
        { label: 'Check markdown linting', source: 'CI workflow' },
        { label: 'Link issue in pull request', source: 'PR template' }
      ],
      repository_conventions: {
        branch_naming: 'docs/query-params-typo',
        commit_style: 'Conventional Commits (`docs:`)',
        lint_tool: 'Ruff',
        formatting_tool: 'Ruff Format',
        contributing_guide_path: 'CONTRIBUTING.md'
      },
      why_firstpr_chose_this: [
        'Single markdown documentation file (zero Python regression risk)',
        'Clear reproduction screenshot in issue',
        'Verified beginner-friendly by FirstPR scoring engine'
      ],
      grounding_validated: true,
      validated_file_count: 2,
      model_provider: 'Amazon Bedrock (Claude 3.5 Sonnet) + Grounding Verifier'
    }
  },

  'vercel/ms': {
    162: {
      issue_number: 162,
      issue_title: 'Support parsing fractional weeks format (e.g. `1.5 weeks` -> milliseconds)',
      simple_explanation: 'The `ms` parser currently parses fractional days (`1.5 days`) but fails on fractional weeks (`1.5 weeks`). The expected fix is to update the regular expression in `src/index.ts` to allow floating-point numbers for the week unit matcher.',
      difficulty_justification: 'FirstPR calculated difficulty score: 16.2/100 (Genuinely Beginner). Single target file with sub-second Vitest execution.',
      estimated_scope: {
        files_count: 1,
        test_count: 1,
        scope_description: 'Single-line regex tweak in micro-package.'
      },
      files_to_read: [
        {
          order: 1,
          path: 'src/index.ts',
          phase_label: 'Start here',
          purpose: 'Main parser function containing the unit regex pattern matching table.',
          why_it_matters: 'The week matcher regex pattern is defined here.',
          is_target_file: true,
          key_symbols: ['parse', 'format'],
          exists_in_repo: true
        },
        {
          order: 2,
          path: 'src/index.test.ts',
          phase_label: 'Then inspect the tests',
          purpose: 'Unit test suite with comprehensive millisecond conversion assertions.',
          why_it_matters: 'Add new test case: `expect(ms("1.5 weeks")).toBe(907200000)`.',
          is_target_file: false,
          key_symbols: ['test("parse fractional units")'],
          exists_in_repo: true
        }
      ],
      likely_change_location: {
        file: 'src/index.ts',
        symbol: 'const weekRegex = /^(...)/i',
        confidence: 'High confidence',
        reason: 'Direct regex pattern match in time conversion table.'
      },
      contribution_plan: [
        {
          step_number: 1,
          title: 'Add a failing unit test',
          detail: 'Add `expect(ms("1.5 weeks")).toBe(907200000)` in `src/index.test.ts`.',
          command: 'npm test'
        },
        {
          step_number: 2,
          title: 'Update regex in src/index.ts',
          detail: 'Allow floating-point numbers in the week duration pattern.'
        },
        {
          step_number: 3,
          title: 'Run test suite',
          detail: 'Verify all 24 unit tests pass in <20ms.',
          command: 'npm test'
        },
        {
          step_number: 4,
          title: 'Submit pull request',
          detail: 'Commit as `feat: support fractional week string parsing`.'
        }
      ],
      relevant_tests: ['src/index.test.ts'],
      test_commands: {
        focused_command: 'npm test',
        full_suite_command: 'npm test'
      },
      test_validation_guidance: 'Vitest runs all 24 unit tests in ~15ms.',
      before_opening_pr_checklist: [
        { label: 'Ensure 100% test coverage', source: 'CI workflow' },
        { label: 'Follow TypeScript strict typing', source: 'README' }
      ],
      repository_conventions: {
        branch_naming: 'feature/fractional-weeks',
        commit_style: 'Conventional Commits (`feat:`, `fix:`)',
        lint_tool: 'ESLint',
        formatting_tool: 'Prettier'
      },
      why_firstpr_chose_this: [
        'Isolated micro-utility (<100 LOC)',
        'Sub-second test feedback',
        'Zero architectural risk'
      ],
      grounding_validated: true,
      validated_file_count: 2,
      model_provider: 'Amazon Bedrock (Claude 3.5 Sonnet) + Grounding Verifier'
    }
  }
};
