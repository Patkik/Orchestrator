# 🚀 @anedezorchestrator/orchestrator-essentials-setup

> **One command to set up your entire agentic workflow environment.**

A powerful Node.js CLI tool that bootstraps new workspaces with your Orchestrator essentials, Python environments, VS Code extensions, and git configuration — all in seconds.

```bash
# Install globally
npm install -g @anedezorchestrator/orchestrator-essentials-setup

# Or use instantly with npx (no installation required)
npx @anedezorchestrator/orchestrator-essentials-setup

# Or run the aliased command
orch-setup
```

## ✨ Features

✅ **Interactive or CLI-based setup** - Choose your style  
✅ **Cross-platform** - Windows, macOS, Linux  
✅ **Directory scaffolding** - Auto-creates project structure  
✅ **Git integration** - Initialize repos, add hooks, clone templates  
✅ **Python environment** - Virtual env setup + dependencies  
✅ **VS Code ready** - Extensions, settings, debug configs  
✅ **Production-ready** - Error handling, progress indicators, rollback support  
✅ **Highly configurable** - CLI args, interactive prompts, or both  

## 📦 What Gets Set Up

### Directory Structure
```
your-workspace/
├── src/                 # Source code
├── tests/              # Test files
├── scripts/            # Automation scripts
├── context/            # Agentic context files
├── documentation/      # Project docs
└── .github/            # GitHub workflows
```

### Python Environment
- Virtual environment in `.venv/`
- Essential dependencies installed:
  - `pytest` - Testing framework
  - `ruff` - Fast Python linter
  - `mypy` - Static type checker
  - `python-dotenv` - Environment management
- `pyproject.toml` template included

### VS Code Configuration
- Recommended extensions list
- Python debugging configuration
- Workspace settings for best DX
- Extension auto-install (optional)

### Git Setup
- Repository initialization
- Pre-commit hooks
- `.gitignore` configured
- Orchestrator template (optional)

## 🎯 Quick Start

### Option 1: Interactive Mode (Recommended)

```bash
npx @anedezorchestrator/orchestrator-essentials-setup
```

You'll be prompted for:
- Where to set up (default: current directory)
- How to get templates (copy vs git submodule)
- Python environment (yes/no)
- VS Code extensions (yes/no)
- Git repository (yes/no)

### Option 2: CLI Arguments

```bash
orchestrator-essentials-setup init \
  --target ~/my-project \
  --mode copy \
  --python \
  --vscode \
  --force
```

### Option 3: In Your Existing Project

```bash
cd /path/to/existing/project
orchestrator-essentials-setup init --mode copy
```

## 🛠️ Configuration Options

### `init` Command

```
init [targetPath]               Set up at specified path

Options:
  --target <path>              Target workspace path
  --mode <copy|submodule>      Installation mode (default: submodule)
  --branch <name>              Git branch (submodule mode)
  --repo-url <url>             Repository URL (submodule mode)
  --python                     Install Python environment
  --vscode                     Install VS Code extensions
  --no-git                      Skip git initialization
  --force                       Overwrite existing setup
  -h, --help                    Show help
```

### Examples

```bash
# Fresh project with everything
orch-setup init /home/user/new-project --mode copy --python --vscode

# Existing project, add Orchestrator only
orch-setup init --target . --mode submodule

# Minimal setup, git-based
orch-setup init --mode submodule --branch develop
```

## 📋 Usage Scenarios

### Scenario 1: Start a Brand New Project

```bash
mkdir my-agentic-app
cd my-agentic-app
npx @anedezorchestrator/orchestrator-essentials-setup init --mode copy --python --vscode
```

**Result:** Fresh project with all essentials, Python venv ready, VS Code configured.

### Scenario 2: Integrate into Existing Project

```bash
cd /path/to/my-project
orch-setup init --target . --mode submodule
```

**Result:** Orchestrator added as git submodule, project structure remains intact.

### Scenario 3: Team Onboarding

Add to your team's `README.md`:

```markdown
## Setup

```bash
npx @anedezorchestrator/orchestrator-essentials-setup
```

Your environment will be ready in under 60 seconds!
```

## 🔧 What Happens During Setup

