# Security and CodeQL review, 2026-09-08

Reviewed the authored component library, documentation compiler, source endpoints, registry
validation, and the nine open GitHub CodeQL alerts on `mielsense/coss-sv`. This is a source and
regression-test review, not a penetration-test certification. No runtime XML parser or XML upload
handler was found in the authored application.

## Findings and changes

| ID | File | Category | Severity | Confidence | Evidence and impact | Change | Version or flag blocker | Canonical owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-01 | `apps/ui/src/lib/content/preprocess.ts` | bug | medium | high | The script-opening regex accepted `<script-widget>` and missed multiline openings. New tests reproduced imports injected into a custom element and duplicate instance scripts. This operates on repository-authored docs at build time. | Scan the exact lowercase Svelte script tag and honor quoted attributes across lines. Preserve uppercase component syntax. | None | Svelte Edge `best-practices.md` |
| SEC-02 | `apps/ui/src/routes/+layout.svelte` | bug | medium | high | A standalone preview loaded `https://c.getopen.so/oa.js`; in-app network inspection recorded collector errors. Existing browser instrumentation mocked the script. | Move site analytics into the site route group's layout. Assert the script is absent from standalone previews. | None | Svelte Edge `sveltekit.md` |

SEC-01 changes the preprocessor and its focused tests. SEC-02 changes the two layouts and the
preview runtime browser test. No component styling changes.

## CodeQL alert disposition

The alert IDs and paths were read through GitHub's code-scanning API on 2026-09-08.

| Alert | Rule | Location | Disposition |
| --- | --- | --- | --- |
| 9 | `js/bad-tag-filter` | `apps/ui/src/lib/content/preprocess.ts` | Replaced regex tag detection with explicit Svelte script opening recognition. It is a code locator, not an HTML sanitizer. Added custom-element, uppercase-component, multiline, and quoted-attribute regressions. |
| 8 | `js/incomplete-multi-character-sanitization` | `scripts/parity/inventory.mts` | Comment removal now leaves a space so adjacent markup fragments cannot join. This output is only used to classify authored content. |
| 7, 6 | same | `packages/ui/src/components/ui/combobox/combobox.test.ts` | Replaced comment deletion with anchored assertions that the content consists only of comments. |
| 5 | same | `packages/ui/src/components/ui/calendar/calendar.test.ts` | Handled in the separate calendar fix with an anchored comment-only assertion. |
| 4 | same | `packages/ui/src/components/ui/autocomplete/autocomplete.test.ts` | Replaced comment deletion with a comment-only assertion. |
| 3 | same | `apps/ui/tests/docs/d4-card-particles.test.ts` | Preserve a separator when removing comments from test text. |
| 2 | same | `apps/ui/tests/content/components.test.ts` | Preserve a separator when extracting text for an assertion. |
| 1 | same | `apps/ui/src/lib/parity/components/c13-icon-authority.test.ts` | Preserve a separator when extracting text for an assertion. |

The seven test alerts do not receive untrusted HTTP input or render their transformed strings into
a page. They were still rewritten rather than suppressed. The remote alerts remain open until a
new GitHub CodeQL scan evaluates the integrated changes. A local CodeQL executable was unavailable.

## Injection and boundary checks

- Source display uses Shiki tokens rendered through escaped Svelte text. Thirteen added tests cover
  SVG event attributes, script tags, closing-tag injection, Svelte-looking source, XML declarations,
  external entities, entity expansion, unsafe registry names, remote dependency URLs, and size limits.
- Markdown code fences use Shiki-generated HTML. The regression checks the actual string passed to
  `{@html}`. Repository-authored SVX is executable build input and is not an untrusted Markdown service.
- `HugeiconsIcon` renders only path, circle, ellipse, and rect nodes. It does not parse XML. Icon
  data and component props are application code; callers should not treat this renderer as an
  arbitrary SVG sanitizer. Svelte's SSR attribute renderer omits event-handler attributes and
  escapes attribute values.
- Registry build validation checks names, install roots, canonical source roots, symbolic links,
  hard links, file identity before and after reading, dependency cycles, and forbidden source imports.
- Live requests for traversal, URL-shaped names, and SVG-shaped names returned 400 or 404 without
  reflecting executable markup. An XML POST to `/api/registry-source` returned 405.
- `pnpm audit --json` reported zero advisories for 335 dependencies in this checkout. That result
  does not include source-code defects or establish the safety of proposed dependency upgrades.

Threat checks followed the [OWASP XML entity guidance](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)
and [contextual output-encoding guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## Verification

- 49 documentation tests passed across source-security, layout, component rendering, card particles,
  and icon-authority suites.
- Nine focused autocomplete and combobox SSR tests passed.
- All 22 parity inventory tests passed, including traversal and canonical-path checks.
- Svelte check reported zero errors and warnings. The documentation production build passed.
- All 508 particle previews passed after the analytics move, including the new no-analytics assertion.
- In-app before/after inspection kept the same button geometry and typography; the fixed standalone
  preview contained no external script and emitted no console errors.

## Dependency PR diagnosis

Read-only inspection of the current GitHub job logs produced these results. No dependency PR was
merged or modified during this review.

| PR | Update | Observed failed gate |
| --- | --- | --- |
| 10 | Svelte tooling group | Frozen install fails because lockfile specifiers do not match the catalog-based root manifest. |
| 3 | TypeScript 7 | Frozen install fails with an outdated lockfile. The proposed major upgrade needs separate compatibility validation. |
| 2 | Quality tooling | The updated formatter rejects ten Svelte files. |
| 4, 5, 6 | Node types, unified, publint | The same Empty and Toggle font-width assertions fail on Linux. Current main already contains later font-metric corrections. |
| 9 | actions/checkout | Quality and CodeQL checks succeeded. |

These logs do not prove every proposed upgrade is compatible. They identify the first failing gates;
the major upgrades still need their own clean-checkout validation.
