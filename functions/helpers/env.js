const { env } = process;

exports.isDev = !env.NODE_ENV || env.NODE_ENV === 'development';
exports.isTest = env.NODE_ENV === 'test';

exports.getEnvValue = (envVar) => {
  return env[envVar];
};
