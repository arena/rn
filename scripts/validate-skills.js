import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const SKILLS_DIR = path.resolve('src/data/skills');
const errors = [];

function error(file, msg) {
    errors.push(`${file}: ${msg}`);
}

function validateStep(file, step, index) {
    if (!step.id) {
        error(file, `Step ${index} is missing "id"`);
    }
    if (!step.description) {
        error(file, `Step "${step.id || index}" is missing "description"`);
    }

    // Section steps just need id, description, and section: true
    if (step.section) return;

    // Tip steps just need id, description, and tip: true
    if (step.tip) return;

    // Regular steps must have critical defined
    if (step.critical === undefined) {
        error(file, `Step "${step.id || index}" is missing "critical" (true/false)`);
    }
}

function validateSkill(filePath) {
    const filename = path.basename(filePath);

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        error(filename, `Could not read file: ${e.message}`);
        return;
    }

    let skill;
    try {
        skill = yaml.load(content);
    } catch (e) {
        error(filename, `Invalid YAML: ${e.message}`);
        return;
    }

    if (!skill || typeof skill !== 'object') {
        error(filename, 'File does not contain a valid YAML object');
        return;
    }

    // Required top-level fields
    if (!skill.id) error(filename, 'Missing "id"');
    if (!skill.title) error(filename, 'Missing "title"');
    if (!skill.category) error(filename, 'Missing "category"');
    if (!skill.description) error(filename, 'Missing "description"');

    if (!skill.steps || !Array.isArray(skill.steps)) {
        error(filename, 'Missing or invalid "steps" array');
        return;
    }

    if (skill.steps.length === 0) {
        error(filename, '"steps" array is empty');
        return;
    }

    // Check for duplicate step IDs
    const ids = skill.steps.map(s => s.id).filter(Boolean);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length > 0) {
        error(filename, `Duplicate step IDs: ${[...new Set(dupes)].join(', ')}`);
    }

    // Validate each step
    skill.steps.forEach((step, index) => validateStep(filename, step, index));
}

// Find all .yml files in skills directory (skip index.js)
const files = fs.readdirSync(SKILLS_DIR).filter(f => f.endsWith('.yml'));

if (files.length === 0) {
    console.error('No .yml files found in', SKILLS_DIR);
    process.exit(1);
}

console.log(`Validating ${files.length} skill file(s)...\n`);

for (const file of files) {
    validateSkill(path.join(SKILLS_DIR, file));
}

if (errors.length > 0) {
    console.error('Validation failed:\n');
    errors.forEach(e => console.error(`  - ${e}`));
    console.error(`\n${errors.length} error(s) found.`);
    process.exit(1);
} else {
    console.log('All skill files are valid.');
}
