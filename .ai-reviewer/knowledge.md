# final-testing reviewer notes

## Architecture
The `final-testing` repository is primarily organized into a Python backend and an Electron frontend. The backend, located in the `src/` directory, handles audio recording and processing, while the Electron app in the `app/` directory provides a user interface built with React and Vite. This structure supports modular development for the Python and JavaScript components, allowing for separate yet cohesive evolution of the respective parts.

## Conventions
- The Python code adheres to PEP 8 guidelines and requires type hints and docstrings for all functions and classes, which is indicated in `CONTRIBUTING.md`.
- JavaScript files must use semicolons and prefer `const` and `let` over `var`; this can be seen in files like `app/main.js` and `app/package.json`.
- The repository uses Tailwind CSS for styling, as specified in `app/renderer/tailwind.config.cjs`, which extends default themes and supports responsive design.
- Standard task commands for development (like linting and building) are defined in `app/package.json` scripts, e.g., `npm run build` for packaging the Electron app.
- Versioning follows a manual semantic versioning scheme, as outlined in `CONTRIBUTING.md`.

## Intentional non-standard choices
- The Electron app uses a custom URL protocol (`stenoai://`) to handle shortcuts for recording sessions. This requires specific handling in the main process (`app/main.js`), which includes functions to parse and execute shortcuts, preventing the standard usage of URL handling by the browser context.
- The backend executable path varies based on whether the application is running in development or production, which is managed in `app/main.js`. This flexibility differentiates deployment needs without reliance on environmental variables.

## Watch out for
- Ensure all functions and methods include appropriate error handling, especially around external service calls (e.g., API interactions) found in `app/main.js` and Python files.
- Avoid manipulating global state within functions unnecessarily, especially in event handlers in `app/main.js`; this can lead to race conditions.
- Watch out for excessive reliance on implicit variable types in JavaScript, as TypeScript's strictness in `app/renderer/tsconfig.json` is intended to avoid runtime issues.
- Consistency in naming conventions across different languages could lead to confusion; for example, ensure that API endpoints used in the Python backend (`server/README.md`) remain consistent with frontend expectations.
- Regularly maintain the documentation in `CONTRIBUTING.md` and other markdown files to reflect any new standards or conventions adopted in development.