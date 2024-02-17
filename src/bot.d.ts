import { Client } from "bedrock-protocol";

export declare class Bot extends Client {
  chat(message: string): void;
  command(command: string): void;
  responseForm(param: object, data: object);
  cancelForm(param: object, data: object);

  static create(): Bot;
}

export declare function createBot(options: object): Bot;
