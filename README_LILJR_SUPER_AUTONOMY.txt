# Lil Jr Super Autonomy Mode

## Features
- Fully local build, deploy, and automation
- Plugin/extension system (add any tool or module)
- Local knowledge base for all code, data, and findings
- No external platform or cloud lock-in

## How to Enable
1. Set `SUPER_AUTONOMY=true` in your `.env` file
2. Start the backend: `uvicorn server:app --reload`
3. Use `/api/super_autonomy/*` endpoints for build, deploy, plugins, and learning

## Adding Plugins
- Place any Python file with a `run(**kwargs)` function in the `plugins/` directory
- Call `/api/super_autonomy/run_plugin` with `{ "plugin": "your_plugin", "args": { ... } }`

## Next Steps
- Connect frontend to backend using your phone's IP
- Use Lil Jr as your all-in-one automation and control center
