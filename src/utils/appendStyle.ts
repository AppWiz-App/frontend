export function appendStyle(newStyle: string | undefined) {
  if (!newStyle) return '';
  return ' ' + newStyle;
}
