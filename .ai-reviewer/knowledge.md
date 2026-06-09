# StenoAI reviewer notes

## Architecture
This codebase is for StenoAI, an AI-powered application designed for recording, transcribing, and summarizing meetings. It is structured into a Python backend residing in the `src/` directory for audio processing and a React frontend in the `app/` directory, utilizing Electron to package the application for macOS. The project also includes a CLI interface with `simple_recorder.py` for standalone functionality.

## Conventions
- **Directory Structure**: The repository contains a clear separation of concerns. The `src/` directory holds the Python modules such as `audio_recorder.py` and `transcriber.py`, while the `app/` directory contains the Electron application, including the main process (`main.js`), renderer code, and assets.
- **Python Code Style**: Adhere to PEP 8 guidelines as specified in `CONTRIBUTING.md`. Use type hints and ensure functions have docstrings.
- **JavaScript/TypeScript Style**: Use `const` and `let` instead of `var`. Emphasize the use of semicolons, as indicated in `CONTRIBUTING.md`.
- **Testing**: Ensure all PRs confirm the functionality of the CLI and Electron app. This includes running `python simple_recorder.py --help` and `npm start` for the app.
- **Tailwind CSS Configuration**: Use Tailwind's classes defined in `tailwind.config.cjs` for styling in the renderer, ensuring adherence to the established theme and responsive design guidelines.

## Intentional non-standard choices
- The project utilizes local processing for AI tasks, which may appear inefficient in comparison to cloud-based solutions. However, this design prioritizes user privacy and meets the confidentiality requirements of its target audience in legal and governmental sectors.

## Watch out for
- **Hardcoded Paths and Credentials**: Ensure that sensitive information or local paths are managed correctly, adhering to security practices by utilizing a `.env` file for configuration.
- **Inefficient State Management**: In the React components, ensure that performance is optimized, e.g., by using `useMemo` and `useCallback` as necessary, which appears to be a concern in `App.tsx` with multiple hooks managing component states.
- **Error Handling**: The main process could benefit from more robust error handling, specifically in network calls and external interactions, to improve user experience and application reliability.
- **Potential Global State Dependencies**: Examine the use of global services like `ipc` and `PostHog` in `App.tsx` and ensure they do not create hidden dependencies that affect component rendering.

This reviewer playbook ensures a consistent understanding of the conventions and architecture of the StenoAI codebase, aiding efficient code reviews while maintaining the overall quality and integrity of the project.