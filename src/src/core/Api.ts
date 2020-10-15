import axios from "axios";

class Api {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  public getProjects(): Promise<any> {
    return this.get("/projects");
  }

  private async get(url: string): Promise<any> {
    return (await axios.get(this._baseUrl + url)).data;
  }
}

export default new Api("http://localhost:5000");
