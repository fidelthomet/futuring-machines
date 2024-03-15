# futuring machines

Interface for LLM-Human co-writing of future stories.

## Project Setup

### Requirements

- [Node.js](https://nodejs.org/en)
- [Ollama](https://ollama.com) or an API exposing a comparable `api/generate` [endpoint](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion).

### Interface

install dependencies
```sh
npm install
```

compile and hot-reload for development
```sh
npm run dev
```

compile and minify for production
```sh
npm run build
```

lint with [ESLint](https://eslint.org/)
```sh
npm run lint
```

### Specify Model and API URL
Open the `.env` file and set the `VITE_MODEL` and `VITE_API_URL` environment variables accordingly. When using Ollama you'll need to pull the model before using it.

```
VITE_MODEL=mistral
VITE_API_URL=http://localhost:11434/api/generate
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).