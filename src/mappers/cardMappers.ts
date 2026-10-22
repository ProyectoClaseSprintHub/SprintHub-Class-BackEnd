import { CardDetailsResponse, CardWithDetails } from "../dtos/response/cardResponseDto";

export class CardMapper {

  public static toDetailsResponse(card: CardWithDetails): CardDetailsResponse {
    return {
      id: card._id.toString(),
      title: card.title,
      description: card.description || '',
      columnId: card.columnId.toString(),
      priority: card.priority,
      dueDate: card.dueDate ? card.dueDate.toISOString() : null,
      assignedTo: card.assignedTo && card.assignedTo._id ? {
        id: card.assignedTo._id.toString(),
        name: card.assignedTo.name,
        email: card.assignedTo.email,
        profilePicture: card.assignedTo.profilePicture?.url? card.assignedTo.profilePicture?.url : ''
      } : null,
    };
  }

}