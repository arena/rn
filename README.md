# RN Skills Practice

A free skills practice app for nursing students to learn and practice clinical nursing skills.

## What This App Does

RN Skills Practice provides:

- **Skills Browser**: View all nursing skills with step-by-step instructions
- **Individual Practice Mode**: Practice each skill with a timer and step tracking
- **Progress Tracking**: Mark steps as completed, skipped, or missed
- **Critical Step Highlighting**: Important steps are clearly marked

## Getting Started

This is a template with one example skill. Add your own nursing skills by editing `src/data/skills.yml`.

### Example Skill Format

```yaml
skills:
  - id: hand_hygiene
    title: Hand Hygiene (Hand Washing)
    category: Infection Control
    estimatedTime: 150
    description: Proper hand washing technique
    suppliesNeeded:
      - Soap
      - Sink
      - Paper towels
    steps:
      - id: step_1
        description: Turns on water at sink
        critical: false
      - id: step_2
        description: Lathers all surfaces for at least 20 seconds
        critical: true
```

## Development

```bash
npm install    # Install dependencies
npm run dev    # Start development server
npm run build  # Build for production
```

Built with React + Vite.

## Disclaimer

This app is for study purposes only. Always follow your nursing program's curriculum and evidence-based practice standards. Content may not reflect your specific program requirements.

## License

GNU AFFERO GENERAL PUBLIC LICENSE

RN Skills Practice
Copyright (C) 2026

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
