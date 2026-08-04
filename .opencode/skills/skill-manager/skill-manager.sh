#!/bin/bash
# Skill Manager for OpenCode - Lazy Loading Support
# Usage: skill-manager.sh [command] [options]

set -euo pipefail

SKILLS_DIR="$HOME/.config/opencode/skills"
ARCHIVE_DIR="$HOME/.config/opencode/skills-archive"
INDEX_FILE="$ARCHIVE_DIR/.index.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
    cat <<EOF
Skill Manager for OpenCode Lazy Loading

Usage: skill-manager.sh <command> [options]

Commands:
    archive [skill-name]    Move skill(s) to archive (keep minimal index)
    restore <skill-name>    Restore skill from archive to active
    list                    List all skills (active + archived)
    list-archived           List archived skills only
    list-active             List active skills only
    search <query>          Search skills by name/description
    add <path>              Add new skill from path (auto-archive)
    cleanup                 Remove empty skill directories
    stats                   Show statistics

Examples:
    skill-manager.sh archive              # Archive ALL skills
    skill-manager.sh archive deep-design  # Archive specific skill
    skill-manager.sh restore deep-design  # Restore skill
    skill-manager.sh list                 # Show all skills
    skill-manager.sh search "frontend"    # Search for skills
EOF
}

# Create minimal index file for a skill
create_index() {
    local skill_name="$1"
    local skill_dir="$ARCHIVE_DIR/$skill_name"
    local target_dir="$SKILLS_DIR/$skill_name"
    
    if [ ! -f "$skill_dir/SKILL.md" ]; then
        echo -e "${RED}Error: Skill '$skill_name' not found in archive${NC}"
        return 1
    fi
    
    # Extract description from SKILL.md (first non-empty, non-comment line after title)
    local description=$(grep -v "^#\|^---\|^$\|^>" "$skill_dir/SKILL.md" | head -1 | sed 's/^[[:space:]]*//')
    
    # Create target directory
    mkdir -p "$target_dir"
    
    # Create minimal index
    cat > "$target_dir/SKILL.md" << EOF
---
name: $skill_name
description: $description
location: file://$skill_dir/SKILL.md
---

> **Note:** Full skill content is archived. To restore: \`skill-manager.sh restore $skill_name\`
EOF
    
    echo -e "${GREEN}Created index for: $skill_name${NC}"
}

# Archive a skill
archive_skill() {
    local skill_name="$1"
    local source="$SKILLS_DIR/$skill_name"
    local target="$ARCHIVE_DIR/$skill_name"
    
    if [ ! -d "$source" ]; then
        echo -e "${RED}Error: Skill '$skill_name' not found in active skills${NC}"
        return 1
    fi
    
    if [ -d "$target" ]; then
        echo -e "${YELLOW}Warning: Skill already in archive, skipping${NC}"
        return 0
    fi
    
    # Move to archive
    mv "$source" "$target"
    
    # Create minimal index
    create_index "$skill_name"
    
    echo -e "${GREEN}Archived: $skill_name${NC}"
}

# Restore a skill from archive
restore_skill() {
    local skill_name="$1"
    local source="$ARCHIVE_DIR/$skill_name"
    local target="$SKILLS_DIR/$skill_name"
    
    if [ ! -d "$source" ]; then
        echo -e "${RED}Error: Skill '$skill_name' not found in archive${NC}"
        return 1
    fi
    
    # Remove minimal index
    rm -rf "$target"
    
    # Restore from archive
    mv "$source" "$target"
    
    echo -e "${GREEN}Restored: $skill_name${NC}"
}

# Archive ALL skills
archive_all() {
    echo -e "${BLUE}Archiving all skills...${NC}"
    
    local count=0
    for skill_dir in "$SKILLS_DIR"/*/; do
        local skill_name=$(basename "$skill_dir")
        if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
            archive_skill "$skill_name"
            count=$((count + 1))
        fi
    done
    
    echo -e "${GREEN}Archived $count skills${NC}"
}

# List all skills
list_all() {
    echo -e "${BLUE}=== Active Skills ===${NC}"
    list_active
    echo ""
    echo -e "${BLUE}=== Archived Skills ===${NC}"
    list_archived
}

# List active skills
list_active() {
    for skill_dir in "$SKILLS_DIR"/*/; do
        if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
            local name=$(basename "$skill_dir")
            local size=$(wc -c < "$skill_dir/SKILL.md")
            local is_index=$(grep -q "skill-manager.sh restore" "$skill_dir/SKILL.md" 2>/dev/null && echo " [INDEX]" || echo "")
            printf "  %-35s %6dB%s\n" "$name" "$size" "$is_index"
        fi
    done
}

# List archived skills
list_archived() {
    for skill_dir in "$ARCHIVE_DIR"/*/; do
        if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
            local name=$(basename "$skill_dir")
            local size=$(wc -c < "$skill_dir/SKILL.md")
            printf "  %-35s %6dB\n" "$name" "$size"
        fi
    done
}

# Search skills
search_skills() {
    local query="$1"
    echo -e "${BLUE}Searching for: $query${NC}"
    echo ""
    
    echo -e "${YELLOW}Active:${NC}"
    grep -ril "$query" "$SKILLS_DIR"/*/SKILL.md 2>/dev/null | while read f; do
        local name=$(basename $(dirname "$f"))
        echo "  - $name"
    done || echo "  (none)"
    
    echo ""
    echo -e "${YELLOW}Archived:${NC}"
    grep -ril "$query" "$ARCHIVE_DIR"/*/SKILL.md 2>/dev/null | while read f; do
        local name=$(basename $(dirname "$f"))
        echo "  - $name"
    done || echo "  (none)"
}

# Add new skill from path
add_skill() {
    local source_path="$1"
    local skill_name=$(basename "$source_path")
    
    if [ ! -d "$source_path" ] || [ ! -f "$source_path/SKILL.md" ]; then
        echo -e "${RED}Error: Invalid skill path (must contain SKILL.md)${NC}"
        return 1
    fi
    
    # Copy to archive
    cp -r "$source_path" "$ARCHIVE_DIR/$skill_name"
    
    # Create minimal index
    create_index "$skill_name"
    
    echo -e "${GREEN}Added and archived: $skill_name${NC}"
}

# Cleanup empty directories
cleanup() {
    echo -e "${BLUE}Cleaning up empty directories...${NC}"
    find "$SKILLS_DIR" -type d -empty -delete 2>/dev/null
    find "$ARCHIVE_DIR" -type d -empty -delete 2>/dev/null
    echo -e "${GREEN}Done${NC}"
}

# Show statistics
show_stats() {
    local active_count=$(ls -d "$SKILLS_DIR"/*/ 2>/dev/null | wc -l)
    local archived_count=$(ls -d "$ARCHIVE_DIR"/*/ 2>/dev/null | wc -l)
    local active_size=$(du -sh "$SKILLS_DIR" 2>/dev/null | cut -f1)
    local archived_size=$(du -sh "$ARCHIVE_DIR" 2>/dev/null | cut -f1)
    
    echo -e "${BLUE}=== Skill Statistics ===${NC}"
    echo -e "Active skills:   ${GREEN}$active_count${NC} ($active_size)"
    echo -e "Archived skills: ${YELLOW}$archived_count${NC} ($archived_size)"
    echo ""
    echo -e "Context savings: ~$((archived_count * 4))KB at session start"
}

# Main
case "${1:-help}" in
    archive)
        if [ -z "${2:-}" ]; then
            archive_all
        else
            archive_skill "$2"
        fi
        ;;
    restore)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}Error: Please specify skill name${NC}"
            exit 1
        fi
        restore_skill "$2"
        ;;
    list)
        list_all
        ;;
    list-archived)
        list_archived
        ;;
    list-active)
        list_active
        ;;
    search)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}Error: Please specify search query${NC}"
            exit 1
        fi
        search_skills "$2"
        ;;
    add)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}Error: Please specify skill path${NC}"
            exit 1
        fi
        add_skill "$2"
        ;;
    cleanup)
        cleanup
        ;;
    stats)
        show_stats
        ;;
    help|*)
        usage
        ;;
esac
