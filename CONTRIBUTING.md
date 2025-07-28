# Contributing to Smart Domain Generator

Thank you for your interest in contributing to Smart Domain Generator! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the [GitHub Issues](https://github.com/houko/smart-domain/issues) page
- Search existing issues before creating a new one
- Provide clear, detailed descriptions with steps to reproduce
- Include screenshots or code snippets when helpful

### Suggesting Features
- Open a [GitHub Discussion](https://github.com/houko/smart-domain/discussions) first
- Describe the feature and its benefits
- Consider creating a simple mockup or wireframe

### Pull Requests
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/your-feature-name`
4. **Make** your changes
5. **Test** your changes thoroughly
6. **Commit** using conventional commits
7. **Push** to your fork
8. **Open** a Pull Request

## 🛠 Development Setup

### Prerequisites
- Node.js 18+ and pnpm
- Git
- A Supabase account (for database features)
- OpenAI API key (for AI features)

### Local Development
```bash
# Clone your fork
git clone https://github.com/houko/smart-domain.git
cd smart-domain

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your credentials

# Start development server
pnpm dev
```

### Project Structure
```
smart-domain/
├── apps/web/           # Main Next.js application
│   ├── src/app/        # App Router pages
│   ├── src/components/ # React components
│   ├── src/lib/        # Utility functions
│   ├── messages/       # i18n translations
│   └── sql/            # Database schemas
├── packages/
│   ├── ai/             # AI generation logic
│   └── domain/         # Domain checking utilities
└── docs/               # Documentation
```

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type - use proper typing

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop typing with TypeScript interfaces

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design on all screen sizes
- Support both light and dark themes

### File Naming
- Use kebab-case for files: `domain-generator.tsx`
- Use PascalCase for components: `DomainGenerator`
- Use camelCase for functions and variables

## 🧪 Testing

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format
```

### Writing Tests
- Write unit tests for new utility functions
- Add component tests for new React components
- Include E2E tests for new user workflows
- Aim for good test coverage (>80%)

## 🌍 Internationalization

### Adding Translations
1. Add new keys to `apps/web/messages/en.json`
2. Translate to other languages:
   - `zh.json` (Chinese Simplified)
   - `ja.json` (Japanese)
3. Use the `useTranslations` hook in components
4. Test with different locales

### Translation Guidelines
- Keep keys descriptive and hierarchical
- Use interpolation for dynamic content: `"hello": "Hello {name}!"`
- Consider cultural context for different languages

## 📦 Git Workflow

### Conventional Commits
Use the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new domain generation strategy
fix: resolve issue with domain availability checking
docs: update API documentation
style: format code according to style guide
refactor: simplify domain checking logic
test: add tests for domain generator
chore: update dependencies
```

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring

### Commit Messages
- Use imperative mood: "add" not "added"
- Keep the first line under 50 characters
- Include detailed description if needed
- Reference issues: `fixes #123`

## 🔍 Code Review Process

### Before Submitting
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] No linting errors
- [ ] Documentation updated if needed
- [ ] Translations added for new text
- [ ] No sensitive information in code

### Review Criteria
- **Functionality**: Code works as intended
- **Performance**: No unnecessary performance impacts
- **Security**: No security vulnerabilities
- **Accessibility**: Maintains WCAG compliance
- **Maintainability**: Code is clean and well-documented

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Design System
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives)
- [Lucide Icons](https://lucide.dev/)

## 🆘 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Code Review**: Comments on Pull Requests

### Common Issues
- **Build Errors**: Check Node.js version and dependencies
- **Environment Issues**: Verify .env.local configuration
- **Database Issues**: Confirm Supabase setup and credentials
- **API Issues**: Check API key configuration and limits

## 🏆 Recognition

Contributors will be recognized in the following ways:
- Listed in the repository contributors
- Mentioned in release notes for significant contributions
- Added to the project README for major features

## 📜 Code of Conduct

### Our Standards
- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome people of all backgrounds and experience levels
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Help others learn and grow

### Unacceptable Behavior
- Harassment, discrimination, or hate speech
- Personal attacks or inflammatory comments
- Spamming or trolling
- Sharing private information without permission

### Enforcement
Project maintainers are responsible for clarifying and enforcing standards. Inappropriate behavior may result in temporary or permanent bans from the project.

## 📞 Contact

For questions about contributing, please:
- Open a [GitHub Discussion](https://github.com/houko/smart-domain/discussions)
- Create an issue with the "question" label
- Reach out to maintainers through GitHub

---

Thank you for contributing to Smart Domain Generator! 🚀