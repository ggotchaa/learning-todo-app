'use strict';

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { EventEmitter } = require('events');
const minimatch = require('minimatch');
const Minimatch = minimatch.Minimatch;

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function toSystem(value) {
  if (path.sep === '/') {
    return value;
  }
  return value.split('/').join(path.sep);
}

function normalizeArguments(pattern, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (!options) {
    options = {};
  }
  return { pattern, options: { ...options }, callback };
}

function minimatchOptions(options) {
  return {
    dot: !!options.dot,
    nobrace: !!options.nobrace,
    noglobstar: !!options.noglobstar,
    noext: !!options.noext,
    nocase: !!options.nocase,
    matchBase: !!options.matchBase,
    flipNegate: !!options.flipNegate,
  };
}

function createIgnoreMatchers(ignore, options) {
  const patterns = Array.isArray(ignore) ? ignore : ignore ? [ignore] : [];
  return patterns.map((pattern) => new Minimatch(pattern, minimatchOptions(options)));
}

function isIgnored(ignoreMatchers, candidate, isDir) {
  if (!ignoreMatchers.length) {
    return false;
  }
  const matchCandidate = isDir ? `${candidate.replace(/\/+$/, '')}/` : candidate;
  return ignoreMatchers.some((matcher) => matcher.match(matchCandidate));
}

function formatResult(entry, options, cwd) {
  const systemPath = toSystem(entry.path);
  const withBase = options.absolute ? path.resolve(cwd, systemPath) : systemPath;
  if (options.mark && entry.isDirectory && !withBase.endsWith(path.sep)) {
    return `${withBase}${path.sep}`;
  }
  return withBase;
}

async function traverseAsync(root, options, matcher, ignoreMatchers, results) {
  let entries;
  try {
    entries = await fsPromises.readdir(root, { withFileTypes: true });
  } catch (error) {
    if (!options.silent) {
      throw error;
    }
    return;
  }

  await Promise.all(
    entries.map(async (entry) => {
      const relative = path.relative(options.cwd, path.join(root, entry.name));
      const posixRelative = toPosix(relative);
      const isDirectory = entry.isDirectory();
      if (isIgnored(ignoreMatchers, posixRelative, isDirectory)) {
        return;
      }

      const candidateForMatch = isDirectory ? `${posixRelative}/` : posixRelative;
      if (!options.nodir && isDirectory && matcher.match(candidateForMatch)) {
        results.push({ path: posixRelative, isDirectory: true });
      }
      if (!isDirectory && matcher.match(posixRelative)) {
        results.push({ path: posixRelative, isDirectory: false });
      }

      if (isDirectory) {
        await traverseAsync(path.join(root, entry.name), options, matcher, ignoreMatchers, results);
      }
    })
  );
}

function traverseSync(root, options, matcher, ignoreMatchers, results) {
  let entries;
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch (error) {
    if (!options.silent) {
      throw error;
    }
    return;
  }

  for (const entry of entries) {
    const relative = path.relative(options.cwd, path.join(root, entry.name));
    const posixRelative = toPosix(relative);
    const isDirectory = entry.isDirectory();
    if (isIgnored(ignoreMatchers, posixRelative, isDirectory)) {
      continue;
    }

    const candidateForMatch = isDirectory ? `${posixRelative}/` : posixRelative;
    if (!options.nodir && isDirectory && matcher.match(candidateForMatch)) {
      results.push({ path: posixRelative, isDirectory: true });
    }
    if (!isDirectory && matcher.match(posixRelative)) {
      results.push({ path: posixRelative, isDirectory: false });
    }

    if (isDirectory) {
      traverseSync(path.join(root, entry.name), options, matcher, ignoreMatchers, results);
    }
  }
}

async function collectAsync(pattern, options) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const matcher = new Minimatch(pattern, minimatchOptions(options));
  const ignoreMatchers = createIgnoreMatchers(options.ignore, options);
  const results = [];
  await traverseAsync(cwd, { ...options, cwd }, matcher, ignoreMatchers, results);
  const seen = new Set();
  const formatted = [];
  for (const entry of results) {
    let formattedPath = formatResult(entry, options, cwd);
    if (options.realpath) {
      formattedPath = fs.realpathSync.native
        ? fs.realpathSync.native(formattedPath)
        : fs.realpathSync(formattedPath);
    }
    if (!seen.has(formattedPath)) {
      seen.add(formattedPath);
      formatted.push(formattedPath);
    }
  }
  if (!options.nosort) {
    formatted.sort();
  }
  return formatted;
}

function collectSync(pattern, options) {
  const cwd = path.resolve(options.cwd || process.cwd());
  const matcher = new Minimatch(pattern, minimatchOptions(options));
  const ignoreMatchers = createIgnoreMatchers(options.ignore, options);
  const results = [];
  traverseSync(cwd, { ...options, cwd }, matcher, ignoreMatchers, results);
  const seen = new Set();
  const formatted = [];
  for (const entry of results) {
    let formattedPath = formatResult(entry, options, cwd);
    if (options.realpath) {
      formattedPath = fs.realpathSync.native
        ? fs.realpathSync.native(formattedPath)
        : fs.realpathSync(formattedPath);
    }
    if (!seen.has(formattedPath)) {
      seen.add(formattedPath);
      formatted.push(formattedPath);
    }
  }
  if (!options.nosort) {
    formatted.sort();
  }
  return formatted;
}

class Glob extends EventEmitter {
  constructor(pattern, options, callback) {
    super();
    const normalized = normalizeArguments(pattern, options, callback);
    this.pattern = normalized.pattern;
    this.options = normalized.options;
    this.aborted = false;
    this.found = [];

    process.nextTick(() => {
      collectAsync(this.pattern, this.options)
        .then((matches) => {
          if (this.aborted) {
            return;
          }
          this.found = matches;
          for (const match of matches) {
            this.emit('match', match);
          }
          this.emit('end', matches);
          if (normalized.callback) {
            normalized.callback(null, matches);
          }
        })
        .catch((error) => {
          if (normalized.callback) {
            normalized.callback(error);
          }
          if (!this.aborted) {
            this.emit('error', error);
          }
        });
    });
  }

  pause() {
    return this;
  }

  resume() {
    return this;
  }

  abort() {
    this.aborted = true;
    return this;
  }
}

function glob(pattern, options, callback) {
  const globber = new Glob(pattern, options, callback);
  return globber;
}

glob.Glob = Glob;
glob.glob = glob;
glob.sync = function globSync(pattern, options) {
  const normalized = normalizeArguments(pattern, options);
  return collectSync(normalized.pattern, normalized.options);
};

glob.hasMagic = function hasMagic(pattern, options) {
  return minimatch.hasMagic(pattern, minimatchOptions(options || {}));
};

glob.escape = minimatch.escape;

glob.unescape = function unescape(str) {
  return str.replace(/\\([*?{}()[\]\!])/g, '$1');
};

module.exports = glob;
