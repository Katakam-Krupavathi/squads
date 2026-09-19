import json
import re
import yaml
from typing import Dict, List, Optional, Any, Tuple
from ..api.schemas import RepositoryStack

def detect_repository_stack(
    file_paths: List[str],
    manifest_contents: Dict[str, str],
    ci_workflow_contents: Dict[str, str]
) -> Tuple[RepositoryStack, Optional[str], Optional[str], Optional[str]]:
    """
    Detects repository stack, languages, frameworks, test framework, entry points,
    and derives safe execution commands (install, build, test).
    
    Returns:
        (RepositoryStack, install_command, build_command, test_command)
    """
    paths_set = set(file_paths)
    languages: Dict[str, float] = {}
    frameworks: List[str] = []
    package_manager = "unknown"
    test_framework = None
    test_locations: List[str] = []
    source_directories: List[str] = []
    entry_points: List[str] = []
    config_files: List[str] = []
    ci_workflows: List[str] = []
    
    install_command: Optional[str] = None
    build_command: Optional[str] = None
    test_command: Optional[str] = None
    
    # 1. Identify key config & CI files
    for path in file_paths:
        if path.startswith(".github/workflows/"):
            ci_workflows.append(path)
        if path in {"package.json", "pyproject.toml", "requirements.txt", "setup.py", "go.mod", "tsconfig.json", "Makefile", "Dockerfile"}:
            config_files.append(path)
        if any(path.startswith(prefix) for prefix in ["tests/", "test/", "__tests__/"]) or path.endswith(("_test.go", ".test.ts", ".test.js", ".spec.ts", ".spec.js", "test_.py", "_test.py")):
            test_locations.append(path)
        if any(path.startswith(prefix) for prefix in ["src/", "app/", "lib/", "internal/", "cmd/"]):
            dir_name = path.split("/")[0]
            if dir_name not in source_directories:
                source_directories.append(dir_name)
        if path in {"src/index.ts", "src/main.ts", "src/index.js", "src/main.js", "app.py", "main.py", "src/main.py", "cmd/main.go", "main.go"}:
            entry_points.append(path)

    # 2. Check Node / JS / TS Stack
    if "package.json" in manifest_contents:
        try:
            pkg_data = json.loads(manifest_contents["package.json"])
            primary_lang = "TypeScript" if ("tsconfig.json" in paths_set or any(p.endswith(".ts") or p.endswith(".tsx") for p in file_paths)) else "JavaScript"
            languages[primary_lang] = 85.0
            
            # Detect package manager
            if "pnpm-lock.yaml" in paths_set:
                package_manager = "pnpm"
            elif "yarn.lock" in paths_set:
                package_manager = "yarn"
            elif "bun.lock" in paths_set or "bun.lockb" in paths_set:
                package_manager = "bun"
            else:
                package_manager = "npm"
                
            deps = {**pkg_data.get("dependencies", {}), **pkg_data.get("devDependencies", {})}
            
            # Frameworks
            if "react" in deps:
                frameworks.append("React")
            if "next" in deps:
                frameworks.append("Next.js")
            if "vue" in deps:
                frameworks.append("Vue")
            if "express" in deps:
                frameworks.append("Express")
            if "fastify" in deps:
                frameworks.append("Fastify")
            if "tailwindcss" in deps:
                frameworks.append("Tailwind CSS")
            if "electron" in deps:
                frameworks.append("Electron")
                
            # Test frameworks
            if "vitest" in deps:
                test_framework = "Vitest"
            elif "jest" in deps:
                test_framework = "Jest"
            elif "mocha" in deps:
                test_framework = "Mocha"
            elif "playwright" in deps:
                test_framework = "Playwright"
            elif "cypress" in deps:
                test_framework = "Cypress"
                
            # Derive commands
            scripts = pkg_data.get("scripts", {})
            
            # Install command
            if package_manager == "pnpm":
                install_command = "pnpm install"
            elif package_manager == "yarn":
                install_command = "yarn install"
            elif package_manager == "bun":
                install_command = "bun install"
            else:
                install_command = "npm install"
                
            # Build command
            if "build" in scripts:
                build_command = f"{package_manager} run build"
                
            # Test command
            if "test" in scripts and "no test specified" not in scripts.get("test", ""):
                test_command = f"{package_manager} test"
            elif test_framework:
                test_command = f"{package_manager} test"
                
            stack = RepositoryStack(
                primary_language=primary_lang,
                languages=languages,
                frameworks=frameworks,
                package_manager=package_manager,
                test_framework=test_framework,
                test_locations=test_locations[:10],
                source_directories=source_directories,
                entry_points=entry_points,
                config_files=config_files,
                ci_workflows=ci_workflows
            )
            return stack, install_command, build_command, test_command
            
        except Exception:
            pass

    # 3. Check Python Stack
    if any(k in manifest_contents for k in ["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"]):
        primary_lang = "Python"
        languages["Python"] = 90.0
        
        # Package manager detection
        if "poetry.lock" in paths_set or ("pyproject.toml" in manifest_contents and "poetry" in manifest_contents["pyproject.toml"]):
            package_manager = "poetry"
            install_command = "poetry install"
            test_command = "poetry run pytest"
        elif "uv.lock" in paths_set:
            package_manager = "uv"
            install_command = "uv sync"
            test_command = "uv run pytest"
        elif "Pipfile" in manifest_contents:
            package_manager = "pipenv"
            install_command = "pipenv install"
            test_command = "pipenv run pytest"
        elif "requirements.txt" in manifest_contents:
            package_manager = "pip"
            install_command = "pip install -r requirements.txt"
            test_command = "pytest"
        else:
            package_manager = "pip"
            install_command = "pip install -e ."
            test_command = "pytest"
            
        # Detect frameworks & test framework from manifest contents
        all_py_text = " ".join(manifest_contents.values()).lower()
        if "fastapi" in all_py_text:
            frameworks.append("FastAPI")
        if "django" in all_py_text:
            frameworks.append("Django")
        if "flask" in all_py_text:
            frameworks.append("Flask")
        if "torch" in all_py_text or "pytorch" in all_py_text:
            frameworks.append("PyTorch")
        if "transformers" in all_py_text:
            frameworks.append("HuggingFace Transformers")
            
        if "pytest" in all_py_text or any("test" in p for p in paths_set):
            test_framework = "pytest"
        elif "unittest" in all_py_text:
            test_framework = "unittest"
            test_command = "python -m unittest discover"
            
        if "setup.py" in manifest_contents or "pyproject.toml" in manifest_contents:
            build_command = "python -m build"
            
        stack = RepositoryStack(
            primary_language=primary_lang,
            languages=languages,
            frameworks=frameworks,
            package_manager=package_manager,
            test_framework=test_framework,
            test_locations=test_locations[:10],
            source_directories=source_directories,
            entry_points=entry_points,
            config_files=config_files,
            ci_workflows=ci_workflows
        )
        return stack, install_command, build_command, test_command

    # 4. Check Go Stack
    if "go.mod" in manifest_contents:
        primary_lang = "Go"
        languages["Go"] = 95.0
        package_manager = "go modules"
        install_command = "go mod download"
        build_command = "go build ./..."
        test_command = "go test ./..."
        test_framework = "go test"
        
        stack = RepositoryStack(
            primary_language=primary_lang,
            languages=languages,
            frameworks=frameworks,
            package_manager=package_manager,
            test_framework=test_framework,
            test_locations=test_locations[:10],
            source_directories=source_directories,
            entry_points=entry_points,
            config_files=config_files,
            ci_workflows=ci_workflows
        )
        return stack, install_command, build_command, test_command

    # Fallback / General Detection
    primary_lang = "Unknown"
    if any(p.endswith((".js", ".jsx")) for p in paths_set):
        primary_lang = "JavaScript"
    elif any(p.endswith((".ts", ".tsx")) for p in paths_set):
        primary_lang = "TypeScript"
    elif any(p.endswith(".py") for p in paths_set):
        primary_lang = "Python"

    stack = RepositoryStack(
        primary_language=primary_lang,
        languages={primary_lang: 100.0} if primary_lang != "Unknown" else {},
        frameworks=frameworks,
        package_manager=package_manager,
        test_framework=test_framework,
        test_locations=test_locations[:10],
        source_directories=source_directories,
        entry_points=entry_points,
        config_files=config_files,
        ci_workflows=ci_workflows
    )
    return stack, install_command, build_command, test_command
