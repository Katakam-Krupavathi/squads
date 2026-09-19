import { IssueCandidate } from '../types';

export const MOCK_ISSUES: Record<string, IssueCandidate[]> = {
  'chalk/chalk': [
    {
      number: 524,
      title: 'Handle nested color reset correctly when mixing bold and foreground styles',
      body: 'Currently when combining `chalk.bold(chalk.red("hello") + " world")`, closing the red styling accidentally resets the bold weight in certain terminal emulators.\n\n### Steps to Reproduce\n```js\nimport chalk from "chalk";\nconsole.log(chalk.bold(chalk.red("foo") + " bar"));\n```\n### Expected\n"bar" should retain bold styling after the red sequence closes.\n\n- [ ] Adjust reset replacement branch in `source/utilities.js`\n- [ ] Add regression test in `test/nested.test.js`',
      html_url: 'https://github.com/chalk/chalk/issues/524',
      labels: ['good first issue', 'bug', 'help wanted'],
      state: 'open',
      comments_count: 4,
      assignees: [],
      difficulty: {
        total_score: 24.0,
        category: 'Genuinely Beginner',
        confidence: 0.98,
        summary_explanation: 'Verified genuinely beginner-friendly (24/100). Localized to helper replacement in `source/utilities.js` with dedicated regression tests in `test/nested.test.js` and clear acceptance criteria.',
        is_mislabelled: false,
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 22.0,
            weight: 0.22,
            weighted_score: 4.84,
            rating_label: 'Low',
            evidence: ['Touches 2 localized files: `source/utilities.js` and `test/nested.test.js`', 'No public API changes'],
            explanation: 'Localized to string replacement helper logic.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 25.0,
            weight: 0.16,
            weighted_score: 4.0,
            rating_label: 'Low',
            evidence: ['Leaf formatting helper module', 'Target file has 3 incoming imports across repo'],
            explanation: 'Low structural risk; leaf module with isolated responsibilities.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 24.0,
            weight: 0.14,
            weighted_score: 3.36,
            rating_label: 'Low',
            evidence: ['LOC: ~110 lines in target utility', 'Max nesting depth: 2', 'Cyclomatic complexity: 4'],
            explanation: 'Clean, standard JavaScript regex replacement functions.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 18.0,
            weight: 0.14,
            weighted_score: 2.52,
            rating_label: 'Strong',
            evidence: ['Dedicated test suite exists: `test/nested.test.js`', 'Vitest / AVA test runner with 100% assertion harness'],
            explanation: 'Strong test harness protection; instant local test feedback.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 16.0,
            weight: 0.16,
            weighted_score: 2.56,
            rating_label: 'Excellent',
            evidence: ['Includes minimal reproducing code snippet', 'Expected vs actual output explicitly defined', 'Checklist items provided'],
            explanation: 'Thorough specification with clear reproduction steps.'
          },
          social_state: {
            name: 'Social State',
            score: 15.0,
            weight: 0.10,
            weighted_score: 1.5,
            rating_label: 'Available',
            evidence: ['Issue is unassigned and open', 'Maintainer confirmed desired behavior in comments'],
            explanation: 'Available for immediate contribution.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 15.0,
            weight: 0.08,
            weighted_score: 1.2,
            rating_label: 'Minimal',
            evidence: ['Standard ANSI escape code string handling', 'No low-level OS terminal driver dependencies'],
            explanation: 'Standard JavaScript string handling skills.'
          }
        }
      },
      likely_affected_files: ['source/utilities.js', 'test/nested.test.js'],
      potential_blockers: [],
      specification_quality_score: 94.0,
      test_availability: 'Dedicated Tests Available (`test/nested.test.js`)',
      social_state: 'Available',
      has_linked_pr: false,
      is_stale: false
    },
    {
      number: 510,
      title: 'Add support for CSS functional RGB string parsing `rgb(255, 0, 0)`',
      body: 'Allow passing functional CSS rgb strings to `chalk.rgb("rgb(255, 0, 0)")` in addition to numeric arguments `chalk.rgb(255, 0, 0)`. Requires parser update and argument validation.',
      html_url: 'https://github.com/chalk/chalk/issues/510',
      labels: ['enhancement', 'help wanted'],
      state: 'open',
      comments_count: 2,
      assignees: [],
      difficulty: {
        total_score: 48.2,
        category: 'Moderate',
        confidence: 0.94,
        summary_explanation: 'Moderate difficulty (48.2/100). Requires updating color space parser regex and argument overloading across 3 files.',
        is_mislabelled: false,
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 50.0,
            weight: 0.22,
            weighted_score: 11.0,
            rating_label: 'Moderate',
            evidence: ['Touches 3 files: `source/index.js`, `source/vendor/ansi-styles.js`, `test/colors.test.js`'],
            explanation: 'Touches color parsing and public argument validation.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 45.0,
            weight: 0.16,
            weighted_score: 7.2,
            rating_label: 'Moderate',
            evidence: ['Modifies public API entry point signature in `source/index.js`'],
            explanation: 'Moderate structural impact.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 42.0,
            weight: 0.14,
            weighted_score: 5.88,
            rating_label: 'Moderate',
            evidence: ['Regex matching for CSS functional syntax whitespace and commas'],
            explanation: 'Requires robust regex parsing and input validation.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 30.0,
            weight: 0.14,
            weighted_score: 4.2,
            rating_label: 'Strong',
            evidence: ['Existing color test file: `test/colors.test.js`'],
            explanation: 'Good test harness coverage.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 40.0,
            weight: 0.16,
            weighted_score: 6.4,
            rating_label: 'Moderate',
            evidence: ['Feature proposal without comprehensive edge case matrix'],
            explanation: 'Moderately defined specification.'
          },
          social_state: {
            name: 'Social State',
            score: 15.0,
            weight: 0.10,
            weighted_score: 1.5,
            rating_label: 'Available',
            evidence: ['Unassigned and ready for contribution'],
            explanation: 'Available.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 25.0,
            weight: 0.08,
            weighted_score: 2.0,
            rating_label: 'Low',
            evidence: ['Basic understanding of CSS color spaces and RGB gamut conversion'],
            explanation: 'Color format knowledge.'
          }
        }
      },
      likely_affected_files: ['source/index.js', 'source/vendor/ansi-styles.js', 'test/colors.test.js'],
      potential_blockers: ['Requires supporting both comma-separated and modern space-separated CSS syntax'],
      specification_quality_score: 72.0,
      test_availability: 'General Color Suite (`test/colors.test.js`)',
      social_state: 'Available',
      has_linked_pr: false,
      is_stale: false
    },
    {
      number: 491,
      title: 'Refactor Windows ConHost TTY 24-bit color fallback detection',
      body: 'On legacy Windows 10 ConHost builds, 24-bit color isn\'t properly detected when running under PowerShell. Need someone to fix the detection logic.\n\nGood first issue for anyone wanting to learn Windows terminal handling!',
      html_url: 'https://github.com/chalk/chalk/issues/491',
      labels: ['good first issue', 'help wanted', 'windows'],
      state: 'open',
      comments_count: 8,
      assignees: [],
      difficulty: {
        total_score: 78.5,
        category: 'Mislabelled',
        confidence: 0.96,
        summary_explanation: 'GitHub labels this as "good first issue", but FirstPR calculated a difficulty score of 78.5/100 (HIGH RISK). Requires low-level Windows ConHost IOCTL knowledge, touches core terminal detection across 6 files, and lacks automated test mocks.',
        is_mislabelled: true,
        mislabelled_reasons: [
          'Likely touches 6 files across the core terminal bootstrap layer',
          'Primary target `source/vendor/supports-color.js` is imported by 18 dependent modules',
          'Requires low-level Win32 Console IOCTL (`ENABLE_VIRTUAL_TERMINAL_PROCESSING`) knowledge',
          'No automated regression test harness exists for Windows ConHost simulation',
          '3 previous beginner contributors attempted and abandoned this issue'
        ],
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 88.0,
            weight: 0.22,
            weighted_score: 19.36,
            rating_label: 'High',
            evidence: ['Touches core stream pipeline across 6 files', 'Requires changes to `source/vendor/supports-color.js`, `source/index.js`, and OS detection'],
            explanation: 'Large blast radius touching OS terminal detection layer.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 90.0,
            weight: 0.16,
            weighted_score: 14.4,
            rating_label: 'High',
            evidence: ['Modifies root stream bootstrap engine', '18 dependent internal helper modules'],
            explanation: 'Central core subsystem with high breakage risk.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 82.0,
            weight: 0.14,
            weighted_score: 11.48,
            rating_label: 'High',
            evidence: ['Windows TTY console mode bitmask manipulation', 'Bitwise operations with Win32 API handles'],
            explanation: 'Complex OS-level bitwise operations.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 75.0,
            weight: 0.14,
            weighted_score: 10.5,
            rating_label: 'Weak',
            evidence: ['Requires Windows Virtual Terminal environment simulation', 'No existing mock for Win32 ENABLE_VIRTUAL_TERMINAL_PROCESSING'],
            explanation: 'Missing test harness for platform-specific TTY simulation.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 65.0,
            weight: 0.16,
            weighted_score: 10.4,
            rating_label: 'Weak',
            evidence: ['Brief description: "Fix Windows Terminal color depth detection on legacy ConHost"', 'No stack trace or reproduction commands'],
            explanation: 'Vague description with complex underlying hardware dependencies.'
          },
          social_state: {
            name: 'Social State',
            score: 50.0,
            weight: 0.10,
            weighted_score: 5.0,
            rating_label: 'Moderate',
            evidence: ['3 previous contributors attempted and abandoned', 'Unresolved technical debate in comments'],
            explanation: 'Historically difficult; multiple abandoned attempts.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 92.0,
            weight: 0.08,
            weighted_score: 7.36,
            rating_label: 'High',
            evidence: ['Requires Windows Console Internals & ConHost IOCTL knowledge', 'ANSI escape sequence parser synchronization'],
            explanation: 'Specialized Windows terminal driver & IOCTL knowledge required.'
          }
        }
      },
      likely_affected_files: ['source/vendor/supports-color.js', 'source/index.js', 'source/utilities.js'],
      potential_blockers: [
        'Mislabelled: Requires Windows Console Internals & IOCTL expertise despite "good first issue" label',
        'High blast radius touching core stream bootstrapping',
        'No automated test harness for legacy ConHost simulation'
      ],
      specification_quality_score: 35.0,
      test_availability: 'No Test Coverage for Windows ConHost',
      social_state: 'Stale (3 Abandoned Attempts)',
      has_linked_pr: false,
      is_stale: true
    }
  ],

  'fastapi/fastapi': [
    {
      number: 9820,
      title: 'Fix broken anchor link and typo in Query Parameters tutorial documentation',
      body: 'In `docs/en/docs/tutorial/query-params.md` line 42, the anchor link `#optional-parameters` is broken due to a typo in the slug.\n\n### Expected\nUpdate anchor link to `#optional-query-parameters` and fix typo `paramters` -> `parameters`.',
      html_url: 'https://github.com/fastapi/fastapi/issues/9820',
      labels: ['good first issue', 'documentation'],
      state: 'open',
      comments_count: 2,
      assignees: [],
      difficulty: {
        total_score: 14.5,
        category: 'Genuinely Beginner',
        confidence: 0.99,
        summary_explanation: 'Verified genuinely beginner-friendly (14.5/100). Clear documentation fix in `docs/en/docs/tutorial/query-params.md` with zero architectural risk.',
        is_mislabelled: false,
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 15.0,
            weight: 0.22,
            weighted_score: 3.3,
            rating_label: 'Low',
            evidence: ['Targets documentation example in `docs/en/docs/tutorial/query-params.md`', 'Zero runtime Python changes'],
            explanation: 'Single markdown documentation file.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 10.0,
            weight: 0.16,
            weighted_score: 1.6,
            rating_label: 'Low',
            evidence: ['Documentation tree leaf node', 'Zero code dependencies'],
            explanation: 'Zero architectural coupling.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 15.0,
            weight: 0.14,
            weighted_score: 2.1,
            rating_label: 'Low',
            evidence: ['Markdown documentation syntax with Python code fence', 'LOC: 45 lines'],
            explanation: 'Straightforward documentation fix.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 20.0,
            weight: 0.14,
            weighted_score: 2.8,
            rating_label: 'Strong',
            evidence: ['Documentation build tested via `mkdocs build`', 'Automated markdown linting'],
            explanation: 'Automated docs build verification available.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 15.0,
            weight: 0.16,
            weighted_score: 2.4,
            rating_label: 'Excellent',
            evidence: ['Exact line number and copy edit suggested', 'Screenshot of broken tutorial link provided'],
            explanation: 'Clear, explicit specification.'
          },
          social_state: {
            name: 'Social State',
            score: 15.0,
            weight: 0.10,
            weighted_score: 1.5,
            rating_label: 'Available',
            evidence: ['Unassigned and confirmed by maintainers'],
            explanation: 'Available for first PR.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 10.0,
            weight: 0.08,
            weighted_score: 0.8,
            rating_label: 'Minimal',
            evidence: ['Standard FastAPI query parameter usage', 'No internal ASGI/Starlette knowledge needed'],
            explanation: 'Beginner Python knowledge.'
          }
        }
      },
      likely_affected_files: ['docs/en/docs/tutorial/query-params.md'],
      potential_blockers: [],
      specification_quality_score: 95.0,
      test_availability: 'Docs Build Test Active',
      social_state: 'Available',
      has_linked_pr: false,
      is_stale: false
    },
    {
      number: 9210,
      title: 'Add custom response header helper in default OpenAPI generator schema',
      body: 'Provide a clean utility helper in `fastapi/openapi/utils.py` to inject security headers into auto-generated OpenAPI JSON schemas.',
      html_url: 'https://github.com/fastapi/fastapi/issues/9210',
      labels: ['enhancement'],
      state: 'open',
      comments_count: 3,
      assignees: [],
      difficulty: {
        total_score: 52.0,
        category: 'Moderate',
        confidence: 0.92,
        summary_explanation: 'Moderate difficulty (52.0/100). Requires modifying OpenAPI spec generation models in `fastapi/openapi/utils.py` with pytest assertions.',
        is_mislabelled: false,
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 55.0,
            weight: 0.22,
            weighted_score: 12.1,
            rating_label: 'Moderate',
            evidence: ['Touches `fastapi/openapi/utils.py` and `tests/test_openapi.py`'],
            explanation: 'Modifies OpenAPI schema generator.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 60.0,
            weight: 0.16,
            weighted_score: 9.6,
            rating_label: 'Moderate',
            evidence: ['Used during FastAPI application startup OpenAPI assembly'],
            explanation: 'Shared utility module.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 48.0,
            weight: 0.14,
            weighted_score: 6.72,
            rating_label: 'Moderate',
            evidence: ['Dictionary traversal for OpenAPI 3.1.0 response headers'],
            explanation: 'Nested dict manipulations.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 25.0,
            weight: 0.14,
            weighted_score: 3.5,
            rating_label: 'Strong',
            evidence: ['Dedicated test suite: `tests/test_openapi.py`'],
            explanation: 'Comprehensive test suite.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 45.0,
            weight: 0.16,
            weighted_score: 7.2,
            rating_label: 'Moderate',
            evidence: ['General enhancement proposal with schema snippet'],
            explanation: 'Moderate specification.'
          },
          social_state: {
            name: 'Social State',
            score: 15.0,
            weight: 0.10,
            weighted_score: 1.5,
            rating_label: 'Available',
            evidence: ['Unassigned and ready'],
            explanation: 'Available.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 35.0,
            weight: 0.08,
            weighted_score: 2.8,
            rating_label: 'Low',
            evidence: ['OpenAPI specification knowledge'],
            explanation: 'OpenAPI 3.1.0 specification knowledge.'
          }
        }
      },
      likely_affected_files: ['fastapi/openapi/utils.py', 'tests/test_openapi.py'],
      potential_blockers: [],
      specification_quality_score: 68.0,
      test_availability: 'Dedicated OpenAPI Test Suite',
      social_state: 'Available',
      has_linked_pr: false,
      is_stale: false
    },
    {
      number: 8431,
      title: 'Async generator dependency context leak on premature client disconnection',
      body: 'When a client disconnects before a streaming response completes, the `yield` in async dependencies never executes its cleanup block. Good first issue for newcomers to learn FastAPI dependencies!',
      html_url: 'https://github.com/fastapi/fastapi/issues/8431',
      labels: ['good first issue', 'help wanted'],
      state: 'open',
      comments_count: 6,
      assignees: [],
      difficulty: {
        total_score: 80.1,
        category: 'Mislabelled',
        confidence: 0.97,
        summary_explanation: 'GitHub labels this as "good first issue", but FirstPR calculated a difficulty score of 80.1/100 (DANGEROUS MISLABEL). Requires deep ASGI lifecycle knowledge, touches core dependency resolution across 4 files, and involves complex async generator teardown.',
        is_mislabelled: true,
        mislabelled_reasons: [
          'Touches core dependency injection resolution engine in `fastapi/dependencies/utils.py` and `routing.py`',
          'Imported by every route handler in FastAPI (~95% structural centrality)',
          'Requires deep ASGI protocol specification & Starlette contextmanager teardown mechanics',
          'High risk of introducing silent memory leaks across production async server workers'
        ],
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 92.0,
            weight: 0.22,
            weighted_score: 20.24,
            rating_label: 'High',
            evidence: ['Modifies `fastapi/routing.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`', 'Cross-cutting async generator dependency lifecycle'],
            explanation: 'Wide blast radius affecting core routing and dependency injection engines.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 95.0,
            weight: 0.16,
            weighted_score: 15.2,
            rating_label: 'High',
            evidence: ['Core dependency injection resolution graph (`fastapi/dependencies/models.py`)', 'Imported by every route handler in FastAPI'],
            explanation: 'Critical core architecture hub.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 88.0,
            weight: 0.14,
            weighted_score: 12.32,
            rating_label: 'High',
            evidence: ['Complex async generator context managers', 'Starlette background task race conditions', 'AnyIO threadpool coordination'],
            explanation: 'Dense concurrency and ASGI state management.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 60.0,
            weight: 0.14,
            weighted_score: 8.4,
            rating_label: 'Moderate',
            evidence: ['General test suite exists (`tests/test_dependency.py`), but async generator cancellation edge cases are unmocked'],
            explanation: 'Complex async timing tests required.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 70.0,
            weight: 0.16,
            weighted_score: 11.2,
            rating_label: 'Weak',
            evidence: ['Brief bug report without minimal repro script', 'No reproduction script'],
            explanation: 'Underspecified async edge case.'
          },
          social_state: {
            name: 'Social State',
            score: 55.0,
            weight: 0.10,
            weighted_score: 5.5,
            rating_label: 'Moderate',
            evidence: ['Tagged "good first issue" by bot triager', 'Previous PR closed due to ASGI scope memory leak'],
            explanation: 'Mismatched triager label; high complexity.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 90.0,
            weight: 0.08,
            weighted_score: 7.2,
            rating_label: 'High',
            evidence: ['Requires deep ASGI specification & async generator teardown mechanics knowledge', 'Starlette & AnyIO concurrency internals'],
            explanation: 'Specialized ASGI protocol & asynchronous concurrency mastery required.'
          }
        }
      },
      likely_affected_files: ['fastapi/dependencies/utils.py', 'fastapi/routing.py', 'fastapi/dependencies/models.py'],
      potential_blockers: [
        'Mislabelled: Requires ASGI specification & AsyncIO concurrency internals despite beginner label',
        'Modifies central dependency injection engine',
        'High risk of silent memory leak regressions in production'
      ],
      specification_quality_score: 30.0,
      test_availability: 'General Suite Only',
      social_state: 'Claim In Discussion',
      has_linked_pr: false,
      is_stale: false
    }
  ],

  'vercel/ms': [
    {
      number: 162,
      title: 'Support parsing fractional weeks format (e.g. `1.5 weeks` -> milliseconds)',
      body: 'Currently `ms("1.5 weeks")` returns `NaN` because the regex only matches integer numbers for week units (`w` or `weeks`).\n\n### Steps to Reproduce\n```js\nms("1.5 weeks"); // NaN\nms("1.5 days");  // 129600000 (works!)\n```\n### Expected\n`ms("1.5 weeks")` should return `907200000` (1.5 * 7 * 24 * 60 * 60 * 1000).\n\n- [ ] Update float regex in `src/index.ts`\n- [ ] Add test cases in `src/index.test.ts`',
      html_url: 'https://github.com/vercel/ms/issues/162',
      labels: ['good first issue', 'enhancement'],
      state: 'open',
      comments_count: 1,
      assignees: [],
      difficulty: {
        total_score: 16.2,
        category: 'Genuinely Beginner',
        confidence: 0.99,
        summary_explanation: 'Verified genuinely beginner-friendly (16.2/100). Micro-utility change in single file `src/index.ts` with instant Vitest feedback in `src/index.test.ts`.',
        is_mislabelled: false,
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 15.0,
            weight: 0.22,
            weighted_score: 3.3,
            rating_label: 'Low',
            evidence: ['Single target file: `src/index.ts`', 'Single test file: `src/index.test.ts`'],
            explanation: 'Localized to one function in a 100-line file.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 20.0,
            weight: 0.16,
            weighted_score: 3.2,
            rating_label: 'Low',
            evidence: ['Standalone zero-dependency micro-package'],
            explanation: 'Minimal architectural footprint.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 18.0,
            weight: 0.14,
            weighted_score: 2.52,
            rating_label: 'Low',
            evidence: ['LOC: ~90 lines', 'Max nesting depth: 1'],
            explanation: 'Clean arithmetic multiplication.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 12.0,
            weight: 0.14,
            weighted_score: 1.68,
            rating_label: 'Strong',
            evidence: ['100% test coverage in `src/index.test.ts`', 'Tests execute in <15ms'],
            explanation: 'Immediate automated test feedback.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 15.0,
            weight: 0.16,
            weighted_score: 2.4,
            rating_label: 'Excellent',
            evidence: ['Code reproduction snippet provided with expected arithmetic output'],
            explanation: 'Explicit specification.'
          },
          social_state: {
            name: 'Social State',
            score: 15.0,
            weight: 0.10,
            weighted_score: 1.5,
            rating_label: 'Available',
            evidence: ['Unassigned and active'],
            explanation: 'Available.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 10.0,
            weight: 0.08,
            weighted_score: 0.8,
            rating_label: 'Minimal',
            evidence: ['Basic time units (milliseconds, seconds, days, weeks)'],
            explanation: 'Standard arithmetic math.'
          }
        }
      },
      likely_affected_files: ['src/index.ts', 'src/index.test.ts'],
      potential_blockers: [],
      specification_quality_score: 96.0,
      test_availability: 'Dedicated Test Suite (`src/index.test.ts`)',
      social_state: 'Available',
      has_linked_pr: false,
      is_stale: false
    }
  ],

  'example/broken-build': [
    {
      number: 12,
      title: 'Fix memory leak in stream buffer chunk allocation',
      body: 'Buffer ring allocator fails to free slab chunks on socket close.',
      html_url: 'https://github.com/example/broken-build/issues/12',
      labels: ['bug'],
      state: 'open',
      comments_count: 2,
      assignees: [],
      difficulty: {
        total_score: 68.0,
        category: 'Moderate',
        confidence: 0.90,
        summary_explanation: 'Moderate-High difficulty (68.0/100). Touches native C++ addon memory management.',
        is_mislabelled: false,
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 70.0,
            weight: 0.22,
            weighted_score: 15.4,
            rating_label: 'Moderate',
            evidence: ['Touches `native/buffer.cc` and `src/stream.ts`'],
            explanation: 'Crosses JS/Native bridge.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 75.0,
            weight: 0.16,
            weighted_score: 12.0,
            rating_label: 'Moderate',
            evidence: ['Core stream buffer engine'],
            explanation: 'Central buffer component.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 72.0,
            weight: 0.14,
            weighted_score: 10.08,
            rating_label: 'Moderate',
            evidence: ['Manual memory allocation in C++'],
            explanation: 'Pointers and buffer offsets.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 65.0,
            weight: 0.14,
            weighted_score: 9.1,
            rating_label: 'Weak',
            evidence: ['Build broken; tests cannot execute'],
            explanation: 'Unverified test harness.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 60.0,
            weight: 0.16,
            weighted_score: 9.6,
            rating_label: 'Moderate',
            evidence: ['Brief memory report'],
            explanation: 'Moderate specification.'
          },
          social_state: {
            name: 'Social State',
            score: 15.0,
            weight: 0.10,
            weighted_score: 1.5,
            rating_label: 'Available',
            evidence: ['Open and unassigned'],
            explanation: 'Available.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 85.0,
            weight: 0.08,
            weighted_score: 6.8,
            rating_label: 'High',
            evidence: ['C++ N-API and memory layout'],
            explanation: 'Native C++ knowledge required.'
          }
        }
      },
      likely_affected_files: ['native/buffer.cc', 'src/stream.ts'],
      potential_blockers: ['Development environment build fails due to Node version mismatch'],
      specification_quality_score: 45.0,
      test_availability: 'Build Blocked',
      social_state: 'Available',
      has_linked_pr: false,
      is_stale: false
    }
  ],

  'example/unsupported-stack': [
    {
      number: 5,
      title: 'Fix UART baud rate divisor rounding for 16MHz system clock',
      body: 'In `src/uart.rs`, integer division truncation causes a 3.5% clock drift at 115200 baud.',
      html_url: 'https://github.com/example/unsupported-stack/issues/5',
      labels: ['good first issue', 'firmware'],
      state: 'open',
      comments_count: 1,
      assignees: [],
      difficulty: {
        total_score: 32.0,
        category: 'Genuinely Beginner',
        confidence: 0.91,
        summary_explanation: 'Genuinely Beginner for embedded developers (32.0/100). Localized arithmetic rounding fix in `src/uart.rs`.',
        is_mislabelled: false,
        signals: {
          blast_radius: {
            name: 'Blast Radius',
            score: 25.0,
            weight: 0.22,
            weighted_score: 5.5,
            rating_label: 'Low',
            evidence: ['Single file: `src/uart.rs`'],
            explanation: 'Localized to UART driver formula.'
          },
          structural_centrality: {
            name: 'Structural Centrality',
            score: 35.0,
            weight: 0.16,
            weighted_score: 5.6,
            rating_label: 'Low',
            evidence: ['Peripheral driver module'],
            explanation: 'Peripheral driver.'
          },
          local_complexity: {
            name: 'Local Complexity',
            score: 30.0,
            weight: 0.14,
            weighted_score: 4.2,
            rating_label: 'Low',
            evidence: ['Integer division formula'],
            explanation: 'Math calculation.'
          },
          test_proximity: {
            name: 'Test Proximity',
            score: 50.0,
            weight: 0.14,
            weighted_score: 7.0,
            rating_label: 'Moderate',
            evidence: ['Embedded target simulator test'],
            explanation: 'Simulator harness.'
          },
          specification_quality: {
            name: 'Specification Quality',
            score: 20.0,
            weight: 0.16,
            weighted_score: 3.2,
            rating_label: 'Excellent',
            evidence: ['Exact baud formula and clock frequencies given'],
            explanation: 'Detailed spec.'
          },
          social_state: {
            name: 'Social State',
            score: 15.0,
            weight: 0.10,
            weighted_score: 1.5,
            rating_label: 'Available',
            evidence: ['Available'],
            explanation: 'Available.'
          },
          domain_prerequisites: {
            name: 'Domain Prerequisites',
            score: 45.0,
            weight: 0.08,
            weighted_score: 3.6,
            rating_label: 'Moderate',
            evidence: ['Microcontroller clock registers'],
            explanation: 'Embedded hardware registers.'
          }
        }
      },
      likely_affected_files: ['src/uart.rs'],
      potential_blockers: ['Environment verification unsupported on bare-metal target without hardware emulator'],
      specification_quality_score: 88.0,
      test_availability: 'Hardware Emulator Required',
      social_state: 'Available',
      has_linked_pr: false,
      is_stale: false
    }
  ]
};
