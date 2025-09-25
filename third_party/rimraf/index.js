'use strict';

const fs = require('fs');
const fsPromises = fs.promises;

function resolveOptions(options = {}) {
  return {
    force: options.force !== undefined ? options.force : true,
    maxRetries: options.maxRetries ?? 0,
    retryDelay: options.retryDelay ?? 100,
    signal: options.signal,
  };
}

async function remove(path, options) {
  const { force, maxRetries, retryDelay, signal } = resolveOptions(options);
  try {
    await fsPromises.rm(path, {
      recursive: true,
      force,
      maxRetries,
      retryDelay,
      signal,
    });
  } catch (error) {
    if (!force) {
      throw error;
    }
  }
}

function removeSync(path, options) {
  const { force, maxRetries } = resolveOptions(options);
  try {
    fs.rmSync(path, {
      recursive: true,
      force,
      maxRetries,
    });
  } catch (error) {
    if (!force) {
      throw error;
    }
  }
}

function rimraf(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const promise = remove(path, options);
  if (callback) {
    promise.then(() => callback(null), (error) => callback(error));
  }
  return promise;
}

rimraf.sync = removeSync;
rimraf.native = rimraf;
rimraf.nativeSync = removeSync;

module.exports = rimraf;
