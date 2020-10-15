import { IEvent, Event } from "@/utils";

export interface ICallState {
  error: any;
  pending: boolean;
  timestamp: number;
  onErrorReceived: IEvent<ICallState, any>;
}

export class CallState implements ICallState {
  public error: any = null;
  public pending = false;
  public timestamp = 0;
  public readonly onErrorReceived: IEvent<ICallState, any>;

  constructor() {
    this.onErrorReceived = new Event<ICallState, any>(this);
  }

  public async process<T>(action: () => Promise<T>): Promise<T | null> {
    this.error = null;
    this.pending = true;
    this.timestamp = Date.now();

    try {
      return await action();
    } catch (error) {
      const normalizedError = CallState.normalizeError(error);
      this.error = normalizedError;
      (this.onErrorReceived as Event<ICallState, any>).raise(normalizedError);
      return null;
    } finally {
      this.pending = false;
    }
  }

  // https://github.com/nuxt-community/composition-api/blob/ac15e982e572c9fc6d4a95cfcb7c64eebb36fa22/src/fetch.ts#L10
  private static normalizeError(err: any): any {
    let message;
    if (!(err.message || typeof err === "string")) {
      try {
        message = JSON.stringify(err, null, 2);
      } catch (e) {
        message = `[${err.constructor.name}]`;
      }
    } else {
      message = err.message || err;
    }

    return {
      ...err,
      message,
      statusCode:
        err.statusCode ||
        err.status ||
        (err.response && err.response.status) ||
        500
    };
  }
}
