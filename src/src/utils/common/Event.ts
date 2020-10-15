export interface IEvent<TSender, TData> {
  subscribe(action: (sender: TSender, data: TData) => void): void;
  unsubscribe(action: (sender: TSender, data: TData) => void): void;
}

export class Event<TSender, TData> implements IEvent<TSender, TData> {
  private readonly sender: TSender;
  private readonly subscribers: Array<(sender: TSender, data: TData) => void>;

  constructor(sender: TSender) {
    this.sender = sender;
    this.subscribers = [];
  }

  public subscribe(action: (sender: TSender, data: TData) => void): void {
    this.subscribers.push(action);
  }

  public unsubscribe(action: (sender: TSender, data: TData) => void): void {
    const index = this.subscribers.indexOf(action);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  public raise(data: TData): void {
    this.subscribers.forEach(act => act(this.sender, data));
  }
}
