import { Card } from '@/entity/Card';
import { SizeOption } from '@/models/ISize';

const cardKeys = Object.keys(
  new Card('', '', '', [], [], 1, [], [], '£1.00', SizeOption.md),
);

export const cardObject = cardKeys.reduce((acc, key) => {
  acc = {
    ...acc,
    [key]: expect.anything(),
  };
  return acc;
}, {});
