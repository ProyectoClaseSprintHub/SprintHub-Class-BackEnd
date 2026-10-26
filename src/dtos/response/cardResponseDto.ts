import { ICard } from '../../models/Card';
import { UserReference } from './userResponseDto';

export type CardWithDetails = Omit<ICard, 'assignedTo'> & {
  assignedTo: UserReference
};

export interface CardDetailsResponse {
  id: string;
  title: string;
  description: string;
  columnId: string;
  dueDate: string | null;
  priority: 'alta' | 'media' | 'baja';
  assignedTo: {
    id: string;
    name: string;
    email: string;
    profilePicture: string | undefined;
  } | null;
}