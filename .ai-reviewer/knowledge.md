# final-testing reviewer notes

## Architecture
This codebase is an Electron application encapsulating a Python backend designed for recording, transcribing, and summarizing confidential conversations. The directory structure features `src/` for backend logic in Python, managing tasks like audio recording and integration with machine learning models, while `app/` contains the Electron framework with React for the frontend, indicating a clear separation between the UI and backend functionality.

## Conventions
- **File Structure**: The main project folders are `app/` for the Electron app and `src/` for the Python backend. Files like `simple_recorder.py` serve as entry points for command-line interactions, while specific features are modularized (e.g., `audio_recorder.py`, `transcriber.py`, `summarizer.py`).
- **Naming Conventions**: Python files follow snake_case (e.g., `simple_recorder.py`), while JavaScript files adhere to camelCase (e.g., `main.js`).
- **Linting and Formatting**: The team uses `ruff` for Python linting, ensuring adherence to PEP 8 guidelines, and `eslint` with Prettier for JavaScript, emphasizing the use of semicolons and avoiding `var`. Example: `app/package.json` setup includes scripts for linting with `"lint:renderer": "eslint renderer/src --ext .ts,.tsx"`.
- **Type Annotations**: Python files utilize type hints for clarity on data types, contributing to better readability and maintainability (e.g., functions in `src/transcriber.py`).
- **React Component Structure**: Components are organized into separate files and directories for logical groupings, ensuring clear separations of concerns, evident in `app/renderer/src/App.tsx` with route handling and UI composition.

## Intentional non-standard choices
- **Manual Semantic Versioning**: Instead of automation in versioning, the project employs manual semantic versioning through dedicated CLI commands in `app/package.json`. Contributors should be mindful to follow the established process for version increments.

## Watch out for
- **Ensure Environment Compatibility**: As development is strictly on macOS, code should be thoroughly tested within that environment, paying special attention to features that utilize system dependencies. The `CONTRIBUTING.md` indicates necessary dependencies such as `Ollama` and `ffmpeg` that must be installed for successful execution.
- **Testing Procedures**: Be aware of the requirement to run specific commands for testing the CLI and Electron app functionality before submitting pull requests (`python simple_recorder.py --help` and `cd app && npm start`).
- **Handling Asynchronous Logic in React**: The code may contain potential issues related to state management and component updates in React when handling asynchronous side effects. Review hooks and effect dependencies closely to prevent unexpected behavior. An example is the use of `useEffect` in `App.tsx` that manages the application's routing based on the current recording state.