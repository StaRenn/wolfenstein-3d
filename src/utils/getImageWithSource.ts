const loaded: Record<string, HTMLImageElement> = {};

export function getImageWithSource(path: string) {
  if (loaded[path]) {
    return loaded[path];
  }

  const image = new Image();
  image.src = path;

  loaded[path] = image;

  return image;
}
