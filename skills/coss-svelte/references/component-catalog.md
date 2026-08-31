# Component catalog

Use the exact component page for props, exported parts, examples, and installation. This catalog is
for choosing the right primitive, not for reconstructing its API from memory.

## Component groups

| Group | Components |
| --- | --- |
| Actions and status | Alert, Badge, Button, Empty, Progress, Skeleton, Spinner, Toast |
| Form controls | Autocomplete, Checkbox, Checkbox Group, Combobox, Field, Fieldset, Form, Input, Input Group, Label, Meter, Number Field, OTP Field, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group |
| Navigation and commands | Breadcrumb, Command, Context Menu, Menu, Pagination, Tabs, Toolbar |
| Overlays | Alert Dialog, Dialog, Drawer, Popover, Preview Card, Sheet, Tooltip |
| Content and layout | Accordion, Avatar, Calendar, Card, Collapsible, Date Picker, Frame, Group, Kbd, Scroll Area, Segmented Control, Separator, Table |

Documentation routes use the lowercase kebab-case name, for example:

- `https://coss-sv.vercel.app/docs/components/input-group.md`
- `https://coss-sv.vercel.app/docs/components/alert-dialog.md`
- `https://coss-sv.vercel.app/docs/components/otp-field.md`

## Composition model

Most multi-part components are imported as a namespace from their local registry module:

```ts
import * as Dialog from "@/components/ui/dialog/index.js";
import * as InputGroup from "@/components/ui/input-group/index.js";
import * as Select from "@/components/ui/select/index.js";
```

Compose the exported short names shown by the exact page, such as `Dialog.Root`, `Dialog.Trigger`,
`Dialog.Popup`, `InputGroup.Root`, `InputGroup.Input`, `InputGroup.Addon`, `Select.Root`, and
`Select.Item`. Some modules provide aliases such as `Content` for `Popup` or `Panel`; prefer the
name used in the closest current example.

Standalone modules use named imports:

```ts
import { Badge } from "@/components/ui/badge/index.js";
import { Button } from "@/components/ui/button/index.js";
import { Input } from "@/components/ui/input/index.js";
import { Separator } from "@/components/ui/separator/index.js";
```

Do not flatten Svelte namespace composition into React-style symbols such as `CardHeader` or
`DialogContent` in examples. Those long exports may exist for package compatibility, but the
documented Svelte composition is clearer and is the default for new consumer code.

## Choose the narrowest component

- Use `Alert Dialog` only when a decision must block progress; use `Dialog` for ordinary modal work.
- Use `Popover` for interactive anchored content and `Preview Card` for nonessential link previews.
- Use `Autocomplete` for suggestions that preserve text entry, `Combobox` for selecting from a
  filterable collection, and `Select` for a predefined choice.
- Use `Field` for one labelled control, `Fieldset` for a semantically related group, and `Form` for
  submission and validation composition.
- Use `Group` to join peer controls and `Input Group` to attach addons to one input.
- Use `Toggle Group` for related pressed-state choices and `Segmented Control` for the documented
  navigation, filtering, or view-selection pattern.

## Related hooks and resources

The docs also cover `useMediaQuery` and `useCopyToClipboard`. Read their Svelte pages before using
them; they are rune-based helpers, not React hooks. Use `llms.txt` for the current page inventory and
`llms-full.txt` for a single searchable snapshot.
