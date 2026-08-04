# OpenCode Skill Manager

Lazy loading for OpenCode skills to save context tokens.

## Quick Start

```bash
# View statistics
~/.config/opencode/skill-manager.sh stats

# Restore skill to get full content
~/.config/opencode/skill-manager.sh restore deep-design

# Archive skill after use
~/.config/opencode/skill-manager.sh archive deep-design

# Search skills
~/.config/opencode/skill-manager.sh search "frontend"

# Add new skill from path
~/.config/opencode/skill-manager.sh add /path/to/new-skill
```

## Commands

| Command | Description |
|---------|-------------|
| `stats` | Show active/archived skills statistics |
| `list` | List all skills |
| `list-active` | List active skills |
| `list-archived` | List archived skills |
| `restore <name>` | Restore skill from archive |
| `archive <name>` | Archive skill (keep minimal index) |
| `archive` | Archive ALL skills |
| `search <query>` | Search skills by name/description |
| `add <path>` | Add new skill from directory |
| `cleanup` | Remove empty skill directories |

## Current Active Skills

```
cli-runner, deep-design, external-delegate, feature-analysis,
git-commit, graphify, harness-init, nano-brain, skill-manager,
systematic-debugging
```

## How It Works

1. **Session start**: Only minimal index files are loaded (~40KB vs ~14MB)
2. **When using skill**: `skill(name="deep-design")` loads minimal file
3. **Need full content**: `restore` skill from archive, then reload

## Files

- `~/.config/opencode/skill-manager.sh` - Main script
- `~/.config/opencode/skills/` - Active skills (minimal indexes)
- `~/.config/opencode/skills-archive/` - Archived skills (full content)
- `~/.config/opencode/skills-to-keep.txt` - List of skills to keep active
