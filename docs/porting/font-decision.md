# Documentation font decision

The pinned COSS documentation app imports its sans and mono families through a package path outside
the MIT-designated `reference/apps/ui/**` source boundary. That implementation is not copied into
this port.

COSS for Svelte uses the bundled, upstream-approved Cal Sans asset for headings and branding. Body
copy and controls use the platform UI sans stack, and code uses the platform monospace stack. These
fallbacks require no redistributed font asset or additional license notice, keep the COSS type
hierarchy intact, and avoid importing files from an AGPL-default path.
