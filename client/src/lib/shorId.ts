import { nanoid } from 'nanoid';

export const shortId = (size: number = 6) => nanoid(size);
