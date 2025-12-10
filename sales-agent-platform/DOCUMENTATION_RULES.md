# Cursor AI Rules for Documentation

This file contains the documentation rules that should be followed for all projects in this repository.

## Core Principle
**Documentation is NOT optional - it's a critical part of the development process!**

Every feature, component, API endpoint, and architectural decision MUST be documented. Good documentation = Faster onboarding + Fewer questions + Better maintenance.

---

## 1. Documentation Folder Structure

**ALWAYS create and maintain this structure:**

```
project-root/
├── docs/
│   ├── README.md                      # Main documentation index with links to all sections
│   │
│   ├── getting-started/
│   │   ├── README.md                  # Getting started index
│   │   ├── installation.md            # How to install and setup
│   │   ├── quick-start.md             # Quick start guide
│   │   ├── setup-guide.md             # Detailed setup instructions
│   │   ├── environment-variables.md   # All env vars explained
│   │   └── troubleshooting.md         # Common issues and solutions
│   │
│   ├── architecture/
│   │   ├── README.md                  # Architecture overview
│   │   ├── project-structure.md       # Folder structure explained
│   │   ├── folder-organization.md    # How folders are organized
│   │   ├── data-flow.md               # How data flows through the app
│   │   ├── state-management.md        # State management approach
│   │   └── tech-stack.md              # Technologies used and why
│   │
│   ├── design-system/
│   │   ├── README.md                  # Design system overview
│   │   ├── colors.md                  # Theme colors documentation
│   │   ├── typography.md              # Font styles and usage
│   │   ├── spacing.md                 # Spacing scale and usage
│   │   ├── breakpoints.md             # Responsive breakpoints
│   │   ├── icons.md                   # Icon system
│   │   ├── animations.md              # Animation patterns
│   │   ├── design-tokens.md           # All design tokens
│   │   └── theme-configuration.md     # How to customize theme
│   │
│   ├── components/
│   │   ├── README.md                  # Components overview
│   │   ├── button.md                  # Button component docs
│   │   ├── card.md                    # Card component docs
│   │   ├── modal.md                   # Modal component docs
│   │   ├── form-elements.md           # Form inputs, selects, etc.
│   │   ├── navigation.md              # Navigation components
│   │   ├── layout.md                  # Layout components
│   │   └── [component-name].md        # One file per major component
│   │
│   ├── features/
│   │   ├── README.md                  # Features overview
│   │   ├── authentication.md         # Auth system documentation
│   │   ├── user-management.md        # User management features
│   │   ├── dashboard.md              # Dashboard features
│   │   ├── notifications.md           # Notification system
│   │   └── [feature-name].md         # One file per feature
│   │
│   ├── api/
│   │   ├── README.md                  # API overview
│   │   ├── endpoints.md               # All API endpoints
│   │   ├── authentication.md         # API authentication
│   │   ├── error-handling.md          # Error responses
│   │   ├── rate-limiting.md          # Rate limit info
│   │   └── [endpoint-group].md        # Group related endpoints
│   │
│   ├── deployment/
│   │   ├── README.md                  # Deployment overview
│   │   ├── build-process.md           # How to build
│   │   ├── ci-cd.md                   # CI/CD pipeline
│   │   ├── hosting.md                 # Hosting setup
│   │   ├── environment-setup.md       # Production environment
│   │   └── monitoring.md              # Monitoring and logging
│   │
│   ├── testing/
│   │   ├── README.md                  # Testing overview
│   │   ├── unit-tests.md              # Unit testing guide
│   │   ├── integration-tests.md       # Integration testing
│   │   ├── e2e-tests.md               # End-to-end testing
│   │   └── test-coverage.md           # Coverage requirements
│   │
│   ├── contributing/
│   │   ├── README.md                  # Contributing overview
│   │   ├── coding-standards.md        # Code style guide
│   │   ├── git-workflow.md            # Git branching strategy
│   │   ├── commit-conventions.md      # Commit message format
│   │   ├── pull-request-template.md   # PR guidelines
│   │   └── code-review.md             # Code review process
│   │
│   └── guides/
│       ├── README.md                  # Guides overview
│       ├── adding-new-feature.md      # How to add features
│       ├── creating-components.md     # Component creation guide
│       ├── styling-guide.md           # Styling best practices
│       ├── performance-optimization.md # Performance tips
│       └── security-best-practices.md # Security guidelines
```

---

## 2. When to Create Documentation

**ALWAYS create or update documentation when:**

- ✅ Adding a new feature
- ✅ Creating a reusable component
- ✅ Setting up API endpoints
- ✅ Implementing complex logic or algorithms
- ✅ Making architectural decisions
- ✅ Adding environment variables
- ✅ Modifying build process or deployment
- ✅ Creating utility functions or hooks
- ✅ Setting up integrations with third-party services
- ✅ Changing database schema or data models
- ✅ Implementing authentication or authorization
- ✅ Adding configuration files

---

## 3. Documentation Naming Conventions

**Follow these naming rules strictly:**

