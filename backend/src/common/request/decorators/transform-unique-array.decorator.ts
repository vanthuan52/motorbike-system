import { Transform } from 'class-transformer';

export function TransformUniqueArray() {
  return Transform(({ value }) =>
    Array.isArray(value) ? [...new Set(value)] : [],
  );
}
