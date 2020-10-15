import { CallState, ICallState } from "@/utils";

interface IAsyncLoaderParams<T> {
  initialValue: T | null;
  processLoad(): Promise<T>;
}

export interface IAsyncLoader<T> {
  value: T | null;
  refreshState: ICallState;
  refresh(force?: boolean): Promise<void>;
}

class AsyncLoader<T> implements IAsyncLoader<T> {
  private _processLoad: () => Promise<T>;

  public value: T | null;
  public readonly refreshState: CallState = new CallState();

  constructor(params: IAsyncLoaderParams<T>) {
    this.value = params.initialValue;
    this._processLoad = params.processLoad;
  }

  public async refresh(force: boolean): Promise<void> {
    if (this.refreshState.pending && !force) {
      return;
    }

    const loadResult = await this.refreshState.process(this._processLoad);
    if (loadResult != null) {
      this.value = loadResult;
    }
  }
}

export function createAsyncLoader<T>(
  params: IAsyncLoaderParams<T>
): IAsyncLoader<T> {
  return new AsyncLoader<T>(params);
}
