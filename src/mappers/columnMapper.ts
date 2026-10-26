import { ColumnDetailsResponse, ColumnWithDetails } from "../dtos/response/columnResponseDto";
import { CardMapper } from "./cardMapper";

export class ColumnMapper {

  public static toDetailsResponse(column: ColumnWithDetails): ColumnDetailsResponse {
    return {
      id: column._id.toString(),
      name: column.name,
      boardId: column.boardId.toString(),
      cards: (column.cards || []).map(card => CardMapper.toDetailsResponse(card)),
    };
  }
}
