import { IBoard } from "../../models/Board";
import { ColumnDetailsResponse, ColumnWithDetails } from "./columnResponseDto";

export type BoardWhitDetails = IBoard & {
columns: ColumnWithDetails[]
};

export type BoardResponse = {
  id: string;
  title: string;
  description: string;
  groupId: string;
};

export interface BoardDetailsResponse {
  id: string;
  title: string;
  description: string;
  groupId: string;
  columns: ColumnDetailsResponse[]
}

