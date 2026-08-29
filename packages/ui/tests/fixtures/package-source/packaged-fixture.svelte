<script lang="ts">
  type Props = {
    active?: boolean;
    label: string;
  };

  let { active = false, label }: Props = $props();
</script>

<button aria-pressed={active} type="button">{label}</button>
