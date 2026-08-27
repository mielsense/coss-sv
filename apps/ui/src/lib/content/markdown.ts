type Fence = {
  character: "`" | "~";
  length: number;
};

function blankLine(line: string): string {
  return line.replace(/[^\r\n]/g, " ");
}

export function withoutFencedCode(markdown: string): string {
  let fence: Fence | undefined;

  return (markdown.match(/.*(?:\r?\n|$)/g) ?? [])
    .map((line) => {
      if (fence) {
        const close = new RegExp(`^ {0,3}${fence.character}{${fence.length},}\\s*(?:\\r?\\n)?$`);
        if (close.test(line)) fence = undefined;
        return blankLine(line);
      }

      const opening = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
      if (!opening) return line;
      fence = {
        character: opening[0] as Fence["character"],
        length: opening.length,
      };
      return blankLine(line);
    })
    .join("");
}
