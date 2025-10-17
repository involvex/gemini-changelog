# Gemini Changelog Writer

A command-line tool that uses Google's Gemini AI to automatically generate a `CHANGELOG.md` file from your git log.

## Features

*   Generates a changelog from your git commit history.
*   Uses Google's Gemini AI to create structured and readable changelog entries.
*   Reads your Gemini API key from an environment variable (`GEMINI_API_KEY`) or from `~/.gemini/settings.json`.
*   Simple to use with `npx` or by installing globally.

## Installation

To install the tool globally, run:

```bash
npm install -g @involvex/gemini-changelog
```

## Usage

1.  **Set up your Gemini API Key:**

    You can either set it as an environment variable:
    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

    Or, you can create a file at `~/.gemini/settings.json` with the following content:
    ```json
    {
      "geminiApiKey": "YOUR_API_KEY"
    }
    ```

2.  **Run the tool:**

    If you have installed it globally, the command will be based on the `bin` name in `package.json`.

    Or, you can run it directly with `npx`:
    ```bash
    npx @involvex/gemini-changelog
    ```

    The tool will create or overwrite the `CHANGELOG.md` file in your current project directory.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
