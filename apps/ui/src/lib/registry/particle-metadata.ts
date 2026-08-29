export type ParticleMeta = {
  colSpan?: 2;
  components: readonly string[];
  containerClass?: string;
  id: string;
  iframeHeight?: number;
  interactive: boolean;
  responsive: boolean;
  title: string;
};

export function validateParticleMeta(meta: ParticleMeta): ParticleMeta {
  if (meta.components.length === 0) {
    throw new Error(`Particle ${meta.id} must name at least one component`);
  }
  if (
    meta.iframeHeight !== undefined &&
    (!Number.isInteger(meta.iframeHeight) || meta.iframeHeight <= 0)
  ) {
    throw new Error(`Particle ${meta.id} iframeHeight must be a positive integer`);
  }
  if (!meta.id || !meta.title.trim()) {
    throw new Error("Particle metadata requires a nonempty id and title");
  }
  if (typeof meta.interactive !== "boolean" || typeof meta.responsive !== "boolean") {
    throw new Error(`Particle ${meta.id} interaction metadata must be boolean`);
  }
  return Object.freeze({ ...meta, components: Object.freeze([...meta.components]) });
}

export function defineParticleMeta(meta: ParticleMeta): ParticleMeta {
  return validateParticleMeta(meta);
}
