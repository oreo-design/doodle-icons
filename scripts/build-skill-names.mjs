/**
 * Rewrites the icon roster inside skills/doodle-icons/SKILL.md from the real
 * data, so a batch of new icons can never leave the skill quietly describing
 * last week's set.
 *
 * A stale roster is worse than no roster: the agent reads it, concludes an
 * icon does not exist, and follows the "use a word instead" rule for something
 * that shipped days ago. So the block also carries the version it was built
 * from and points at ICON_NAMES as the authority.
 *
 * Runs as part of `npm run build`; the markers below are what it replaces.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { COLLECTIONS } from '../src/collections.ts'
import { ICON_NAMES } from '../src/icons.ts'

const START = '<!-- ROSTER:START -->'
const END = '<!-- ROSTER:END -->'

const skillPath = new URL('../skills/doodle-icons/SKILL.md', import.meta.url)
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

/** wrap a comma list to ~76 columns, counting the label that opens line one */
function wrap(names, firstLinePrefix) {
  const out = []
  let line = firstLinePrefix
  for (const n of names) {
    const piece = line === firstLinePrefix ? n : `, ${n}`
    if (line.length + piece.length > 76) {
      out.push(line + ',')
      line = n
    } else {
      line += piece
    }
  }
  out.push(line)
  return out.join('\n')
}

const shelved = COLLECTIONS.filter((c) => c.names.length)
const listed = shelved.flatMap((c) => c.names)

// The roster is built from the shelves, so an icon that ships without one is
// invisible to anyone reading this skill. Counting ICON_NAMES in the heading
// while listing COLLECTIONS would quietly paper over exactly that gap.
const orphans = ICON_NAMES.filter((n) => !listed.includes(n))
if (orphans.length) {
  console.error(`\n  ${orphans.length} icon(s) are in icons.ts but on no shelf, so they cannot appear in the skill:\n    ${orphans.join(', ')}\n  Add them to src/collections.ts.\n`)
  process.exit(1)
}

const shelves = shelved.map((c) => wrap(c.names, `**${c.label}** — `)).join('\n\n')

const block = `${START}
### The ${listed.length} names, by shelf

${shelves}

\`COLLECTIONS\` exports the same grouping as data (\`{ id, label, names }\`).

This roster is generated from v${pkg.version} of the package, so you can check a
name here without installing anything. If the project has a newer version
installed, **\`ICON_NAMES\` is the authority** — a name missing from this list
may simply have shipped after it was written. Before telling someone an icon
does not exist, call \`getIcon(name)\` and see.
${END}`

const md = readFileSync(skillPath, 'utf8')
const from = md.indexOf(START)
const to = md.indexOf(END)
if (from === -1 || to === -1) {
  console.error(`\n  ${START} / ${END} markers not found in SKILL.md — roster not updated.\n`)
  process.exit(1)
}

const next = md.slice(0, from) + block + md.slice(to + END.length)
if (next === md) {
  console.log(`SKILL.md roster already current (${listed.length} icons)`)
} else {
  writeFileSync(skillPath, next)
  console.log(`SKILL.md roster rewritten — ${listed.length} icons across ${shelved.length} shelves`)
}
