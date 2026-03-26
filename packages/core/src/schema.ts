import type { SurfaceSchema } from './types';

export function defineSurface<TSurface extends SurfaceSchema>(
  surface: TSurface
): TSurface {
  return surface;
}
