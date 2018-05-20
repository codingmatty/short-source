const { Request, Response } = require('reqresnext');

const links = require('./links');
const { shortDomain } = require('../config');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

const linksFixture = [
  { slug: '2ud', url: 'https://www.google.com' },
  { slug: '2ue', url: 'https://github.com' },
  { slug: '2uf', url: 'https://www.matthewjacobs.io' }
];

describe('links', () => {
  let res, getLinksSpy, errorHandlerMock;

  beforeEach(() => {
    errorHandlerMock = jest.fn();
    getLinksSpy = jest
      .spyOn(db, 'getLinks')
      .mockImplementation(() => Promise.resolve(linksFixture));
    jest.spyOn(errors, 'handle').mockImplementation(() => errorHandlerMock);
    res = new Response();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls getLinks', async () => {
    const req = new Request();
    await links(req, res);
    expect(getLinksSpy).toHaveBeenCalled();
  });

  it('passes query params to getLinks function', async () => {
    const req = new Request({ query: { sortBy: 'date' } });
    await links(req, res);
    expect(getLinksSpy).toHaveBeenCalledWith({ sortBy: 'date' });
  });
});
