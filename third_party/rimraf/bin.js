#!/usr/bin/env node
'use strict';

const rimraf = require('./index');

async function main() {
  const paths = process.argv.slice(2);
  if (!paths.length) {
    return;
  }
  for (const target of paths) {
    await rimraf(target);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
