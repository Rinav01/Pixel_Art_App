export function floodFill(pixels: (string | null)[][], startX: number, startY: number, newColor: string | null) {
  const h = pixels.length;
  if (h === 0) return pixels;
  const w = pixels[0].length;
  if (w === 0) return pixels;
  if (startX < 0 || startX >= w || startY < 0 || startY >= h) return pixels;
  const target = pixels[startY][startX];
  if (target === newColor) return pixels;
  const stack: [number, number][] = [[startX, startY]];
  const result = pixels.map(row => [...row]);
  while (stack.length) {
    const [x, y] = stack.pop()!;
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    if (result[y][x] !== target) continue;
    result[y][x] = newColor;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return result;
}
