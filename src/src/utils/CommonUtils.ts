export function cloneData<T>(target: T): T {
  return JSON.parse(JSON.stringify(target));
}

export function executeRepeatedly(
  handler: Function,
  timeout: number,
  startIntermediately?: boolean
): () => void {
  if (startIntermediately) {
    handler();
  }
  const intervalId = setInterval(handler, timeout);
  return () => clearInterval(intervalId);
}

export function copyTextToClipboard(text: string) {
  const copyInput = document.createElement("input");
  copyInput.value = text;
  document.body.appendChild(copyInput);
  copyInput.select();
  copyInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  copyInput.remove();
}
