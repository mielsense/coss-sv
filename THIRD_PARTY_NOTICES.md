# Third-party notices

## COSS UI

Source: <https://github.com/cosscom/coss>

Adapted source is restricted to the upstream `apps/ui/` subtree at commit `19620ae8cae81e30775f2cde03829326cb4916b2`. The upstream repository designates that subtree as MIT-licensed. Copyright remains with the COSS contributors.

The MIT license text appears in this repository's [LICENSE](LICENSE).

## Shards UI

Source: <https://github.com/abdrizik/shardsui>

Inspected source revision: `f8b134dfa627cbe3da7e538e2531b0b9fce4d48e`

```text
MIT License

Copyright (c) 2026 Abdrahman Rizk
Copyright (c) 2019 Material-UI SAS (Base UI)
Copyright (c) 2021-present Floating UI contributors

Adapted from Base UI and rebuilt on Svelte 5 runes. Component APIs, accessibility
behavior and much of the test suite derive from Base UI; the internal floating layer
derives from Floating UI. Both are MIT licensed under the terms below.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Hugeicons

Source: <https://github.com/hugeicons/hugeicons>

This project uses icon data from `@hugeicons/core-free-icons` at version 4.3.0 with a local SSR-safe Svelte renderer. The installed package metadata declares the icon pack MIT-licensed. No Hugeicons Pro assets are included.

```text
MIT License

Copyright (c) 2025 Hugeicons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Cal Sans 2

Source: <https://github.com/calcom/sans>

Bundled source revision: `b5d86f057dce21735d0cfe2fbca35de615095121`

The documentation site self-hosts the unmodified `calsans-cossui` variable webfont build under the SIL Open Font License 1.1.

```text
Copyright 2021 The Cal Sans Project Authors (https://github.com/calcom/font)
```

The font's license, authors, and contributors files are distributed beside the font in [`apps/ui/static/fonts/cal-sans/`](apps/ui/static/fonts/cal-sans/).

## Zod

Source: <https://github.com/colinhacks/zod>

The exact COSS form validation example uses Zod. This port depends on Zod 4.4.3 under the MIT License.

```text
MIT License

Copyright (c) 2025 Colin McDonnell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## TanStack Table

Source: <https://github.com/TanStack/table>

The exact COSS data-table examples use the official Svelte adapter, `@tanstack/svelte-table` 9.2.3. The adapter and its TanStack table/store dependencies are MIT-licensed.

```text
MIT License

Copyright (c) 2016 Tanner Linsley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## React DayPicker 10.0.1

The Calendar implementation was informed by React DayPicker's public behavior, types, DOM
contract, and class names. React DayPicker is licensed under the MIT License.

Source: https://github.com/gpbl/react-day-picker/tree/v10.0.1

```text
The MIT License (MIT)

Copyright (c) 2014-2026 Giampaolo Bellavite <io@gpbl.dev> and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The dependency and asset inventory will grow as components land. Each component lane must add the notice required by any new icon set, font, calendar package, or copied SVG data in the same reviewed change.
