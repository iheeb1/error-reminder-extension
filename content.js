// Error patterns for different languages and frameworks
const ERROR_PATTERNS = {
    // HTTP status codes
    http: {
      pattern: /\b(4\d{2}|5\d{2})\b/g,
      codes: {
        400: { name: "Bad Request", description: "The server cannot process the request due to client error" },
        401: { name: "Unauthorized", description: "Authentication is required" },
        403: { name: "Forbidden", description: "Server understood but refuses to authorize" },
        404: { name: "Not Found", description: "Requested resource could not be found" },
        500: { name: "Internal Server Error", description: "Generic server error message" },
        502: { name: "Bad Gateway", description: "Invalid response from upstream server" },
        503: { name: "Service Unavailable", description: "Server is temporarily unavailable" }
      }
    },
    
    // JavaScript errors
    javascript: {
      pattern: /(TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError)/gi,
      codes: {
        "TypeError": { name: "Type Error", description: "Operation performed on wrong data type" },
        "ReferenceError": { name: "Reference Error", description: "Variable or function not defined" },
        "SyntaxError": { name: "Syntax Error", description: "Code syntax is incorrect" },
        "RangeError": { name: "Range Error", description: "Number outside allowable range" },
        "URIError": { name: "URI Error", description: "Invalid URI encoding/decoding" },
        "EvalError": { name: "Eval Error", description: "Error in eval() function" }
      }
    },
    
    // Node.js errors
    nodejs: {
      pattern: /(ENOENT|EADDRINUSE|ECONNREFUSED|ENOTFOUND|EMFILE|EACCES)/gi,
      codes: {
        "ENOENT": { name: "No Such File", description: "File or directory doesn't exist" },
        "EADDRINUSE": { name: "Address In Use", description: "Port is already being used" },
        "ECONNREFUSED": { name: "Connection Refused", description: "Target machine refused connection" },
        "ENOTFOUND": { name: "Not Found", description: "DNS lookup failed" },
        "EMFILE": { name: "Too Many Files", description: "Too many open files" },
        "EACCES": { name: "Access Denied", description: "Permission denied" }
      }
    },
    
    // React errors
    react: {
      pattern: /(Warning:|Error:|Uncaught Error)/gi,
      codes: {
        "Warning: Each child in a list should have a unique \"key\" prop": {
          name: "Missing Key Prop",
          description: "React needs unique keys for list items to track changes efficiently"
        },
        "Cannot read property": {
          name: "Property Access Error",
          description: "Trying to access property of undefined or null object"
        }
      }
    }
  };
  
  let tooltipElement = null;
  let errorTooltipTimeout = null;
  
  // Initialize error detection
  function init() {
    // Check if extension is active
    chrome.storage.local.get(['extensionActive'], (result) => {
      const isActive = result.extensionActive !== false; // Default to true
      
      if (isActive) {
        // Scan existing text for errors
        scanForErrors();
        
        // Listen for console errors
        interceptConsoleErrors();
        
        // Monitor DOM changes for new errors
        observeDOMChanges();
        
        // Send initial stats update
        chrome.runtime.sendMessage({
          action: 'updateStats',
          errorsFound: document.querySelectorAll('.error-code-highlight').length
        });
      }
    });
    
    // Listen for extension toggle messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'enable') {
        location.reload();
      } else if (message.action === 'disable') {
        // Remove all highlights
        document.querySelectorAll('.error-code-highlight').forEach(el => {
          el.outerHTML = el.textContent;
        });
        // Remove notifications
        document.querySelectorAll('.error-notification').forEach(el => {
          el.remove();
        });
      } else if (message.action === 'test') {
        // Inject test errors for demonstration
        const testDiv = document.createElement('div');
        testDiv.style.cssText = 'padding: 20px; background: #f8f9fa; border: 1px solid #dee2e6; margin: 20px; border-radius: 8px;';
        testDiv.innerHTML = `
          <h3>Test Errors (injected by extension)</h3>
          <p>HTTP Error: 404 Not Found - The requested resource could not be found.</p>
          <p>JavaScript Error: TypeError: Cannot read property 'name' of undefined</p>
          <p>Node.js Error: ECONNREFUSED - Connection refused by server</p>
          <p>React Warning: Each child in a list should have a unique "key" prop</p>
        `;
        document.body.insertBefore(testDiv, document.body.firstChild);
        
        // Scan for the new test errors
        setTimeout(() => {
          scanForErrors();
        }, 100);
      }
    });
  }
  
  function scanForErrors() {
    const textNodes = getTextNodes(document.body);
    
    textNodes.forEach(node => {
      // Skip nodes that are already processed or are part of our extension
      if (node.parentNode?.classList?.contains('error-code-highlight') ||
          node.parentNode?.closest('.error-tooltip, .error-notification')) {
        return;
      }
      
      let text = node.textContent;
      let hasErrors = false;
      let newHTML = text;
      
      // Check each error pattern category
      Object.keys(ERROR_PATTERNS).forEach(category => {
        const pattern = ERROR_PATTERNS[category];
        const matches = text.match(pattern.pattern);
        
        if (matches) {
          matches.forEach(match => {
            const errorInfo = findErrorInfo(match, category);
            if (errorInfo) {
              hasErrors = true;
              newHTML = newHTML.replace(
                new RegExp(escapeRegExp(match), 'g'),
                `<span class="error-code-highlight" data-error="${match}" data-category="${category}" data-name="${errorInfo.name}" data-description="${errorInfo.description}">${match}</span>`
              );
            }
          });
        }
      });
      
      if (hasErrors && node.parentNode) {
        const wrapper = document.createElement('span');
        wrapper.innerHTML = newHTML;
        node.parentNode.replaceChild(wrapper, node);
      }
    });
    
    // Add event listeners to newly highlighted errors
    addErrorEventListeners();
  }
  
  function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip script, style elements and our own extension elements
          const parent = node.parentElement;
          if (parent && (
            parent.tagName === 'SCRIPT' || 
            parent.tagName === 'STYLE' ||
            parent.classList.contains('error-code-highlight') ||
            parent.classList.contains('error-tooltip') ||
            parent.classList.contains('error-notification') ||
            parent.closest('.error-tooltip, .error-notification')
          )) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );
    
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    return textNodes;
  }
  
  function findErrorInfo(errorCode, category) {
    const categoryData = ERROR_PATTERNS[category];
    
    if (category === 'http') {
      return categoryData.codes[errorCode];
    } else {
      // For text-based errors, try exact match first, then partial match
      if (categoryData.codes[errorCode]) {
        return categoryData.codes[errorCode];
      }
      
      // Check for partial matches
      for (const key in categoryData.codes) {
        if (errorCode.includes(key) || key.includes(errorCode)) {
          return categoryData.codes[key];
        }
      }
    }
    
    return null;
  }
  
  function addErrorEventListeners() {
    const errorElements = document.querySelectorAll('.error-code-highlight');
    
    errorElements.forEach(element => {
      element.addEventListener('mouseenter', showErrorTooltip);
      element.addEventListener('mouseleave', hideErrorTooltip);
      element.addEventListener('click', handleErrorClick);
    });
  }
  
  function showErrorTooltip(event) {
    clearTimeout(errorTooltipTimeout);
    
    const element = event.target;
    const errorCode = element.dataset.error;
    const errorName = element.dataset.name;
    const errorDescription = element.dataset.description;
    
    if (tooltipElement) {
      hideErrorTooltip();
    }
    
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'error-tooltip';
    tooltipElement.innerHTML = `
      <div class="error-tooltip-header">
        <strong>${errorCode}</strong>
        <button class="error-tooltip-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="error-tooltip-name">${errorName}</div>
      <div class="error-tooltip-description">${errorDescription}</div>
      <div class="error-tooltip-actions">
        <button class="error-action-btn" onclick="searchStackOverflow('${errorCode}')">
          🔍 Search Stack Overflow
        </button>
        <button class="error-action-btn" onclick="searchDocs('${errorCode}')">
          📖 Search Docs
        </button>
      </div>
    `;
    
    document.body.appendChild(tooltipElement);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltipElement.style.left = rect.left + 'px';
    tooltipElement.style.top = (rect.bottom + 10) + 'px';
  }
  
  function hideErrorTooltip() {
    errorTooltipTimeout = setTimeout(() => {
      if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
      }
    }, 300);
  }
  
  function handleErrorClick(event) {
    event.preventDefault();
    const errorCode = event.target.dataset.error;
    searchStackOverflow(errorCode);
    
    // Update statistics
    chrome.runtime.sendMessage({
      action: 'updateStats',
      solutionsUsed: 1
    });
  }
  
  // Global functions for tooltip buttons
  window.searchStackOverflow = function(errorCode) {
    const query = encodeURIComponent(errorCode + " solution");
    window.open(`https://stackoverflow.com/search?q=${query}`, '_blank');
    
    // Update statistics
    chrome.runtime.sendMessage({
      action: 'updateStats',
      solutionsUsed: 1
    });
  };
  
  window.searchDocs = function(errorCode) {
    const query = encodeURIComponent(errorCode + " documentation");
    window.open(`https://developer.mozilla.org/en-US/search?q=${query}`, '_blank');
    
    // Update statistics
    chrome.runtime.sendMessage({
      action: 'updateStats',
      solutionsUsed: 1
    });
  };
  
  function interceptConsoleErrors() {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = function(...args) {
      handleConsoleMessage('error', args);
      return originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
      handleConsoleMessage('warn', args);
      return originalWarn.apply(console, args);
    };
    
    // Listen for unhandled errors
    window.addEventListener('error', (event) => {
      showErrorNotification({
        type: 'javascript',
        code: event.error?.name || 'Error',
        message: event.message,
        source: event.filename,
        line: event.lineno
      });
    });
  }
  
  function handleConsoleMessage(type, args) {
    const message = args.join(' ');
    
    // Check if message contains error patterns
    Object.keys(ERROR_PATTERNS).forEach(category => {
      const pattern = ERROR_PATTERNS[category];
      const matches = message.match(pattern.pattern);
      
      if (matches) {
        matches.forEach(match => {
          const errorInfo = findErrorInfo(match, category);
          if (errorInfo) {
            showErrorNotification({
              type: category,
              code: match,
              name: errorInfo.name,
              description: errorInfo.description,
              message: message
            });
          }
        });
      }
    });
  }
  
  function showErrorNotification(errorData) {
    // Create floating notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-notification-header">
        <span class="error-icon">⚠️</span>
        <strong>${errorData.code}</strong>
        <button class="error-notification-close">×</button>
      </div>
      <div class="error-notification-body">
        <div class="error-name">${errorData.name}</div>
        <div class="error-description">${errorData.description}</div>
        <div class="error-actions">
          <button onclick="searchStackOverflow('${errorData.code}')">Stack Overflow</button>
          <button onclick="copyErrorInfo('${errorData.code}', '${errorData.description}')">Copy Info</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
    
    // Add close button functionality
    notification.querySelector('.error-notification-close').onclick = () => {
      notification.remove();
    };
  }
  
  window.copyErrorInfo = function(code, description) {
    const text = `Error: ${code}\nDescription: ${description}`;
    navigator.clipboard.writeText(text).then(() => {
      console.log('Error info copied to clipboard');
    });
  };
  
  function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new text nodes were added (avoid scanning our own highlights)
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE || 
                (node.nodeType === Node.ELEMENT_NODE && 
                 node.textContent && 
                 !node.classList?.contains('error-code-highlight') &&
                 !node.classList?.contains('error-tooltip') &&
                 !node.classList?.contains('error-notification'))) {
              shouldScan = true;
            }
          });
        }
      });
      
      if (shouldScan) {
        // Debounce scanning to prevent infinite loops
        clearTimeout(window.scanTimeout);
        window.scanTimeout = setTimeout(() => {
          // Temporarily disconnect observer during scan
          observer.disconnect();
          scanForErrors();
          // Reconnect after scan
          setTimeout(() => {
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          }, 100);
        }, 1000);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }