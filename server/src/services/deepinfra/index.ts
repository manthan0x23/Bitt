import { Env } from "../../utils/env";

export class PromptService<T> {
  public static apiKey = Env.EDEN_AI_API_KEY;

  /*
   - TODO implement prompt
  */
  public async prompt(pmpt: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
