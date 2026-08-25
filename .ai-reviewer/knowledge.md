# final-testing reviewer notes

## Architecture
The `final-testing` codebase is structured to provide an AI-driven recording, transcription, and summarization tool designed for confidential conversations. It is organized into two main components: the Electron app (located in the `app/` directory) and the Python backend (in the `src/` directory). The `server/` folder contains a Django REST API for user authentication and interactions, while `mic-monitor/` holds utility scripts for audio monitoring.

## Conventions
- **File Structure**: The project is divided into logical directories: 
  - `app/`: Contains the Electron application source code, including renderer and main process files.
  - `src/`: Houses the Python modules for audio recording (`audio_recorder.py`), transcription (`transcriber.py`), and summarization (`summarizer.py`).
- **Python Conventions**: 
  - Code must follow PEP 8 guidelines, including the use of type hints and comprehensive docstrings.
  - Static analysis and linting should be conducted using `ruff` (`ruff check .`).
- **JavaScript Conventions**: 
  - Files should use semicolons, and `const`/`let` should be favored over `var`.
  - All React components must adhere to the patterns already established within the codebase.
- **Environment Management**: A `.env` configuration file is used to manage secrets without needing external dependencies, as indicated in `app/main.js`.
  
## Intentional non-standard choices
- **Proprietary Audio Tracking**: In `app/main.js`, custom logic handles audio capturing, which may not conform to expected patterns in similar applications. The logic allows dynamic session name sanitization to handle user-visible names while avoiding unsupported characters. The use of `electron-audio-loopback` for managing audio capture ensures adherence to macOS specifications.
- **Manual Semantic Versioning**: While software projects commonly automate versioning upon deployment, this repository follows a manual versioning process to enable closer control by maintainers as stated in `CONTRIBUTING.md`.

## Watch out for
- **Redundant Imports**: Ensure that there are no unused imports in both Python and JavaScript files; this can lead to unnecessary complications during code reviews.
- **Error Handling**: Pay attention to areas in the code where exceptions are caught and logged but not adequately handled or rethrown, particularly in user authentication flows within the Django API (`server/README.md`).
- **Environment Variable Management**: Confirm that all necessary environment variables are defined in the local setup instructions to avoid runtime errors when starting components. Missing values can lead to crashes when the application attempts to access absent configurations.