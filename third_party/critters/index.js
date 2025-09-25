'use strict';

/**
 * Minimal replacement for the critters package used by the Angular CLI.
 * The implementation keeps the same public API surface but simply performs
 * a no-op pass over the provided HTML. This allows us to ship a patched
 * version without the vulnerable transitive dependencies that the original
 * package brought in while keeping deterministic build output.
 */
class Critters {
  constructor(options = {}) {
    this.options = { ...options };
  }

  async process(html, overrides = {}) {
    const effectiveOptions = { ...this.options, ...overrides };
    if (typeof effectiveOptions.onInline === 'function') {
      await effectiveOptions.onInline({ html });
    }
    return html;
  }

  processSync(html, overrides = {}) {
    const effectiveOptions = { ...this.options, ...overrides };
    if (typeof effectiveOptions.onInline === 'function') {
      effectiveOptions.onInline({ html });
    }
    return html;
  }
}

module.exports = Critters;
module.exports.default = Critters;
