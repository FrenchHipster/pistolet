export interface RequestBody {
  [key: string]: string | RegExp | RequestBody[] | RequestBody;
}

export interface RequestQuery {
  [key: string]: string | RegExp;
}

export interface RequestMock {
  path: string;
  method?: string;
  body?: RequestBody;
  query?: RequestQuery;
}

export interface ResponseMock {
  data: object | string;
  status?: number;
}

export interface Mock {
  name?: string;
  request: RequestMock;
  response: ResponseMock;
}

export type MockMatch = Mock | boolean | undefined;
