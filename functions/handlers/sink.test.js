const { Request, Response } = require('reqresnext');
const ck = require('chronokinesis');

const { defaultDestination, shortDomain } = require('../config');
const sink = require('./sink');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

describe('sink', () => {
  let req, res, findLinkSpy, recordVisitSpy, errorHandlerMock;

  beforeEach(() => {
    errorHandlerMock = jest.fn();
    findLinkSpy = jest
      .spyOn(db, 'findLink')
      .mockImplementation(() => Promise.resolve());
    recordVisitSpy = jest
      .spyOn(db, 'recordVisit')
      .mockImplementation(Promise.resolve);
    jest.spyOn(errors, 'handle').mockImplementation(() => errorHandlerMock);
    req = new Request({
      url: `${shortDomain}/2ud`,
      originalUrl: '/2ud?a=1&b=2'
    });
    req.app.set = jest.fn();
    req.app.enable = jest.fn();
    res = new Response();
    res.redirect = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sets app variable [case sensitive routing]', async () => {
    await sink(req, res);
    expect(req.app.set).toBeCalledWith('case sensitive routing', true);
  });

  it('enables [trust proxy]', async () => {
    await sink(req, res);
    expect(req.app.enable).toBeCalledWith('trust proxy');
  });

  it('calls findLink with path', async () => {
    await sink(req, res);
    expect(findLinkSpy).toHaveBeenCalledWith('2ud');
  });

  it('redirects to default destination', async () => {
    await sink(req, res);
    expect(res.redirect).toHaveBeenCalledWith(
      'https://www.matthewjacobs.io/2ud?a=1&b=2'
    );
  });

  it('redirects to provided url', async () => {
    findLinkSpy.mockImplementation(() =>
      Promise.resolve('https://www.google.com')
    );
    await sink(req, res);
    expect(res.redirect).toHaveBeenCalledWith('https://www.google.com');
  });

  it('calls records the visit', async () => {
    ck.freeze();
    await sink(req, res);
    expect(recordVisitSpy).toHaveBeenCalledWith({
      date: new Date().toISOString(),
      slug: '2ud',
      url: 'https://www.matthewjacobs.io/2ud?a=1&b=2',
      userAgent: {
        browser: { major: '537', name: 'WebKit', version: '537.36' },
        engine: { name: 'WebKit', version: '537.36' },
        ua:
          'Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.6.2'
      }
    });
    ck.reset();
  });
});
