'use strict';

function createTimerRegistry() {
  const intervals = new Set();
  const timeouts = new Set();

  return {
    setInterval(callback, delay) {
      const id = setInterval(callback, delay);
      intervals.add(id);
      return id;
    },
    setTimeout(callback, delay) {
      const id = setTimeout(() => {
        timeouts.delete(id);
        callback();
      }, delay);
      timeouts.add(id);
      return id;
    },
    clear() {
      for (const id of intervals) clearInterval(id);
      for (const id of timeouts) clearTimeout(id);
      intervals.clear();
      timeouts.clear();
    }
  };
}

module.exports = { createTimerRegistry };
