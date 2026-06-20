(function () {
  'use strict';

  if (window.__CasualFunnelTrackerLoaded) {
    return;
  }

  window.__CasualFunnelTrackerLoaded = true;

  var DEFAULT_ENDPOINT = 'http://localhost:4000/api/events';
  var DEFAULT_SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  var MAX_RETRIES = 3;
  var MAX_QUEUE_SIZE = 100;
  var currentScript = document.currentScript;
  var memorySessionId = null;
  var memoryLastActivityAt = 0;

  function getScriptAttribute(name) {
    if (!currentScript || !currentScript.getAttribute) {
      return '';
    }

    return currentScript.getAttribute(name) || '';
  }

  function resolveEndpoint() {
    var endpoint =
      getScriptAttribute('data-endpoint') || window.CASUALFUNNEL_ENDPOINT || DEFAULT_ENDPOINT;

    if (endpoint.indexOf('%VITE_') === 0) {
      return DEFAULT_ENDPOINT;
    }

    return endpoint;
  }

  var endpoint = resolveEndpoint();
  var storageKey = getScriptAttribute('data-storage-key') || 'casualfunnel.sessionId';
  var lastActivityKey = storageKey + '.lastActivityAt';
  var queueKey = storageKey + '.eventQueue';
  var pathPrefix = getScriptAttribute('data-track-path-prefix') || '';
  var sessionTimeoutMs = resolveSessionTimeout();

  function resolveSessionTimeout() {
    var rawTimeout =
      getScriptAttribute('data-session-timeout-ms') || window.CASUALFUNNEL_SESSION_TIMEOUT_MS;
    var parsedTimeout = Number(rawTimeout);

    if (!Number.isFinite(parsedTimeout) || parsedTimeout <= 0) {
      return DEFAULT_SESSION_TIMEOUT_MS;
    }

    return parsedTimeout;
  }

  function safeLocalStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function safeLocalStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      return false;
    }

    return true;
  }

  function safeLocalStorageRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (_error) {
      return false;
    }

    return true;
  }

  function generateUuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (character) {
      var random = (Math.random() * 16) | 0;
      var value = character === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  function getLastActivityAt() {
    var storedLastActivityAt = Number(safeLocalStorageGet(lastActivityKey));

    if (Number.isFinite(storedLastActivityAt) && storedLastActivityAt > 0) {
      return storedLastActivityAt;
    }

    return memoryLastActivityAt;
  }

  function rememberActivity(timestamp) {
    memoryLastActivityAt = timestamp;
    safeLocalStorageSet(lastActivityKey, String(timestamp));
  }

  function resetSession() {
    memorySessionId = null;
    memoryLastActivityAt = 0;
    safeLocalStorageRemove(storageKey);
    safeLocalStorageRemove(lastActivityKey);
  }

  function getSessionId() {
    var now = Date.now();
    var storedSessionId = safeLocalStorageGet(storageKey);
    var lastActivityAt = getLastActivityAt();
    var isExpired = lastActivityAt > 0 && now - lastActivityAt > sessionTimeoutMs;

    if (storedSessionId && !isExpired) {
      rememberActivity(now);
      return storedSessionId;
    }

    if (memorySessionId && !isExpired) {
      rememberActivity(now);
      return memorySessionId;
    }

    if (isExpired) {
      resetSession();
    }

    var sessionId = generateUuid();
    memorySessionId = sessionId;
    safeLocalStorageSet(storageKey, sessionId);
    rememberActivity(now);
    return sessionId;
  }

  function shouldTrackCurrentPage() {
    return !pathPrefix || window.location.pathname.indexOf(pathPrefix) === 0;
  }

  function getPageUrl() {
    return window.location.pathname + window.location.search;
  }

  function getQueue() {
    var rawQueue = safeLocalStorageGet(queueKey);

    if (!rawQueue) {
      return [];
    }

    try {
      var parsedQueue = JSON.parse(rawQueue);
      return Array.isArray(parsedQueue) ? parsedQueue : [];
    } catch (_error) {
      return [];
    }
  }

  function persistQueue(queue) {
    safeLocalStorageSet(queueKey, JSON.stringify(queue.slice(-MAX_QUEUE_SIZE)));
  }

  function queueEvent(payload) {
    var queue = getQueue();
    queue.push(payload);
    persistQueue(queue);
  }

  function postEvent(payload, attempt) {
    if (!window.fetch) {
      queueEvent(payload);
      return Promise.resolve();
    }

    var body = JSON.stringify(payload);

    return window
      .fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
        keepalive: body.length < 60000,
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Tracking request failed with status ' + response.status);
        }
      })
      .catch(function () {
        if (attempt < MAX_RETRIES) {
          var delay = Math.pow(2, attempt) * 400 + Math.round(Math.random() * 250);
          window.setTimeout(function () {
            void postEvent(payload, attempt + 1);
          }, delay);
          return;
        }

        queueEvent(payload);
      });
  }

  function sendEvent(event) {
    try {
      if (!shouldTrackCurrentPage()) {
        return;
      }

      var payload = {
        sessionId: getSessionId(),
        eventType: event.eventType,
        pageUrl: getPageUrl(),
        timestamp: new Date().toISOString(),
      };

      if (event.eventType === 'click') {
        payload.x = event.x;
        payload.y = event.y;
      }

      void postEvent(payload, 0);
    } catch (_error) {
      return;
    }
  }

  function flushQueue() {
    var queue = getQueue();

    if (queue.length === 0) {
      return;
    }

    persistQueue([]);

    queue.forEach(function (payload) {
      void postEvent(payload, 0);
    });
  }

  function trackPageView() {
    sendEvent({ eventType: 'page_view' });
  }

  function trackClick(event) {
    sendEvent({
      eventType: 'click',
      x: event.pageX,
      y: event.pageY,
    });
  }

  function trackRouteChange() {
    var lastPageUrl = getPageUrl();
    var originalPushState = window.history.pushState;
    var originalReplaceState = window.history.replaceState;

    function maybeTrackPageView() {
      window.setTimeout(function () {
        var nextPageUrl = getPageUrl();

        if (nextPageUrl !== lastPageUrl) {
          lastPageUrl = nextPageUrl;
          trackPageView();
        }
      }, 0);
    }

    window.history.pushState = function () {
      var result = originalPushState.apply(this, arguments);
      maybeTrackPageView();
      return result;
    };

    window.history.replaceState = function () {
      var result = originalReplaceState.apply(this, arguments);
      maybeTrackPageView();
      return result;
    };

    window.addEventListener('popstate', maybeTrackPageView);
  }

  document.addEventListener('click', trackClick, true);
  window.addEventListener('online', flushQueue);
  trackRouteChange();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView, { once: true });
  } else {
    window.setTimeout(trackPageView, 0);
  }

  window.setTimeout(flushQueue, 1000);
})();
