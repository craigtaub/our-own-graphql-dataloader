export class DataLoader {
  constructor(batchLoadFn) {
    this._batchLoadFn = batchLoadFn;
    // this._cacheMap = new Map(); // could be disabled
  }
  // async _cacheKeyFn(key) {
  //   // load key into a cache key - gd for objects
  //   return JSON.stringify(key);
  // }
  _batchScheduleFn(fn) {
    if (!resolvedPromise) {
      resolvedPromise = Promise.resolve();
    }
    resolvedPromise.then(() => {
      process.nextTick(fn);
    });
  }
  _dispatchBatch() {
    this._batch.hasDispatched = true;

    // If there's nothing to load, resolve any cache hits and return early.
    if (this._batch.keys.length === 0) {
      // resolveCacheHits(batch);
      return;
    }
    // Call the provided batchLoadFn for this loader with the batch's keys and
    // with the loader as the `this` context.
    const batchPromise = this._batchLoadFn(this._batch.keys);

    // Await the resolution of the call to batchLoadFn.
    batchPromise
      .then((values) => {
        // Resolve all cache hits in the same micro-task as freshly loaded values.
        // resolveCacheHits(batch);

        // Step through values, resolving or rejecting each Promise in the batch.
        for (var i = 0; i < this._batch.callbacks.length; i++) {
          var value = values[i];
          if (value instanceof Error) {
            this._batch.callbacks[i].reject(value);
          } else {
            this._batch.callbacks[i].resolve(value);
          }
        }
      })
      .catch((error) => {
        this._failedDispatch(error);
      });
  }

  // do not cache individual loads if the entire batch dispatch fails,
  // but still reject each request so they do not hang.
  _failedDispatch(error) {
    // Cache hits are resolved, even though the batch failed.
    // resolveCacheHits(batch);
    for (var i = 0; i < this._batch.keys.length; i++) {
      this.clear(this._batch.keys[i]);
      this._batch.callbacks[i].reject(error);
    }
  }
  _getCurrentBatch() {
    const existingBatch = this._batch;
    // existing batch which has not yet dispatched
    if (existingBatch && !existingBatch.hasDispatched) {
      return existingBatch;
    }

    // new batch
    const newBatch = { hasDispatched: false, keys: [], callbacks: [] };
    this._batch = newBatch;
    // schedule a task to dispatch this batch of requests.
    this._batchScheduleFn(() => {
      this._dispatchBatch();
    });

    return newBatch;
  }
  async load(key) {
    // const batch = { keys: [], callbacks: [] }; // TODO - current batch
    const batch = this._getCurrentBatch();

    // var cacheMap = this._cacheMap;

    batch.keys.push(key);
    const promise = new Promise((resolve, reject) => {
      batch.callbacks.push({ resolve, reject });
    });

    // If caching, cache this promise.
    // const cacheKey = this._cacheKeyFn(key);
    // this._cacheMap.set(cacheKey, promise);

    return promise;
  }

  resolveCacheHits(batch) {
    // Resolves the Promises for any cache hits in this batch.
    if (batch.cacheHits) {
      for (var i = 0; i < batch.cacheHits.length; i++) {
        batch.cacheHits[i]();
      }
    }
  }

  // Clears the value at `key` from the cache
  clear(key) {
    // var cacheMap = this._cacheMap;
    // if (cacheMap) {
    // var cacheKey = this._cacheKeyFn(key);
    // cacheMap.delete(cacheKey);
    // }
    return this;
  }
}

// Private: cached resolved Promise instance
let resolvedPromise;
