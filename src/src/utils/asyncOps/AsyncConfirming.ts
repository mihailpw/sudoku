import { ICallState, CallState } from "@/utils";

interface IAsyncConfirmingParams<T> {
  processConfirm: (value: T) => Promise<any>;
}

export interface IAsyncConfirming<T> {
  confirming: boolean;
  confirmState: ICallState;
  start(value: T): void;
  confirm(): Promise<void>;
  decline(): void;
}

class AsyncConfirming<T> implements IAsyncConfirming<T> {
  private _processConfirm: (saveValue: T) => Promise<any>;
  private _savedValue: T | null = null;
  private _confirming = false;

  public readonly confirmState: CallState = new CallState();

  constructor(params: IAsyncConfirmingParams<T>) {
    this._processConfirm = params.processConfirm;
  }

  public get confirming(): boolean {
    return this._confirming;
  }

  public set confirming(value: boolean) {
    if (value) {
      this._confirming = true;
    } else {
      this.decline();
    }
  }

  public start(value: T): void {
    this._savedValue = value;
    this._confirming = true;
  }

  public async confirm(): Promise<void> {
    if (this._confirming && this._savedValue != null) {
      await this.confirmState.process(() =>
        this._processConfirm(this._savedValue as T)
      );
      this.decline();
    }
  }

  public decline(): void {
    this._confirming = false;
    this._savedValue = null;
  }
}

export function createAsyncConfirming<T>(
  params: IAsyncConfirmingParams<T>
): IAsyncConfirming<T> {
  return new AsyncConfirming<T>(params);
}
