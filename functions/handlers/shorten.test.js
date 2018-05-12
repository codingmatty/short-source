const { Request, Response } = require('reqresnext');
const sinon = require('sinon');

const shorten = require('./shorten');
const { short } = require('../config');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

describe('shorten', () => {
  let res, storeUrlStub, errorHandlerMock;

  beforeEach(() => {
    errorHandlerMock = jest.fn();
    storeUrlStub = sinon.stub(db, 'storeUrl').resolves({ slug: '2ud' });
    sinon.stub(errors, 'handle').callsFake(() => errorHandlerMock);
    res = new Response();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('calls storeUrl with url', async () => {
    const req = new Request({ body: { url: 'https://www.google.com' } });
    await shorten(req, res);
    sinon.assert.calledWith(storeUrlStub, 'https://www.google.com');
  });

  it('sends a slugged link using url from the body', async () => {
    const req = new Request({ body: { url: 'https://www.google.com' } });
    await shorten(req, res);
    const { url } = JSON.parse(res.body);
    expect(url).toBe(`${short}/2ud`);
  });

  it('sends a slugged link using url from the query', async () => {
    const req = new Request({ query: { url: 'https://www.google.com' } });
    await shorten(req, res);
    const { url } = JSON.parse(res.body);
    expect(url).toBe(`${short}/2ud`);
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
    storeUrlStub.rejects(testError);
    const req = new Request({ body: { url: 'https://www.google.com' } });
    await shorten(req, res);
    expect(errorHandlerMock).toHaveBeenCalledWith(testError);
  });
});
