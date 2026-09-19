import { EnvironmentVerification } from '../types';

export const MOCK_ENVIRONMENTS: Record<string, EnvironmentVerification> = {
  'chalk/chalk': {
    runtime: 'Node.js 22.4.1',
    package_manager: 'npm',
    install_command: 'npm ci',
    build_command: 'npm run build',
    test_command: 'npm test',
    status: 'Verified',
    execution_timestamp: '2026-09-19T18:30:05Z',
    total_duration_ms: 4820,
    steps: [
      {
        name: 'install',
        command: 'npm ci',
        status: 'completed',
        exit_code: 0,
        duration_ms: 2100,
        stdout: 'added 164 packages in 2.08s\naudited 164 packages in 2.1s\nfound 0 vulnerabilities\n',
        stderr: ''
      },
      {
        name: 'build',
        command: 'npm run build',
        status: 'completed',
        exit_code: 0,
        duration_ms: 1250,
        stdout: '> chalk@5.3.0 build\n> tsc --project tsconfig.json\nBuild completed successfully.\n',
        stderr: ''
      },
      {
        name: 'test',
        command: 'npm test',
        status: 'completed',
        exit_code: 0,
        duration_ms: 1470,
        stdout: '> chalk@5.3.0 test\n> vitest run\n\n ✓ test/index.test.js (18 tests)\n ✓ test/colors.test.js (14 tests)\n ✓ test/nested.test.js (16 tests)\n\nTest Files  3 passed (3)\n     Tests  48 passed (48)\n  Duration  1.42s\n',
        stderr: ''
      }
    ],
    sandbox_provider: 'AWS ECS / Fargate (MicroVM Isolation)',
    cpu_limit: '1 vCPU',
    memory_limit: '2 GB',
    timeout_seconds: 45,
    is_sandboxed: true
  },

  'fastapi/fastapi': {
    runtime: 'Python 3.12.3',
    package_manager: 'uv / pip',
    install_command: 'pip install -e .[all]',
    build_command: 'python -m build',
    test_command: 'pytest tests/test_tutorial/test_query_params',
    status: 'Verified',
    execution_timestamp: '2026-09-19T18:35:05Z',
    total_duration_ms: 6140,
    steps: [
      {
        name: 'install',
        command: 'pip install -e .[all]',
        status: 'completed',
        exit_code: 0,
        duration_ms: 3100,
        stdout: 'Successfully installed fastapi-0.111.0 starlette-0.37.2 pydantic-2.7.1 anyio-4.3.0 uvicorn-0.29.0\n',
        stderr: ''
      },
      {
        name: 'build',
        command: 'python -m build',
        status: 'completed',
        exit_code: 0,
        duration_ms: 1640,
        stdout: '* Creating isolated build env...\n* Building wheel from sdist...\nSuccessfully built fastapi-0.111.0.tar.gz and fastapi-0.111.0-py3-none-any.whl\n',
        stderr: ''
      },
      {
        name: 'test',
        command: 'pytest tests/test_tutorial/test_query_params',
        status: 'completed',
        exit_code: 0,
        duration_ms: 1400,
        stdout: '============================= test session starts =============================\nrootdir: /workspace/fastapi\ncollected 12 items\n\ntests/test_tutorial/test_query_params/test_tutorial001.py ....             [ 33%]\ntests/test_tutorial/test_query_params/test_tutorial002.py ........         [100%]\n\n============================== 12 passed in 0.89s ==============================\n',
        stderr: ''
      }
    ],
    sandbox_provider: 'AWS ECS / Fargate (MicroVM Isolation)',
    cpu_limit: '1 vCPU',
    memory_limit: '2 GB',
    timeout_seconds: 45,
    is_sandboxed: true
  },

  'vercel/ms': {
    runtime: 'Node.js 22.4.1',
    package_manager: 'npm',
    install_command: 'npm install',
    build_command: 'npm run build',
    test_command: 'npm test',
    status: 'Verified',
    execution_timestamp: '2026-09-19T18:40:02Z',
    total_duration_ms: 1840,
    steps: [
      {
        name: 'install',
        command: 'npm install',
        status: 'completed',
        exit_code: 0,
        duration_ms: 780,
        stdout: 'added 24 packages in 0.76s\nfound 0 vulnerabilities\n',
        stderr: ''
      },
      {
        name: 'build',
        command: 'npm run build',
        status: 'completed',
        exit_code: 0,
        duration_ms: 460,
        stdout: '> ms@3.0.0 build\n> tsc\n',
        stderr: ''
      },
      {
        name: 'test',
        command: 'npm test',
        status: 'completed',
        exit_code: 0,
        duration_ms: 600,
        stdout: '> ms@3.0.0 test\n> vitest run\n\n ✓ src/index.test.ts (24 tests)\n\nTest Files  1 passed (1)\n     Tests  24 passed (24)\n  Duration  0.58s\n',
        stderr: ''
      }
    ],
    sandbox_provider: 'AWS ECS / Fargate (MicroVM Isolation)',
    cpu_limit: '1 vCPU',
    memory_limit: '2 GB',
    timeout_seconds: 30,
    is_sandboxed: true
  },

  'example/broken-build': {
    runtime: 'Node.js 20.18.0 (Detected)',
    package_manager: 'pnpm',
    install_command: 'pnpm install --frozen-lockfile',
    build_command: 'pnpm run build',
    test_command: 'pnpm test',
    status: 'Partially Verified',
    execution_timestamp: '2026-09-19T18:42:10Z',
    total_duration_ms: 8200,
    failure_stage: 'build',
    error_summary: 'Build expects Node.js >=22.0.0 for V8 isolate snapshot features, but container ran Node 20.18.0.',
    recommended_fix: 'Switch your local runtime to Node.js 22 (`nvm use 22`) before executing `pnpm run build`.',
    steps: [
      {
        name: 'install',
        command: 'pnpm install --frozen-lockfile',
        status: 'completed',
        exit_code: 0,
        duration_ms: 3800,
        stdout: 'Lockfile is up to date, resolution step skipped\nPackages: +142\n++++++++++++++++++++++++++++++++++++++++++\nPackages are hard linked from the content-addressable store to the virtual store.\nProgress: resolved 142, reused 142, downloaded 0, added 142, done\n',
        stderr: ''
      },
      {
        name: 'build',
        command: 'pnpm run build',
        status: 'failed',
        exit_code: 1,
        duration_ms: 4400,
        stdout: '> analytics-engine@2.0.0 build\n> node-gyp rebuild && tsc\n\ngyp info it worked if it ends with ok\ngyp info using node-gyp@10.1.0\ngyp info using node@20.18.0 | linux | x64\n',
        stderr: 'error: package.json engine constraint mismatch:\nExpected Node.js version >=22.0.0 for V8 ArrayBuffer detach support, received 20.18.0\n\ngyp ERR! build error\ngyp ERR! SystemError [ERR_ENGINE_UNSUPPORTED]: Unsupported engine',
        error_summary: 'Engine constraint mismatch: requires Node.js >=22.0.0'
      },
      {
        name: 'test',
        command: 'pnpm test',
        status: 'skipped',
        duration_ms: 0,
        stdout: '',
        stderr: '# Step skipped due to build failure.'
      }
    ],
    sandbox_provider: 'AWS ECS / Fargate (MicroVM Isolation)',
    cpu_limit: '1 vCPU',
    memory_limit: '2 GB',
    timeout_seconds: 45,
    is_sandboxed: true
  },

  'example/unsupported-stack': {
    runtime: 'Bare-Metal Rust / Zig (no_std)',
    package_manager: 'cargo',
    install_command: undefined,
    build_command: undefined,
    test_command: undefined,
    status: 'Unsupported Stack',
    execution_timestamp: '2026-09-19T18:45:00Z',
    total_duration_ms: 400,
    failure_stage: 'stack_compatibility',
    error_summary: 'FirstPR container sandbox currently supports JavaScript, TypeScript, Python, and standard Go environments. Bare-metal microcontroller targets without POSIX runtimes are unsupported for automated cloud execution.',
    recommended_fix: 'Use a local hardware simulator or ARM QEMU target for embedded testing.',
    steps: [],
    sandbox_provider: 'AWS ECS / Fargate (MicroVM Isolation)',
    cpu_limit: '1 vCPU',
    memory_limit: '2 GB',
    timeout_seconds: 30,
    is_sandboxed: true
  }
};
