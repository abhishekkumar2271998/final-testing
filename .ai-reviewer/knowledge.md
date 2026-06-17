# stenoai reviewer notes

## Architecture
The `stenoai` repository consists of a macOS desktop application built using Electron for the front-end and a Python backend handling audio processing and data models. The project structure is divided into two main directories: `app` for the Electron application and `src` for the Python backend which includes modules for audio recording and transcription. Additionally, there is a `server` directory for the backend REST API, which supports user authentication and product management.

## Conventions
- **Python Coding Style**: Adheres to PEP 8 guidelines with type hints and docstrings mandated. The `requirements.txt` specifies dependencies, with versioning to ensure compatibility, e.g., `numpy>=1.24.0,<2.0`.
- **JavaScript Coding Style**: Uses semicolons consistently and prefers `const/let` over `var`. The `app` directory contains the `package.json`, which includes predefined scripts for starting and building the application and running linters and tests.
- **File Structure**: Follows a logical organization, with directories clearly delineating app components such as `app` for frontend, `src` for backend logic, and `server` for the REST API. For example, `src/audio_recorder.py` handles audio input, whereas `server/README.md` provides setup instructions for the API.
- **Tailwind CSS Setup**: The styles for the application UI are managed using Tailwind CSS, emphasizing utility-first CSS and configuration in `tailwind.config.cjs` within the `renderer` subdirectory of `app`.

## Intentional non-standard choices
- **Manual Semantic Versioning**: Versioning is handled manually within the `package.json` using scripts for patch, minor, and major versions rather than automated tooling. This allows greater control but may introduce risks of oversight during releases.
- **No Default Protocol for Windows**: The application is currently built exclusively for macOS with a mention of future Windows support, and operations dependent on macOS-specific features are gated accordingly.

## Watch out for
- **Ignoring ESLint/Prettier Errors**: Ensure all JavaScript/TypeScript files adhere to the rules set in ESLint and Prettier configurations, as non-compliance might lead to inconsistent code styling.
- **Backend API Endpoint Expectations**: The renderer expects the API hosted at `http://127.0.0.1:8000/api`, so any changes in the server configuration may cause failures in the application if they don't align with this path.
- **Dotenv Loading**: Verify that environment variables are correctly loaded as per the `loadDotEnv` function in `app/main.js`, especially in production builds, to avoid issues with missing credentials.
- **Resource Cleanup**: Ensure resources opened during application usage (such as microphone streams) are properly managed and closed to prevent resource leaks, particularly in event-driven contexts like Electron apps.