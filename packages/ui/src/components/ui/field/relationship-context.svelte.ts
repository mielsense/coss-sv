import { createContext } from "svelte";

export class FieldRelationshipState {
  #readLabelId: () => string | undefined;
  #readDescribedBy: () => string | undefined;
  #writeLabelId: (id: string | undefined) => void;
  #writeDescribedBy: (ids: string | undefined) => void;
  #initialLabelId: string | undefined;
  #initialMessageIds = new Set<string>();

  constructor(
    readLabelId: () => string | undefined,
    writeLabelId: (id: string | undefined) => void,
    readDescribedBy: () => string | undefined,
    writeDescribedBy: (ids: string | undefined) => void,
  ) {
    this.#readLabelId = readLabelId;
    this.#writeLabelId = writeLabelId;
    this.#readDescribedBy = readDescribedBy;
    this.#writeDescribedBy = writeDescribedBy;
  }

  get describedBy(): string | undefined {
    return this.#readDescribedBy();
  }

  get labelledBy(): string | undefined {
    return this.#readLabelId();
  }

  registerInitialLabelId(id: string): void {
    this.#initialLabelId = id;
    this.#writeLabelId(id);
  }

  registerLabelId(id: string): () => void {
    if (this.#initialLabelId === id) this.#initialLabelId = undefined;
    this.#writeLabelId(id);
    return () => {
      if (this.#readLabelId() === id) this.#writeLabelId(undefined);
    };
  }

  registerInitialMessageId(id: string): void {
    this.#initialMessageIds.add(id);
    if (!this.#readMessageIds().includes(id)) {
      this.#writeMessageIds([...this.#readMessageIds(), id]);
    }
  }

  registerMessageId(id: string): () => void {
    this.#initialMessageIds.delete(id);
    if (!this.#readMessageIds().includes(id)) {
      this.#writeMessageIds([...this.#readMessageIds(), id]);
    }
    return () => {
      this.#writeMessageIds(this.#readMessageIds().filter((messageId) => messageId !== id));
    };
  }

  #readMessageIds(): string[] {
    return this.#readDescribedBy()?.split(/\s+/).filter(Boolean) ?? [];
  }

  #writeMessageIds(ids: string[]): void {
    this.#writeDescribedBy(ids.join(" ") || undefined);
  }
}

const [getRequiredFieldRelationshipContext, setFieldRelationshipContext] =
  createContext<FieldRelationshipState>();

export { setFieldRelationshipContext };

export function getFieldRelationshipContext(): FieldRelationshipState | undefined {
  try {
    return getRequiredFieldRelationshipContext();
  } catch (error) {
    if (error instanceof Error && error.name === "Svelte error") return undefined;
    throw error;
  }
}
