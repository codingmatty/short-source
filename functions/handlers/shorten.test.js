const { Request, Response } = require('reqresnext');

const shorten = require('./shorten');
const { shortDomain } = require('../config');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

describe('shorten', () => {
  let res, getIndexSpy, storeLinkSpy, errorHandlerMock;

  beforeEach(() => {
    errorHandlerMock = jest.fn();
    getIndexSpy = jest
      .spyOn(db, 'getIndex')
      .mockImplementation(() => Promise.resolve(5000));
    storeLinkSpy = jest
      .spyOn(db, 'storeLink')
      .mockImplementation((link) => Promise.resolve(link));
    jest.spyOn(errors, 'handle').mockImplementation(() => errorHandlerMock);
    res = new Response();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls storeUrl with url', async () => {
    const req = new Request({ body: { url: 'https://www.google.com' } });
    await shorten(req, res);
    expect(storeLinkSpy).toHaveBeenCalledWith({
      slug: '2ud',
      url: 'https://www.google.com'
    });
  });

  it('sends a slugged link using url from the body', async () => {
    const req = new Request({ body: { url: 'https://www.google.com' } });
    await shorten(req, res);
    const { url } = JSON.parse(res.body);
    expect(url).toBe(`${shortDomain}/2ud`);
  });

  it('sends a slugged link using url from the query', async () => {
    const req = new Request({ query: { url: 'https://www.google.com' } });
    await shorten(req, res);
    const { url } = JSON.parse(res.body);
    expect(url).toBe(`${shortDomain}/2ud`);
  });

  it('sends a 400 error when no url is passed', async () => {
    const req = new Request();
    await shorten(req, res);
    const { error } = JSON.parse(res.body);
    expect(res.statusCode).toBe(400);
    expect(error).toBe('You must send a valid url to be shortened.');
  });

  it('sends a 400 error when an invalid url is provided', async () => {
    const req = new Request({ body: { url: 'invalid' } });
    await shorten(req, res);
    const { error } = JSON.parse(res.body);
    expect(res.statusCode).toBe(400);
    expect(error).toBe('You must send a valid url to be shortened.');
  });

  it('handles an application error', async () => {
    const testError = new Error('Test Error Message');
    storeLinkSpy.mockImplementation(() => Promise.reject(testError));
    const req = new Request({ body: { url: 'https://www.google.com' } });
    await shorten(req, res);
    expect(errorHandlerMock).toHaveBeenCalledWith(testError);
  });
});
