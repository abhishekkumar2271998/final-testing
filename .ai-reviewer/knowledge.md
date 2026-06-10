# stenoai reviewer notes

## Architecture
The StenoAI repository consists of a hybrid application combining a Python backend for audio processing and a React frontend (built using Electron and Vite) for the desktop application. The structure separates the application into distinct components: the `src` directory for Python scripts that handle audio recording, transcription, and summarization, and the `app` directory housing the Electron app with its renderer and main process code.

## Conventions
- **File Structure**: The main project structure includes `app/` for the Electron application and `src/` for the Python backend. Key files include `simple_recorder.py` for CLI interface and `audio_recorder.py`, `transcriber.py`, and `summarizer.py` under `src/` for core functionality.
- **JavaScript Patterns**: Within the JavaScript code, consistent usage of `const` and `let` instead of `var` is expected. File paths in the `vite.config.ts` illustrate a clear alias strategy for better import management.
- **Coding Standards**: 
  - Python code should conform to PEP 8 guidelines, utilize type hints, and include docstrings. The use of `ruff` as a linter is enforced.
  - In JavaScript and TypeScript, semicolons are mandatory, and existing patterns should be followed.
- **Environment Management**: The usage of a `.env` configuration to load environment variables is a common convention, noted in the `main.js` file.

## Intentional non-standard choices
- The project utilizes a custom script in `mic-monitor/Makefile` to compile a Swift application for microphone monitoring, which is platform-specific but serves a unique purpose for audio capture. This choice may raise warnings in other tools; however, it provides necessary functionality for the application.
- The Electron application uses various dependencies without following a strict version pinning mechanism outside of the `requirements.txt`, which may look inconsistent but allows for flexibility in dependency management.

## Watch out for
- **Type Safety**: Ensure all TypeScript code adheres to strict typing to prevent runtime errors, as implied by settings like `"strict": true` in `tsconfig.json`.
- **React Development Standards**: Inspect for proper usage of hooks and patterns to prevent stale closures and unnecessary re-renders. Also, keep an eye on dependency arrays in hooks for potential issues.
- **Python Dependency Management**: Be cautious of version conflicts in `requirements.txt`, particularly with major dependencies like Django or libraries critical to audio processing.
- **Environment Risks**: The reliance on local environment variables to store sensitive information (like API keys) can pose security risks if not managed properly. Ensure sensitive files are `.gitignored`.
- **Cross-Platform Compatibility**: The assumption of running exclusively on macOS (as noted in `README.md`) may limit testing or contributions from Windows or Linux users; clarify this in guidelines to avoid community confusion.