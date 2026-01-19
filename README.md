# Zane CLI

A CLI tool to display your personal information card in the terminal, inspired by `npx posva`.

## Usage

```bash
npx zane
```

## Features

- 🎨 Beautiful rainbow-colored border
- 👤 Display personal information
- 🔗 Show social media links
- 🖼️ Display avatar image(WIP)
- 🌈 Terminal-friendly output

## Customization

Edit the `personalInfo` object in `src/index.ts` to customize your information:

```typescript
const personalInfo = {
  name: 'Your Name',
  fullName: 'Your Full Name',
  title: 'Your Title',
  description: 'Your description',
  links: {
    github: 'https://github.com/yourusername',
    x: '@yourusername',
    bluesky: '@yourusername',
    web: 'https://yourwebsite.com'
  },
  avatarUrl: 'https://your-avatar-url.com/avatar.png'
}
```

Then rebuild:

```bash
npm run build
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test locally
npm link
zane
```

## Publishing to npm

Before publishing, make sure to:

1. Update the `personalInfo` object in `src/index.ts` with your actual information
2. Update `package.json` with your name, author, and repository (if applicable)
3. Check if the package name `zane` is available on npm (or use a scoped name like `@yourusername/zane`)

Then:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally
npm link
zane

# Login to npm (if not already logged in)
npm login

# Publish to npm
npm publish
# Or if using a scoped package:
npm publish --access public
```

## License

MIT
