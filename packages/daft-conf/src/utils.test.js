import { getSafeValue, getTruthy, toCapsCase } from './utils'

describe('Utils', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // this is important
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it('should return the UPPER_CASE for camelCase', () => {
    expect(toCapsCase('asdBcd')).toEqual('ASD_BCD')
    expect(toCapsCase('httpProxy')).toEqual('HTTP_PROXY')
  })

  it('should return false for the string "false"', () => {
    expect(getTruthy('false')).toBeFalsy()
    expect(getTruthy('true')).toBeTruthy()
    const falseyValues = [0, '0', 'false', false, 'n', 'no']
    falseyValues.forEach(val => expect(getTruthy(val)).toBeFalsy())
  })

  it('should return false & true if overridden in process.env', () => {
    const conf = {
      falseOriginally: 'false',
      trueOriginally: 'true',
      falseOriginallyButDoesntChange: false,
    }

    const processEnvs = {
      ...process.env,
      ...({
        FALSE_ORIGINALLY: 'true',
        TRUE_ORIGINALLY: 'false',
      }),
    }

    expect(getSafeValue('falseOriginally', conf, processEnvs)).toBeTruthy()
    expect(getSafeValue('trueOriginally', conf, processEnvs)).toBeFalsy()
    expect(getSafeValue('falseOriginallyButDoesntChange', conf, processEnvs)).toBeFalsy()

    process.env.NODE_ENV = 'AMAZING_ENV'
    expect(getSafeValue('nodeEnv')).toBe('AMAZING_ENV')
  })

  it('should return the overridden value if in env', () => {
    const processEnvs = {
      PROXY: 'false',
    }
    expect(getSafeValue('proxy', { proxy: 'http://proxy:port' }, processEnvs)).toBeFalsy()
    expect(getSafeValue('proxy', { proxy: 'http://proxy:port' })).toBeTruthy()
  })
})
