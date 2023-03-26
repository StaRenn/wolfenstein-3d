const cache: Record<string, HTMLImageElement> = {};

export function getImageWithSource(path: string) {
  if (cache[path]) {
    return cache[path];
  }

  const image = new Image();
  image.src = path;

  cache[path] = image;

  return image;
}
