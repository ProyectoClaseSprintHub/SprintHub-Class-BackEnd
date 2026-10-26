import { IColumn } from '../../models/Column';
import { CardDetailsResponse, CardWithDetails } from './cardResponseDto';

export type ColumnWithDetails = IColumn & {
  cards: CardWithDetails[];
};

export type ColumnDetailsResponse = {
  id: string;
  name: string;
  boardId: string;
  cards: CardDetailsResponse[];
};
