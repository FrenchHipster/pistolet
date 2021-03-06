import { EventEmitter } from 'events';
import { Backend, Request, RequestEntry, Response } from './backend';

export class TestBackend extends EventEmitter implements Backend {
  static instance: TestBackend;
  static request(request: { method: string, url: string }) {
    const path = request.url.split('?')[0];
    const query: any = {};
    const parts = request.url.substr(path.length + 1).split('&');
    for (const part of parts) {
      const [ key, value ] = part.split('=');
      if (value === undefined) continue;
      query[key] = value;
    }
    return this.instance.request({ ...request, path, query });
  }

  entries = new Array<RequestEntry>();

  init = jasmine.createSpy('init');
  requestsMade = jasmine.createSpy('requestsMade').and.callFake(() => this.entries);
  reset = jasmine.createSpy('reset').and.callFake(() => this.entries = []);
  start = jasmine.createSpy('start');
  stop = jasmine.createSpy('stop');

  constructor() {
    super();
    TestBackend.instance = this;
  }

  request(request: Request): Promise<{ statusCode: number, body: string | object }> {
    this.entries.push({ method: request.method, path: request.path });
    return new Promise((resolve) => {
      let statusCode: number;
      this.emit('request', request, {
        send: jasmine.createSpy('send').and.callFake((body) => resolve({ body, statusCode })),
        status: jasmine.createSpy('status').and.callFake((code) => statusCode = code),
      } as Response);
    });
  }
}
