// Banner shown while a request is slow, usually because Render's free plan is starting the
// backend again after about 15 minutes without traffic (this can take up to a minute).
// api/client.js calls startWaiting/stopWaiting; the banner stays up while any request waits.
let waiting = 0;
let el = null;

function element() {
  if (!el) {
    el = document.createElement('div');
    el.className = 'wake-notice';
    el.setAttribute('role', 'status');
    el.textContent = 'Connecting to the server... After a quiet period this can take up to a minute.';
    el.hidden = true;
    document.body.append(el);
  }
  return el;
}

export function startWaiting() {
  waiting += 1;
  element().hidden = false;
}

export function stopWaiting() {
  waiting = Math.max(0, waiting - 1);
  if (waiting === 0 && el) el.hidden = true;
}
