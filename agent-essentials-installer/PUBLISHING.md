# Publishing @anedezorchestrator/orchestrator-essentials-setup

This guide walks you through publishing the CLI package to npm for distribution.

## Prerequisites

1. **Node.js & npm** - v16 or higher
2. **npm Account** - Create at [npmjs.com](https://www.npmjs.com)
3. **Git** - For version control and releases

## Step 1: NPM Account Setup

If you don't have an npm account:

```bash
npm adduser
# Follow prompts to create account
```

If you already have an account:

```bash
npm login --scope=@anedezorchestrator --registry=https://registry.npmjs.org
# Enter your username, password, and 2FA code if enabled
```

## Step 2: Verify Authentication

```bash
npm whoami --scope=@anedezorchestrator
# Should display your npm username
```

## Step 3: Update Version

Before publishing, update the version in `package.json`:

```bash
# Patch version (bug fix: 1.0.0 → 1.0.1)
npm version patch

# Minor version (new feature: 1.0.0 → 1.1.0)
npm version minor

# Major version (breaking change: 1.0.0 → 2.0.0)
npm version major
```

## Step 4: Publish to npm

```bash
npm publish --access=public
```

The `--access=public` flag is **required** for scoped packages to be publicly accessible.

**Output example:**
```
npm notice
npm notice 📦  @anedezorchestrator/orchestrator-essentials-setup@1.0.0
npm notice
npm notice === Tarball Contents ===
npm notice 252B  package.json
npm notice
npm notice === Dist Files ===
npm notice 4.5kB  @anedezorchestrator/orchestrator-essentials-setup-1.0.0.tgz
npm notice
npm notice publish message: v1.0.0 (git tag)
npm notice
✔ published
```

## Step 5: Verify Published Package

Visit: `https://www.npmjs.com/package/@anedezorchestrator/orchestrator-essentials-setup`

## Usage After Publishing

Users can now install with:

```bash
# Global install
npm install -g @anedezorchestrator/orchestrator-essentials-setup

# Use without installing (npx)
npx @anedezorchestrator/orchestrator-essentials-setup

# Run the command
orchestrator-essentials-setup
# or
orch-setup
```

## Automated Publishing with GitHub Actions

See `.github/workflows/publish.yml` for automated npm publishing on every git tag push.

### To enable automated publishing:

1. **Create npm token in npm settings:**
   - Go to npm.js.com → Account settings → Tokens
   - Create a new automation token
   - Copy the token

2. **Add GitHub Secret:**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Create new secret: `NPM_TOKEN`
   - Paste your npm token

3. **Push a git tag:**
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

GitHub Actions will automatically run and publish to npm.

## Troubleshooting

### "401 Unauthorized"
- Not logged in. Run `npm login --scope=@anedezorchestrator`
- Token expired. Run `npm login` again with valid credentials

### "403 Forbidden - You do not have permission"
- You don't own the @anedezorchestrator scope
- Contact scope owner or create a different scope

### "You must use --access=public"
- Required for scoped packages
- Run: `npm publish --access=public`

### "Package name already taken"
- Choose a different name or scope
- Update `package.json` name field

## References

- **npm Scoped Packages** - [docs.npmjs.com/cli/v8/using-npm/scope](https://docs.npmjs.com/cli/v8/using-npm/scope)
- **npm Publishing Guide** - [docs.npmjs.com/cli/publish](https://docs.npmjs.com/cli/publish)
- **GitHub Actions** - [github.com/features/actions](https://github.com/features/actions)
- **npm Tokens Documentation** - [docs.npmjs.com/about/tokens](https://docs.npmjs.com/about/tokens)

## Support

For npm publishing help: [npm docs - scoped packages](https://docs.npmjs.com/cli/v8/using-npm/scope)

---

**Package Created by Patrick Josh Añedez**  
**As Part of the Orchestrator Project**
