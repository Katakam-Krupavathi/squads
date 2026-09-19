import json
from app.ingestion.stack_detector import detect_repository_stack

def test_detect_js_ts_stack():
    file_paths = [
        "package.json",
        "tsconfig.json",
        "src/index.ts",
        "tests/index.test.ts"
    ]
    manifests = {
        "package.json": json.dumps({
            "name": "my-ts-app",
            "scripts": {
                "build": "tsc",
                "test": "vitest run"
            },
            "devDependencies": {
                "typescript": "^5.0.0",
                "vitest": "^1.0.0"
            }
        })
    }
    stack, install_cmd, build_cmd, test_cmd = detect_repository_stack(file_paths, manifests, {})
    assert stack.primary_language == "TypeScript"
    assert stack.package_manager == "npm"
    assert stack.test_framework == "Vitest"
    assert install_cmd == "npm install"
    assert build_cmd == "npm run build"
    assert test_cmd == "npm test"

def test_detect_python_stack():
    file_paths = [
        "pyproject.toml",
        "src/main.py",
        "tests/test_main.py"
    ]
    manifests = {
        "pyproject.toml": """
[tool.poetry]
name = "fastapi-demo"
[tool.poetry.dependencies]
fastapi = "^0.110.0"
pytest = "^8.0.0"
"""
    }
    stack, install_cmd, build_cmd, test_cmd = detect_repository_stack(file_paths, manifests, {})
    assert stack.primary_language == "Python"
    assert stack.package_manager == "poetry"
    assert "FastAPI" in stack.frameworks
    assert stack.test_framework == "pytest"
    assert install_cmd == "poetry install"
