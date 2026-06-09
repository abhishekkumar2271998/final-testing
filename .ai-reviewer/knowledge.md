# final-testing reviewer notes

## Architecture
This repository implements "Steno," an AI-powered tool designed for recording, transcribing, and summarizing meetings, with a primary focus on privacy as all operations are performed locally on macOS. The project is structured into a Python backend within the `src/` directory for audio processing and summarization, and an Electron-based frontend located in the `app/` directory, which uses React and Vite for the user interface.

## Conventions
- **File Naming and Structure**: The repo follows a clear directory structure with distinct folders for the Electron app (`app/`) and the Python backend (`src/`). Key files include `simple_recorder.py` for the CLI interface and `main.js` for the Electron main process.
- **JavaScript and TypeScript**: The frontend leverages React with TypeScript. The team uses `eslint` for linting and follows a style that enforces the use of semicolons, and `const/let` instead of `var`, as stated in the `CONTRIBUTING.md` file.
- **Python Code Style**: Python files are expected to adhere to PEP 8 guidelines, include type hints, and contain docstrings, helping maintain clarity and consistency across the codebase.
- **Tailwind CSS**: The app's UI uses Tailwind CSS for styling, configured in `app/renderer/tailwind.config.cjs`. The theme is extended with custom colors, font families, and animations.
- **Environment Variables**: The backend uses a `.env` strategy for configuration, ensuring sensitive data is managed securely.

## Intentional non-standard choices
- **Single Responsibility in IPC**: The use of the IPC (Inter-Process Communication) bridge between Electron and React is implemented with a clear contract setup in `preload.js`, ensuring separation of concerns and preventing the renderer from direct access to Electron internals. This pattern, while potentially complex, is designed to enhance security and modularity.
- **Manual Semantic Versioning**: Instead of using automated tools for versioning, the team engages in manual semantic versioning, which is defined in the `CONTRIBUTING.md` as the responsibility of maintainers. This could lead to inconsistency if not are adhered to strictly.

## Watch out for
- **Error Handling**: Be vigilant regarding areas in the code where error handling is minimal or absent, particularly around file operations, network requests, and environment loading.
- **Performance Measurement**: Ensure that performance-impacting operations in `electron-updater` and `audio-loopback` have proper metrics and checks, as issues in these areas could severely affect user experience.
- **Security in IPC communications**: Always audit the IPC channels (`send`, `invoke`) to ensure that the data transmitted does not expose sensitive user data, especially when connecting with external services like Google Calendar.
- **Testing Coverage**: Review the coverage of tests, particularly for edge cases in the audio processing logic, especially in files like `src/audio_recorder.py` and `src/transcriber.py`, given the potential variability with different audio inputs.