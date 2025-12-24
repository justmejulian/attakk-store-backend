import { generate } from 'short-uuid';

export const generateReferenceNumber = (): string => {
  return `ORD-${generate()}`;
};
