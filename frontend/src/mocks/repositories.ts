import { RepositorySummary } from '../types';

export const MOCK_REPOSITORIES: Record<string, RepositorySummary> = {
  'chalk/chalk': {
    owner: 'chalk',
    repo: 'chalk',
    full_name: 'chalk/chalk',
    description: 'Terminal string styling done right. Modern, expressive, and zero dependencies.',
    default_branch: 'main',
    latest_commit_sha: 'a8f3b9c2e1d0',
    stars: 42100,
    forks: 980,
    open_issues_count: 14,
    repository_size_kb: 1240,
    stack: {
      primary_language: 'JavaScript',
      languages: { 'JavaScript': 85.0, 'TypeScript': 15.0 },
      frameworks: ['Node.js', 'ESM', 'Vitest', 'GitHub Actions'],
      package_manager: 'npm',
      test_framework: 'Vitest / AVA',
      test_locations: ['test/index.test.js', 'test/colors.test.js', 'test/nested.test.js'],
      source_directories: ['source'],
      entry_points: ['source/index.js'],
      config_files: ['package.json', 'tsconfig.json', '.github/workflows/ci.yml'],
      ci_workflows: ['.github/workflows/ci.yml'],
      loc_estimate: '~8.4k LOC',
      total_source_files: 146,
      total_test_files: 21
    },
    architecture_overview: 'Modular ANSI styling engine with ANSI 256 / TrueColor color space conversion pipelines and Windows Virtual Terminal compatibility shims.',
    total_files_analyzed: 146,
    tree_structure: [
      {
        name: 'source',
        path: 'source',
        type: 'directory',
        children: [
          { name: 'index.js', path: 'source/index.js', type: 'file', is_target: true },
          { name: 'utilities.js', path: 'source/utilities.js', type: 'file', is_target: true },
          {
            name: 'vendor',
            path: 'source/vendor',
            type: 'directory',
            children: [
              { name: 'supports-color.js', path: 'source/vendor/supports-color.js', type: 'file' },
              { name: 'ansi-styles.js', path: 'source/vendor/ansi-styles.js', type: 'file' }
            ]
          }
        ]
      },
      {
        name: 'test',
        path: 'test',
        type: 'directory',
        children: [
          { name: 'index.test.js', path: 'test/index.test.js', type: 'file', is_test: true },
          { name: 'colors.test.js', path: 'test/colors.test.js', type: 'file', is_test: true },
          { name: 'nested.test.js', path: 'test/nested.test.js', type: 'file', is_test: true }
        ]
      },
      { name: 'package.json', path: 'package.json', type: 'file' },
      { name: 'README.md', path: 'README.md', type: 'file' },
      { name: 'CONTRIBUTING.md', path: 'CONTRIBUTING.md', type: 'file' }
    ]
  },

  'fastapi/fastapi': {
    owner: 'fastapi',
    repo: 'fastapi',
    full_name: 'fastapi/fastapi',
    description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production.',
    default_branch: 'master',
    latest_commit_sha: 'c7e14d92a01f',
    stars: 76800,
    forks: 6200,
    open_issues_count: 42,
    repository_size_kb: 8900,
    stack: {
      primary_language: 'Python',
      languages: { 'Python': 98.0, 'Shell': 2.0 },
      frameworks: ['FastAPI', 'Starlette', 'Pydantic v2', 'AnyIO', 'pytest'],
      package_manager: 'uv / pip',
      test_framework: 'pytest',
      test_locations: ['tests/test_tutorial', 'tests/test_dependency.py', 'tests/test_routing.py'],
      source_directories: ['fastapi', 'docs'],
      entry_points: ['fastapi/main.py', 'fastapi/applications.py'],
      config_files: ['pyproject.toml', 'requirements.txt', '.github/workflows/test.yml'],
      ci_workflows: ['.github/workflows/test.yml'],
      loc_estimate: '~34.2k LOC',
      total_source_files: 318,
      total_test_files: 84
    },
    architecture_overview: 'Modern high-performance web API framework built atop Starlette for routing/async and Pydantic for data validation and OpenAPI generation.',
    total_files_analyzed: 318,
    tree_structure: [
      {
        name: 'fastapi',
        path: 'fastapi',
        type: 'directory',
        children: [
          { name: 'applications.py', path: 'fastapi/applications.py', type: 'file' },
          { name: 'routing.py', path: 'fastapi/routing.py', type: 'file' },
          { name: 'param_functions.py', path: 'fastapi/param_functions.py', type: 'file' },
          {
            name: 'dependencies',
            path: 'fastapi/dependencies',
            type: 'directory',
            children: [
              { name: 'utils.py', path: 'fastapi/dependencies/utils.py', type: 'file' },
              { name: 'models.py', path: 'fastapi/dependencies/models.py', type: 'file' }
            ]
          }
        ]
      },
      {
        name: 'docs',
        path: 'docs',
        type: 'directory',
        children: [
          {
            name: 'en/docs/tutorial',
            path: 'docs/en/docs/tutorial',
            type: 'directory',
            children: [
              { name: 'query-params.md', path: 'docs/en/docs/tutorial/query-params.md', type: 'file', is_target: true },
              { name: 'body.md', path: 'docs/en/docs/tutorial/body.md', type: 'file' }
            ]
          }
        ]
      },
      {
        name: 'tests',
        path: 'tests',
        type: 'directory',
        children: [
          { name: 'test_tutorial.py', path: 'tests/test_tutorial.py', type: 'file', is_test: true },
          { name: 'test_dependency.py', path: 'tests/test_dependency.py', type: 'file', is_test: true }
        ]
      },
      { name: 'pyproject.toml', path: 'pyproject.toml', type: 'file' },
      { name: 'README.md', path: 'README.md', type: 'file' }
    ]
  },

  'vercel/ms': {
    owner: 'vercel',
    repo: 'ms',
    full_name: 'vercel/ms',
    description: 'Use this package to easily convert various time formats to milliseconds and vice-versa.',
    default_branch: 'main',
    latest_commit_sha: 'e49b1a03fd2',
    stars: 5400,
    forks: 230,
    open_issues_count: 5,
    repository_size_kb: 320,
    stack: {
      primary_language: 'TypeScript',
      languages: { 'TypeScript': 95.0, 'JavaScript': 5.0 },
      frameworks: ['Node.js', 'Vitest', 'micro-utility'],
      package_manager: 'npm',
      test_framework: 'Vitest',
      test_locations: ['src/index.test.ts'],
      source_directories: ['src'],
      entry_points: ['src/index.ts'],
      config_files: ['package.json', 'tsconfig.json', '.github/workflows/test.yml'],
      ci_workflows: ['.github/workflows/test.yml'],
      loc_estimate: '~480 LOC',
      total_source_files: 8,
      total_test_files: 2
    },
    architecture_overview: 'Lightweight time formatting and parsing library with zero external dependencies and strict micro-benchmark thresholds.',
    total_files_analyzed: 8,
    tree_structure: [
      {
        name: 'src',
        path: 'src',
        type: 'directory',
        children: [
          { name: 'index.ts', path: 'src/index.ts', type: 'file', is_target: true },
          { name: 'index.test.ts', path: 'src/index.test.ts', type: 'file', is_test: true }
        ]
      },
      { name: 'package.json', path: 'package.json', type: 'file' },
      { name: 'README.md', path: 'README.md', type: 'file' }
    ]
  },

  'example/broken-build': {
    owner: 'example',
    repo: 'broken-build',
    full_name: 'example/broken-build',
    description: 'Next-gen analytics engine with strict Node 22 engine constraints and native C++ addons.',
    default_branch: 'main',
    latest_commit_sha: '7f91c02ab44',
    stars: 120,
    forks: 14,
    open_issues_count: 8,
    repository_size_kb: 4200,
    stack: {
      primary_language: 'TypeScript',
      languages: { 'TypeScript': 80.0, 'C++': 20.0 },
      frameworks: ['Node.js', 'Node-API', 'Jest'],
      package_manager: 'pnpm',
      test_framework: 'Jest',
      test_locations: ['tests/engine.test.ts'],
      source_directories: ['src', 'native'],
      entry_points: ['src/index.ts'],
      config_files: ['package.json', 'pnpm-lock.yaml', 'binding.gyp'],
      ci_workflows: ['.github/workflows/ci.yml'],
      loc_estimate: '~12.8k LOC',
      total_source_files: 54,
      total_test_files: 8
    },
    architecture_overview: 'High-throughput stream processing pipeline integrating native node-gyp bindings with Node 22 V8 snapshot optimizations.',
    total_files_analyzed: 54
  },

  'example/unsupported-stack': {
    owner: 'example',
    repo: 'unsupported-stack',
    full_name: 'example/unsupported-stack',
    description: 'Embedded firmware telemetry agent written in Rust and Zig with custom bare-metal linker scripts.',
    default_branch: 'main',
    latest_commit_sha: '2b881ef4099',
    stars: 310,
    forks: 22,
    open_issues_count: 6,
    repository_size_kb: 6400,
    stack: {
      primary_language: 'Rust',
      languages: { 'Rust': 75.0, 'Zig': 25.0 },
      frameworks: ['no_std', 'embedded-hal'],
      package_manager: 'cargo (bare-metal)',
      test_framework: 'custom harness',
      test_locations: ['tests/target.rs'],
      source_directories: ['src'],
      entry_points: ['src/main.rs'],
      config_files: ['Cargo.toml', 'build.zig'],
      ci_workflows: ['.github/workflows/build.yml'],
      loc_estimate: '~18.5k LOC',
      total_source_files: 72,
      total_test_files: 6
    },
    architecture_overview: 'Bare-metal embedded firmware suite targeting ARM Cortex-M microcontrollers without standard POSIX runtime.',
    total_files_analyzed: 72
  }
};
