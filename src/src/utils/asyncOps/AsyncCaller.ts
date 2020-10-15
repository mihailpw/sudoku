import { CallState, ICallState } from "@/utils";

export interface IAsyncCaller {
  callState: ICallState;
  call(): Promise<void>;
}

class AsyncCaller implements IAsyncCaller {
  private _processCall: () => Promise<any>;

  public readonly callState: CallState = new CallState();

  constructor(processCall: () => Promise<any>) {
    this._processCall = processCall;
  }

  public async call(): Promise<void> {
    await this.callState.process(this._processCall);
  }
}

export function createAsyncCaller(
  processCall: () => Promise<any>
): IAsyncCaller {
  return new AsyncCaller(processCall);
}
