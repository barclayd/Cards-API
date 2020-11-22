import rawCardsResponse from '@t/unit/data/cards.json';
import { rawCardResponseToCardResponse } from './util';

export const cardsResponse = rawCardResponseToCardResponse(rawCardsResponse);
