import ShortUID from 'short-uid';

const uid = new ShortUID();

export const generateReferenceNumber = (): string => {
  return `ORD-${uid.randomUUID(6)}`;
};
