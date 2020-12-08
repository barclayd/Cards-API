import { Card } from "@/entity/Card";

export interface ICardGenerationService {
  createCard(): Promise<Card>
}