1. **Validation** - Checks paths, permissions, existing files
2. **Directory Structure** - Creates folders as needed
3. **Repository** - Initializes git or clones template
4. **Python Environment** - Creates venv and installs deps
5. **VS Code** - Sets up extensions and configs
6. **Git Hooks** - Installs pre-commit hooks if needed
7. **Completion** - Displays success summary

## 🚨 Error Handling

The CLI includes comprehensive error handling:

```bash
# Path validation
❌ Error: Target directory does not exist and --force not set
→ Solution: Run with --force to create the path

# Git setup
❌ Error: Git not found on system
→ Solution: Install Git from https://git-scm.com

# Python
❌ Error: Python 3.10+ not found
→ Solution: Install from https://python.org

# Permissions
❌ Error: Permission denied at target path
→ Solution: Ensure you have write permissions
```

## 💾 Global Installation

For repeated use without npx:

```bash
# Install globally
npm install -g @anedezorchestrator/orchestrator-essentials-setup

# Use anytime, anywhere
orch-setup init ~/projects/new-agent-platform
```

## 🔐 System Requirements

- **Node.js:** 16.0.0+
- **npm:** 7.0.0+
- **Python:** 3.10+ (optional, only if `--python` flag used)
- **Git:** 2.0+ (optional, only if `--mode submodule` used)

## 📖 Advanced Usage

### Custom Templates

To use custom templates, modify the templates folder in the package and rebuild:

```bash
npm run build
npm link  # Re-link globally
```

### Dry Run (Show What Would Happen)

```bash
# Run with --verbose for detailed output
orchestrator-essentials-setup init --target /tmp/test --verbose
```

### Development Mode (From Source)

```bash
# Clone this repo
git clone https://github.com/anedezorchestrator/orchestrator-essentials-setup.git
cd orchestrator-essentials-setup

# Install dependencies
npm install

# Link locally
npm link

# Test
orchestrator-essentials-setup --version
```

## 🐛 Troubleshooting

### Command Not Found After Global Install

```bash
# Verify npm global path
npm config get prefix

# Add to PATH (Windows PowerShell)
$env:Path += ";$(npm config get prefix)"

# Or reinstall
npm install -g @anedezorchestrator/orchestrator-essentials-setup
```

### Permission Denied on macOS/Linux

```bash
# Use sudo for global install
sudo npm install -g @anedezorchestrator/orchestrator-essentials-setup

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Virtual Environment Not Activating

```bash
# Manually activate after setup
source .venv/bin/activate    # macOS/Linux
.\.venv\Scripts\Activate     # Windows PowerShell
```

## 🤝 Contributing

Issues and PRs welcome! This package follows standard npm conventions.

```bash
# Report issues: GitHub Issues
# Submit PRs: Fork → Branch → Pull Request
```

## 📄 License

MIT - See LICENSE file

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@anedezorchestrator/orchestrator-essentials-setup)
- [Orchestrator GitHub](https://github.com/its-patri/Orchestrator)
- [Publishing Guide](./PUBLISHING.md)
- [npm Scoped Packages](https://docs.npmjs.com/cli/v8/using-npm/scope)

## � References & Attribution

### Inspired By
- **npm Scoped Packages Documentation** - [docs.npmjs.com](https://docs.npmjs.com/cli/v8/using-npm/scope)
- **create-react-app Project** - Boilerplate generation patterns
- **Agentic Design Patterns** - Antonio Gulli's "Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems"
- **Node.js Best Practices** - Official Node.js CLI patterns and recommendations
- **GitHub Actions Documentation** - CI/CD automation workflows

### Built With
- **Commander.js** - Command line interface framework
- **Inquirer.js** - Interactive command line prompts
- **Chalk** - Terminal color styling
- **Ora** - Progress spinners and indicators
- **fs-extra** - File system enhancements
- **simple-git** - Git operations wrapper

## 📞 Support

- **Documentation:** Check the README and PUBLISHING.md
- **Issues:** Open a GitHub issue with reproduction steps
- **Questions:** Ask on GitHub Discussions

---

**Created by Patrick Josh Añedez**  
**Orchestrator Project Team**  
Made with ❤️ for the agentic AI community
