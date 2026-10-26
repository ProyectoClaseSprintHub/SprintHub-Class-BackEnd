import { BoardDetailsResponse, BoardResponse, BoardWhitDetails } from "../dtos/response/boardResponseDto";
import { IBoard } from "../models/Board";
import { ColumnMapper } from "./columnMapper";

export class BoardMapper {

  public static toResponse(board: IBoard): BoardResponse {
    return {
      id: board._id.toString(),
      title: board.title,
      description: board.description || '',
      groupId: board.groupId.toString(),
    };
  }


  public static toDetailsResponse(board: BoardWhitDetails): BoardDetailsResponse {
    return {
    id: board._id.toString(),
    title: board.title,
    description: board.description || '',
    groupId: board.groupId.toString(),
    columns: (board.columns || []).map(column => ColumnMapper.toDetailsResponse(column))
    };
  }
  
}
