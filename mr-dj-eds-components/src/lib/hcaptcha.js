const HCAPTCHA_SCRIPT_SRC = 'https://js.hcaptcha.com/1/api.js?render=explicit';

let loadPromise = null;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function attachListeners(script, resolve, reject) {
  const handleLoad = () => {
    script.removeEventListener('load', handleLoad);
    script.removeEventListener('error', handleError);
    if (window.hcaptcha) {
      resolve(window.hcaptcha);
    } else {
      reject(new Error('hCaptcha script loaded without exposing window.hcaptcha'));
    }
  };

  const handleError = (event) => {
    script.removeEventListener('load', handleLoad);
    script.removeEventListener('error', handleError);
    loadPromise = null;
    reject(new Error(event?.message || 'Kon hCaptcha script niet laden'));
  };

  script.addEventListener('load', handleLoad);
  script.addEventListener('error', handleError);
}

export function loadHCaptchaScript() {
  if (!isBrowser()) {
    return Promise.reject(new Error('hCaptcha kan alleen in de browser geladen worden'));
  }

  if (window.hcaptcha) {
    return Promise.resolve(window.hcaptcha);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-hcaptcha-script="true"]');

    if (existingScript) {
      attachListeners(existingScript, resolve, reject);
      return;
    }

    const script = document.createElement('script');
    script.src = HCAPTCHA_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-hcaptcha-script', 'true');

    attachListeners(script, resolve, reject);

    document.head.appendChild(script);
  });

  return loadPromise;
}

export function resetHCaptchaScriptState() {
  loadPromise = null;
}

