<script lang="ts">
let { slug }: { slug: string } = $props();

const fieldThumbnails = new Set(["field", "fieldset", "form", "label"]);
const inputThumbnails = new Set([
  "autocomplete",
  "combobox",
  "input",
  "input-group",
  "select",
  "textarea",
]);
const selectionThumbnails = new Set([
  "checkbox",
  "checkbox-group",
  "radio-group",
  "segmented-control",
  "switch",
  "toggle",
  "toggle-group",
]);
const menuThumbnails = new Set(["command", "context-menu", "menu"]);
const overlayThumbnails = new Set(["popover", "preview-card", "tooltip"]);
const statusThumbnails = new Set(["meter", "progress", "slider"]);
</script>

<svg
  aria-hidden="true"
  class="category-thumbnail"
  data-thumbnail={slug}
  focusable="false"
  viewBox="0 0 240 156"
>
  <defs>
    <linearGradient id="thumb-panel" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="var(--thumb-panel-from)" />
      <stop offset="1" stop-color="var(--thumb-panel-to)" />
    </linearGradient>
    <linearGradient id="thumb-primary" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="var(--thumb-primary-from)" />
      <stop offset="1" stop-color="var(--thumb-primary-to)" />
    </linearGradient>
    <filter id="thumb-shadow" height="150%" width="150%" x="-25%" y="-25%">
      <feDropShadow
        dx="0"
        dy="3"
        flood-color="var(--thumb-shadow)"
        flood-opacity="0.12"
        stdDeviation="4"
      />
    </filter>
  </defs>

  {#if slug === "accordion"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="128" rx="14" width="164" x="38" y="14" />
      <path d="M38 56h164M38 99h164" />
      <path d="m54 34 4 4 4-4m-8 86 4 4 4-4m0-42-4-4-4 4" />
      <path class="strong" d="M73 36h82M73 78h58M73 120h82" />
      <path d="M73 88h112" />
    </g>
  {:else if slug === "alert"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="44" rx="20" width="204" x="18" y="56" />
      <circle cx="36" cy="78" r="6" />
      <path d="M36 74v5m0 3h.01M53 78h120" />
    </g>
  {:else if slug === "alert-dialog" || slug === "dialog" || slug === "card"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="98" rx="14" width="160" x="40" y="29" />
      <path class="strong" d="M57 51h68" />
      <path d="M57 65h102M57 76h84" />
      {#if slug === "card"}
        <rect class="quiet" height="13" rx="3" width="126" x="57" y="86" />
        <rect class="primary" height="13" rx="3" width="126" x="57" y="104" />
      {:else}
        <rect class="quiet" height="13" rx="5" width="30" x="120" y="96" />
        <rect class="primary" height="13" rx="5" width="30" x="155" y="96" />
      {/if}
    </g>
  {:else if inputThumbnails.has(slug)}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      {#if slug === "textarea"}
        <rect height="86" rx="14" width="176" x="32" y="34" />
        <path class="strong" d="M52 56h78" />
      {:else}
        <rect height="42" rx="14" width="176" x="32" y={slug === "autocomplete" ? 20 : 57} />
        {#if slug === "input-group"}
          <circle cx="51" cy="78" r="6" />
          <path d="m55 82 5 5" />
        {/if}
        <path class="strong" d={slug === "input-group" ? "M70 78h75" : "M52 78h72"} />
        {#if slug === "select"}
          <path d="m180 74 5 5 5-5" />
        {/if}
        {#if slug === "combobox"}
          <rect class="quiet" height="20" rx="5" width="48" x="48" y="68" />
          <rect class="quiet" height="20" rx="5" width="48" x="102" y="68" />
        {/if}
      {/if}
      {#if slug === "autocomplete"}
        <rect height="78" rx="12" width="176" x="32" y="70" />
        <path d="M50 91h126M50 109h126M50 127h100" />
      {/if}
    </g>
  {:else if slug === "avatar"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <circle cx="120" cy="78" r="27" />
      <circle cx="120" cy="71" r="7" />
      <path d="M106 91c3-12 25-12 28 0" />
    </g>
  {:else if slug === "badge"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="31" rx="16" width="98" x="71" y="63" />
      <circle class="strong" cx="88" cy="78" r="4" />
      <path d="M101 78h47" />
    </g>
  {:else if slug === "breadcrumb" || slug === "pagination"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="38" rx="18" width="198" x="21" y="59" />
      {#if slug === "pagination"}
        <path d="m42 73-6 6 6 6M198 73l6 6-6 6M68 79h24m14 0h24m14 0h24" />
      {:else}
        <path class="strong" d="M40 79h45" />
        <path d="m94 73 6 6-6 6M111 79h45m9-6 6 6-6 6M182 79h20" />
      {/if}
    </g>
  {:else if slug === "button"}
    <g filter="url(#thumb-shadow)">
      <rect class="primary" height="44" rx="15" width="96" x="72" y="56" />
      <path class="on-primary" d="M98 78h44" />
    </g>
  {:else if slug === "calendar"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="128" rx="14" width="150" x="45" y="14" />
      <path d="m61 36-5 5 5 5m118-10 5 5-5 5M82 41h76" />
      {#each [65, 87, 109, 131] as row}
        {#each [67, 89, 111, 133, 155, 177] as column}
          <circle class:primary={row === 109 && column === 111} cx={column} cy={row} r="4" />
        {/each}
      {/each}
    </g>
  {:else if slug === "date-picker"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="44" rx="14" width="176" x="32" y="56" />
      <rect height="14" rx="2" width="14" x="50" y="70" />
      <path d="M50 74h14M54 66v5m6-5v5M76 78h92" />
    </g>
  {:else if selectionThumbnails.has(slug)}
    {#if slug === "switch"}
      <g filter="url(#thumb-shadow)">
        <rect class="quiet" height="30" rx="15" width="52" x="94" y="63" />
        <circle class="thumb-knob" cx="109" cy="78" r="12" />
      </g>
    {:else if slug === "segmented-control" || slug === "toggle-group"}
      <g class="thumb-surface" filter="url(#thumb-shadow)">
        <rect height="46" rx="13" width="156" x="42" y="55" />
        <path d="M94 55v46m52-46v46" />
        <rect class="selected" height="40" rx="10" width="48" x="96" y="58" />
        <path class="strong" d="M58 78h20m74 0h30M109 78h22" />
      </g>
    {:else if slug === "toggle"}
      <g class="thumb-surface" filter="url(#thumb-shadow)">
        <rect height="48" rx="14" width="48" x="96" y="28" />
        <rect class="selected" height="48" rx="14" width="48" x="96" y="84" />
        <path d="M110 52h20" />
        <path class="primary-stroke" d="M110 108h20" />
      </g>
    {:else}
      <g>
        {#each [55, 79, 103] as row, index}
          <rect
            class:primary={index === 1}
            class:round={slug === "radio-group"}
            height="16"
            rx={slug === "radio-group" ? 8 : 4}
            width="16"
            x="66"
            y={row - 8}
          />
          <path class={index === 1 ? "strong" : ""} d={`M94 ${row}h80`} />
        {/each}
      </g>
    {/if}
  {:else if slug === "collapsible"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="102" rx="14" width="176" x="32" y="27" />
      <path d="M32 68h176m-28-22 5 5 5-5" />
      <path class="strong" d="M50 49h88" />
      <path d="M50 88h126M50 106h98" />
    </g>
  {:else if menuThumbnails.has(slug)}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      {#if slug === "context-menu"}
        <rect class="dashed" height="78" rx="12" width="116" x="30" y="25" />
      {/if}
      <rect
        height="104"
        rx="12"
        width="156"
        x={slug === "context-menu" ? 78 : 42}
        y={slug === "context-menu" ? 42 : 26}
      />
      {#if slug === "command"}
        <path d="M42 58h156" />
        <circle cx="59" cy="46" r="6" />
      {/if}
      <path
        d={`M${slug === "context-menu" ? 96 : 60} 75h96M${slug === "context-menu" ? 96 : 60} 94h72M${slug === "context-menu" ? 96 : 60} 113h88`}
      />
    </g>
  {:else if slug === "drawer" || slug === "sheet"}
    <g>
      <rect
        class="dashed"
        height="112"
        rx="14"
        width={slug === "sheet" ? 128 : 196}
        x="22"
        y="22"
      />
      <rect
        class="thumb-surface fill"
        filter="url(#thumb-shadow)"
        height={slug === "sheet" ? 112 : 60}
        rx="14"
        width={slug === "sheet" ? 78 : 196}
        x={slug === "sheet" ? 140 : 22}
        y={slug === "sheet" ? 22 : 74}
      />
      {#if slug === "drawer"}
        <path class="strong" d="M98 88h44" />
      {:else}
        <path class="strong" d="M154 45h48M154 60h36" />
        <rect class="primary" height="14" rx="4" width="46" x="158" y="104" />
      {/if}
    </g>
  {:else if slug === "empty"}
    <g>
      <rect class="dashed" height="116" rx="14" width="190" x="25" y="20" />
      <circle class="quiet" cx="120" cy="58" r="18" />
      <path class="strong" d="M85 85h70" />
      <path d="M70 102h100" />
    </g>
  {:else if fieldThumbnails.has(slug)}
    <g class="thumb-surface">
      <path class={slug === "label" ? "primary-stroke" : "strong"} d="M44 38h60" />
      <rect height="42" rx="12" width="152" x="44" y="49" />
      {#if slug === "fieldset" || slug === "form"}
        <path class="strong" d="M44 112h60" />
        <rect height="32" rx="10" width="152" x="44" y="120" />
      {/if}
      {#if slug === "field"}
        <path d="M44 107h118" />
      {/if}
      {#if slug === "form"}
        <rect class="primary" height="12" rx="4" width="152" x="44" y="139" />
      {/if}
    </g>
  {:else if slug === "frame"}
    <g>
      <rect class="quiet" height="130" rx="16" width="190" x="25" y="13" />
      <path class="strong" d="M45 39h94" />
      <rect
        class="thumb-surface fill"
        filter="url(#thumb-shadow)"
        height="80"
        rx="14"
        width="176"
        x="32"
        y="55"
      />
      <path class="strong" d="M51 80h88" />
      <path d="M51 98h125" />
    </g>
  {:else if slug === "group" || slug === "toolbar"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect
        height="48"
        rx="14"
        width={slug === "toolbar" ? 174 : 132}
        x={slug === "toolbar" ? 33 : 54}
        y="54"
      />
      {#each slug === "toolbar" ? [77, 120, 163] : [120] as column}
        <path d={`M${column} 54v48`} />
      {/each}
      <path class="strong" d="M65 78h24m20 0h24m20 0h24" />
    </g>
  {:else if slug === "kbd"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="48" rx="11" width="48" x="65" y="54" />
      <rect height="48" rx="11" width="48" x="127" y="54" />
      <text x="89" y="85">⌘</text>
      <text x="151" y="85">K</text>
    </g>
  {:else if statusThumbnails.has(slug)}
    <g>
      {#if slug === "meter"}
        <path class="strong" d="M45 55h84M164 55h31" />
      {/if}
      <rect class="quiet" height="10" rx="5" width="170" x="35" y="74" />
      <rect
        class="primary"
        height="10"
        rx="5"
        width={slug === "slider" ? 66 : slug === "progress" ? 80 : 112}
        x="35"
        y="74"
      />
      {#if slug === "slider"}
        <circle class="primary" cx="101" cy="79" r="11" />
      {/if}
    </g>
  {:else if slug === "number-field"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="44" rx="14" width="176" x="32" y="56" />
      <path d="M49 78h15m-7-7v14M177 78h15M95 78h50" />
    </g>
  {:else if slug === "otp-field"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      {#each [40, 83, 126, 169] as column, index}
        <rect height="42" rx="11" width="36" x={column} y="57" />
        {#if index < 3}
          <circle class="strong" cx={column + 18} cy="78" r="3" />
        {:else}
          <path d={`M${column + 18} 68v20`} />
        {/if}
      {/each}
    </g>
  {:else if overlayThumbnails.has(slug)}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      {#if slug === "preview-card"}
        <rect height="76" rx="14" width="176" x="32" y="40" />
        <circle class="quiet" cx="61" cy="78" r="16" />
        <path class="strong" d="M88 63h73" />
        <path d="M88 79h93M88 95h72" />
      {:else}
        <rect height="38" rx="12" width="88" x="76" y="24" />
        <rect height="65" rx="12" width="150" x="45" y="73" />
        <path class="strong" d="M61 94h80" />
        <path d="M61 111h111" />
      {/if}
    </g>
  {:else if slug === "scroll-area"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="124" rx="14" width="140" x="50" y="16" />
      <path d="M68 39h91M68 57h104M68 75h82M68 93h96M68 111h88" />
      <rect class="strong-fill" height="40" rx="3" width="5" x="178" y="28" />
    </g>
  {:else if slug === "separator"}
    <g>
      <path class="strong" d="M50 45h72" />
      <path d="M50 61h140M50 80h140M78 99v28m45-28v28m45-28v28" />
    </g>
  {:else if slug === "skeleton"}
    <g class="skeleton-lines">
      <circle class="quiet" cx="67" cy="78" r="19" />
      <rect class="quiet" height="10" rx="5" width="104" x="96" y="63" />
      <rect class="quiet" height="10" rx="5" width="88" x="96" y="84" />
    </g>
  {:else if slug === "spinner"}
    <circle class="spinner-ring" cx="120" cy="78" r="25" />
  {:else if slug === "toast"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect class="faded" height="48" rx="14" width="146" x="47" y="31" />
      <rect class="faded" height="48" rx="14" width="162" x="39" y="45" />
      <rect height="58" rx="14" width="176" x="32" y="61" />
      <circle cx="54" cy="81" r="6" />
      <path class="strong" d="M69 78h55" />
      <path d="M69 96h96" />
    </g>
  {:else if slug === "table"}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="108" rx="14" width="190" x="25" y="24" />
      <path d="M25 60h190M25 96h190M63 24v108M115 24v108M165 24v108" />
      <path class="strong" d="M35 42h18M73 42h31M125 42h30M175 42h27" />
    </g>
  {:else if slug === "tabs"}
    <g>
      <rect class="quiet" height="44" rx="12" width="174" x="33" y="27" />
      <rect
        class="thumb-surface fill"
        filter="url(#thumb-shadow)"
        height="38"
        rx="10"
        width="56"
        x="36"
        y="30"
      />
      <path class="primary-stroke" d="M51 49h26" />
      <path d="M108 49h26M159 49h26" />
      <path class="strong" d="M45 96h98" />
      <path d="M45 115h145" />
    </g>
  {:else}
    <g class="thumb-surface" filter="url(#thumb-shadow)">
      <rect height="82" rx="14" width="168" x="36" y="37" />
      <path class="strong" d="M55 62h88" />
      <path d="M55 81h130M55 100h104" />
    </g>
  {/if}
</svg>
