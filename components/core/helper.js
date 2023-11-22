import Alpine from 'alpinejs';

const getBaseUrl = (url) => {
    if (typeof url !== 'string' || url.length === 0) {
        console.error('Invalid URL provided:', url);
        return '';  
    }
    let baseurl = url.substring(0, url.lastIndexOf('/') + 1);
    return baseurl;
}


const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

const buildLink = (url) => {
    let returnUrl = url;

    if (isValidUrl(url)){
        returnUrl = `<a href="${url}" target="_blank">${url}`;
    }

    return returnUrl;
}

const emitCustomEvent = (name, detail) => {
    const event = new CustomEvent(name, {
        detail: detail
      });
      document.dispatchEvent(event);
      console.log(event);
      console.log("triggered");
}

/* Helper Function to wait for depending Markup. See: layerPanel */
const waitForElementAndExecute = (targetElementId, timeoutDuration = 10000) => {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutations, obs) => {
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
          obs.disconnect();
          resolve(true); 
        }
      });
  
      observer.observe(document.body, { childList: true, subtree: true });
  
      // Reject the promise after the timeout if the element is not found
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element with ID '${targetElementId}' not found within ${timeoutDuration}ms`));
      }, timeoutDuration);
    });
  }
  
/* Helper to check for overall DOM loading state */
const createAndwaitForDomElement = (createFunction, elementIdentifier) => {
    return new Promise(async (resolve, reject) => {
        await createFunction();

        // Immediate check if the element already exists
        if (document.querySelector(elementIdentifier)) {
            return resolve();
        }

        // Function to check if the element exists
        function checkAndResolve(mutations, observer) {
            if (document.querySelector(elementIdentifier)) {
                observer.disconnect(); // Stop observing
                resolve();             // Resolve the promise
            }
        }

        // Set up the mutation observer
        const observer = new MutationObserver(checkAndResolve);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        //  Add a timeout to reject the promise if it takes too long
        setTimeout(() => {
            observer.disconnect();
            reject(`Element ${elementIdentifier} not found`);
        }, 10000); 
    });
};

const renderMarkupAndSetPluginReady = async(domElementConfigs) => {
    const promises = domElementConfigs.map(config => createAndwaitForDomElement(...config));

    try {
        await Promise.all(promises);
        // All component elements are now in the DOM
        Alpine.store('pluginStatus').increasePluginLoadingStatus();
    } catch (error) {
        console.error(error);
    }
}


export { getBaseUrl, isValidUrl, emitCustomEvent, createAndwaitForDomElement, renderMarkupAndSetPluginReady, waitForElementAndExecute, buildLink };