### File Names
- Use **kebab-case**: `user-authentication.md` ✅ NOT `UserAuthentication.md` ❌
- Be **descriptive**: `button-component.md` ✅ NOT `button.md` ❌
- One concept per file: `api-authentication.md` separate from `user-authentication.md`
- Use plural for collections: `components/`, `features/`, `guides/`

### Folder Names
- Use **kebab-case**: `getting-started/` ✅ NOT `GettingStarted/` ❌
- Group related content together
- Use `README.md` as the index file for each folder

### Section Headers
- Use Title Case for main headers: `# Component Documentation`
- Use Sentence case for subheaders: `## How to use this component`

---

## 4. Standard Documentation Templates

See the full templates in the user rules. Key sections include:

### Component Documentation Template
- Overview
- Preview
- Installation
- Usage (Basic & Advanced)
- Props/Parameters table
- Variants
- Styling
- Responsive Behavior
- Accessibility
- Examples in Production
- Related Components
- Troubleshooting
- Changelog

### Feature Documentation Template
- Overview
- User Flow
- Technical Implementation
- Configuration
- Usage Examples
- Testing
- Security Considerations
- Performance Considerations
- Known Limitations
- Future Improvements
- Related Documentation
- Changelog

### API Endpoint Documentation Template
- Endpoint
- Description
- Authentication
- Request (Headers, Query Parameters, Body)
- Response (Success & Error)
- Example Usage (cURL, JavaScript, React Hook)
- Rate Limiting
- Notes
- Related Endpoints
- Changelog

---

## 5. Documentation Best Practices

### Writing Style
- **Be clear and concise** - No fluff, get to the point
- **Use active voice** - "Click the button" not "The button should be clicked"
- **Include code examples** - Show, don't just tell
- **Use proper formatting** - Use code blocks, tables, lists appropriately
- **Keep it updated** - Old docs are worse than no docs

### Code Examples
- **Always use syntax highlighting** with language tags
- **Show complete, working examples** - Not fragments
- **Include imports** - Don't assume the reader knows
- **Comment complex parts** - Explain what's not obvious
- **Use realistic data** - Not just "foo" and "bar"

### Structure
- **Start with overview** - What and why before how
- **Progress from simple to complex** - Basic usage first
- **Group related information** - Use sections effectively
- **Link to related docs** - Help readers navigate
- **Include a changelog** - Track what changed and when

---

## 6. Special Documentation Files

### README.md (Root)
Every `docs/` folder and subfolder should have a `README.md` that serves as an index with:
- Quick links to all sections
- Project overview
- Tech stack
- Quick start commands
- Need help section

### CHANGELOG.md (Root)
Keep a changelog at the project root tracking all notable changes.

---

## 7. Documentation Maintenance

### When Code Changes
- **Update docs immediately** - Not later, NOW
- **Update examples** - Keep them working
- **Update changelog** - Track the change
- **Check related docs** - Does this affect other docs?

### Regular Reviews
- Review docs quarterly
- Remove outdated information
- Add missing documentation
- Improve unclear sections
- Update screenshots/diagrams

### Documentation Checklist
Before marking any feature/component as complete:

- [ ] Created or updated relevant documentation file
- [ ] Added to appropriate folder (`components/`, `features/`, etc.)
- [ ] Included overview and description
- [ ] Added code examples (basic and advanced)
- [ ] Documented all props/parameters with types
- [ ] Included usage examples
- [ ] Added styling and customization notes
- [ ] Documented responsive behavior
- [ ] Included accessibility notes
- [ ] Listed related components/features
- [ ] Added troubleshooting section if applicable
- [ ] Updated changelog with version and date
- [ ] Linked from parent README.md
- [ ] Reviewed for clarity and completeness

---

## 8. Documentation Tools and Tips

### Markdown Tips
- Use tables for structured data
- Use code blocks with language tags
- Use blockquotes for important notes
- Use horizontal rules to separate sections
- Use emoji sparingly for visual markers: ✅ ❌ 📝 ⚠️ 💡

### Diagrams
When needed, include diagrams using:
- Mermaid for flowcharts
- ASCII art for simple diagrams
- Screenshots for UI
- Architecture diagrams for system design

### Links
- Use relative links: `[Link](./other-doc.md)`
- Link to specific sections: `[Section](./doc.md#section-name)`
- Keep links updated when moving files

---

## 9. Quick Reference

### Documentation Command
When asked to document something, follow this process:

1. **Identify the type**: Component? Feature? API? Design element?
2. **Choose the right folder**: `components/`, `features/`, `api/`, `design-system/`
3. **Use the appropriate template** from this document
4. **Fill in all sections** - Don't skip any
5. **Add code examples** - Real, working examples
6. **Link from parent README** - Make it discoverable
7. **Update changelog** - Track what was added

### Documentation Quality Checklist
Good documentation must have:
- ✅ Clear title and overview
- ✅ Working code examples
- ✅ Complete parameter documentation
- ✅ Accessibility notes
- ✅ Related documentation links
- ✅ Changelog entries
- ✅ No broken links
- ✅ Proper formatting
- ✅ Up-to-date information

---

**Remember: Code without documentation is incomplete code. Always document as you build!**

