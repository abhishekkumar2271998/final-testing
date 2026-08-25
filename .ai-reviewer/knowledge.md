# StenoAI reviewer notes

## Architecture
The StenoAI codebase is structured into two main components: a Python backend located in the `src/` directory, handling audio recording, transcription, and summarization, and an Electron application in the `app/` directory for the desktop interface built with React and Vite. The backend exposes command-line functionality via `simple_recorder.py`, while the frontend handles user interactions and displays results.

## Conventions
- **Python Code Style**: Adhere to PEP 8 guidelines, using type hints and docstrings throughout. For instance, the functions in `src/audio_recorder.py` use type hints for parameters and return types. 
- **JavaScript Formatting**: Always use semicolons and prefer `const`/`let` over `var` in all JS files like `app/main.js`.
- **File Structure**: The project contains a clear separation of concerns where the `src/` directory contains backend code and the `app/` directory encompasses the frontend. Additionally, `mic-monitor/` contains a Makefile for building a macOS helper utility, indicating a structured approach to platform-specific needs.
- **Version Control**: Follow a standard branching strategy where a feature branch is created for all new developments (`git checkout -b feature/your-feature-name`), as outlined in `CONTRIBUTING.md`.

## Intentional non-standard choices
- **Local .env Variable Loader**: The application loads environment variables without using a dependency like `dotenv`. Instead, it reads a `.env` file in `app/main.js` directly, which is a simplification to avoid extra library overhead while still achieving similar results.
- **Manual Semantic Versioning**: Instead of using automated versioning tools, the repository opts for manual semantic versioning managed through scripts in `app/package.json`, which could be seen as a deviation from common practice but allows for more tailored version management specific to release contexts.

## Watch out for
- **Designate API Base URL**: Ensure the `VITE_API_BASE_URL` is set correctly when building the Electron app to avoid runtime errors when expecting the backend API at `http://127.0.0.1:8000/api`.
- **Sourcemaps in Production**: Sourcemaps are included in development but excluded in production builds within `app/vite.config.ts` to prevent exposing source code, so ensure this convention is followed strictly to maintain security.
- **Backend Status Checking**: Be aware that calls to check backend recording status should handle multiple retry attempts as per `app/main.js`. Incorrect handling may lead to missing notifications for shortcut actions.

Carefully adhere to these notes during code review to maintain code quality and ensure usability across platforms and environments.