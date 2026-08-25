# stenoai reviewer notes

## Architecture
The StenoAI repository features a desktop application built with Electron, consisting of a Python backend and a React front end. The project structure is separated into an 'app' folder for the Electron application and a 'src' folder for the Python backend, with additional folders for requirements and documentation.

## Conventions
- **Python Code Style**: The team adheres to PEP 8 standards, utilizes type hints, and mandates docstrings for functions and classes. As specified in `CONTRIBUTING.md`, `ruff` is used for linting with the command: `ruff check .`.
- **JavaScript/React Style**: Semicolons are required, and `let/const` should be used instead of `var`. The expected build process uses `vite` for building and `eslint` for linting the React code, found in `app/package.json`.
- **File Organization**: The primary JavaScript files for the Electron app are organized under `app/` with clear names indicating their purpose (e.g., `main.js` for the main process and `renderer/` for React components). Python scripts are organized in `src/` reflecting distinct functionalities (`audio_recorder.py`, `transcriber.py`, `summarizer.py`, and `models.py`).
- **Testing**: Python tests require validating CLI functionality with `python simple_recorder.py --help` and ensuring the Electron app launches as stated. `npm start` initiates the app in a developer mode, also mentioned in `CONTRIBUTING.md`.

## Intentional non-standard choices
- **Application Requirements**: StenoAI is built primarily for macOS, requiring a specific setup that includes the installation of dependencies like Ollama and ffmpeg, as mentioned in the `CONTRIBUTING.md` setup instructions. This is a conscious decision reflected in the `README.md`, restricting the user base.
- **Manual Semantic Versioning**: Unlike automated versioning, the project uses manual semantic versioning for releases, which allows maintainers control over version increments and is documented clearly in `CONTRIBUTING.md`.

## Watch out for
- **Incomplete Docstrings**: Reviewers should ensure that all functions and classes have comprehensive docstrings as the team emphasizes documentation.
- **Excessive Dependencies**: Given the wide range of dependencies (e.g., numerous Python packages in `requirements.txt`), be cautious about unnecessary or redundant imports, especially in `src/` files which could lead to a bloated environment.
- **Platform-Specific Features**: The code should be scrutinized for hardcoded paths or features that function only on macOS and lack fallbacks for other OS types, especially in `app/main.js`.
- **Linting and Formatting**: Ensure that both Python and JavaScript follow the specified linting rules in `CONTRIBUTING.md` to maintain code quality and consistency.