// Background service worker for Error Code Translator extension

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      // Set default settings
      chrome.storage.local.set({
        extensionActive: true,
        dailyStats: {
          date: new Date().toDateString(),
          stats: {
            errorsDetected: 0,
            solutionsProvided: 0
          }
        }
      });
      
      // Show welcome notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Error Code Translator Installed!',
        message: 'The extension is now active and will help you understand error codes on any webpage.'
      });
    }
  });
  
  // Handle messages from content scripts and popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case 'logError':
        handleErrorLogging(message.errorData);
        break;
        
      case 'searchStackOverflow':
        handleStackOverflowSearch(message.query);
        break;
        
      case 'updateStats':
        updateDailyStats(message.stats);
        break;
        
      case 'getErrorDatabase':
        sendResponse(getErrorDatabase());
        break;
    }
    
    return true; // Keep message channel open for async response
  });
  
  // Handle context menu creation
  chrome.runtime.onStartup.addListener(() => {
    createContextMenus();
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    createContextMenus();
  });
  
  function createContextMenus() {
    // Remove existing context menus
    chrome.contextMenus.removeAll(() => {
      // Create context menu for selected text
      chrome.contextMenus.create({
        id: 'analyzeError',
        title: 'Analyze Error Code: "%s"',
        contexts: ['selection'],
        documentUrlPatterns: ['http://*/*', 'https://*/*']
      });
      
      // Create context menu for page action
      chrome.contextMenus.create({
        id: 'toggleExtension',
        title: 'Toggle Error Detection',
        contexts: ['action']
      });
    });
  }
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case 'analyzeError':
        analyzeSelectedError(info.selectionText, tab.id);
        break;
        
      case 'toggleExtension':
        toggleExtension(tab.id);
        break;
    }
  });
  
  function analyzeSelectedError(selectedText, tabId) {
    // Send selected text to content script for analysis
    chrome.tabs.sendMessage(tabId, {
      action: 'analyzeText',
      text: selectedText
    });
  }
  
  function toggleExtension(tabId) {
    // Get current state and toggle
    chrome.storage.local.get(['extensionActive'], (result) => {
      const newState = !result.extensionActive;
      
      chrome.storage.local.set({ extensionActive: newState });
      
      // Send message to content script
      chrome.tabs.sendMessage(tabId, {
        action: newState ? 'enable' : 'disable'
      });
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Error Code Translator',
        message: `Extension ${newState ? 'enabled' : 'disabled'} for this tab.`
      });
    });
  }
  
  function handleErrorLogging(errorData) {
    // Log error for analytics and learning
    const timestamp = new Date().toISOString();
    const logEntry = {
      ...errorData,
      timestamp,
      url: errorData.url || 'unknown'
    };
    
    // Store in local storage (you could also send to analytics service)
    chrome.storage.local.get(['errorLog'], (result) => {
      const errorLog = result.errorLog || [];
      errorLog.push(logEntry);
      
      // Keep only last 100 errors to manage storage
      const trimmedLog = errorLog.slice(-100);
      
      chrome.storage.local.set({ errorLog: trimmedLog });
    });
    
    // Update daily stats
    updateDailyStats({ errorsDetected: 1 });
  }
  
  function handleStackOverflowSearch(query) {
    // Create new tab with Stack Overflow search
    const searchUrl = `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`;
    chrome.tabs.create({ url: searchUrl });
    
    // Update stats
    updateDailyStats({ solutionsProvided: 1 });
  }
  
  function updateDailyStats(newStats) {
    chrome.storage.local.get(['dailyStats'], (result) => {
      const today = new Date().toDateString();
      let dailyStats = result.dailyStats || { date: today, stats: { errorsDetected: 0, solutionsProvided: 0 } };
      
      // Reset stats if it's a new day
      if (dailyStats.date !== today) {
        dailyStats = { date: today, stats: { errorsDetected: 0, solutionsProvided: 0 } };
      }
      
      // Update stats
      dailyStats.stats.errorsDetected += newStats.errorsDetected || 0;
      dailyStats.stats.solutionsProvided += newStats.solutionsProvided || 0;
      
      chrome.storage.local.set({ dailyStats });
    });
  }
  
  function getErrorDatabase() {
    // Return comprehensive error database
    return {
      http: {
        pattern: /\b(4\d{2}|5\d{2})\b/g,
        codes: {
          400: { name: "Bad Request", description: "The server cannot process the request due to client error", solutions: ["Check request syntax", "Validate request parameters", "Verify content type"] },
          401: { name: "Unauthorized", description: "Authentication is required", solutions: ["Check API keys", "Verify authentication headers", "Refresh access token"] },
          403: { name: "Forbidden", description: "Server understood but refuses to authorize", solutions: ["Check permissions", "Verify user roles", "Review access controls"] },
          404: { name: "Not Found", description: "Requested resource could not be found", solutions: ["Check URL spelling", "Verify resource exists", "Check routing configuration"] },
          422: { name: "Unprocessable Entity", description: "Request was well-formed but contains semantic errors", solutions: ["Validate input data", "Check required fields", "Review data types"] },
          429: { name: "Too Many Requests", description: "Rate limit exceeded", solutions: ["Implement backoff strategy", "Check rate limits", "Use caching"] },
          500: { name: "Internal Server Error", description: "Generic server error message", solutions: ["Check server logs", "Verify server configuration", "Test on different environment"] },
          502: { name: "Bad Gateway", description: "Invalid response from upstream server", solutions: ["Check upstream services", "Verify proxy configuration", "Test connectivity"] },
          503: { name: "Service Unavailable", description: "Server is temporarily unavailable", solutions: ["Wait and retry", "Check service status", "Implement circuit breaker"] },
          504: { name: "Gateway Timeout", description: "Upstream server timeout", solutions: ["Increase timeout values", "Optimize upstream performance", "Check network connectivity"] }
        }
      },
      javascript: {
        pattern: /(TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError)/gi,
        codes: {
          "TypeError": { 
            name: "Type Error", 
            description: "Operation performed on wrong data type", 
            solutions: ["Check variable types", "Use type guards", "Validate function parameters", "Check null/undefined values"] 
          },
          "ReferenceError": { 
            name: "Reference Error", 
            description: "Variable or function not defined", 
            solutions: ["Check variable declarations", "Verify function names", "Check scope", "Import missing modules"] 
          },
          "SyntaxError": { 
            name: "Syntax Error", 
            description: "Code syntax is incorrect", 
            solutions: ["Check syntax", "Validate brackets/parentheses", "Check semicolons", "Use linter"] 
          },
          "RangeError": { 
            name: "Range Error", 
            description: "Number outside allowable range", 
            solutions: ["Check array bounds", "Validate number ranges", "Check recursion depth", "Validate array length"] 
          },
          "URIError": { 
            name: "URI Error", 
            description: "Invalid URI encoding/decoding", 
            solutions: ["Check URL encoding", "Validate URI components", "Use proper escape sequences", "Check special characters"] 
          },
          "EvalError": { 
            name: "Eval Error", 
            description: "Error in eval() function", 
            solutions: ["Avoid using eval()", "Use safer alternatives", "Validate input", "Consider JSON.parse()"] 
          }
        }
      },
      nodejs: {
        pattern: /(ENOENT|EADDRINUSE|ECONNREFUSED|ENOTFOUND|EMFILE|EACCES|EPERM|EISDIR|EEXIST)/gi,
        codes: {
          "ENOENT": { 
            name: "No Such File", 
            description: "File or directory doesn't exist", 
            solutions: ["Check file path", "Verify file exists", "Check permissions", "Create missing directories"] 
          },
          "EADDRINUSE": { 
            name: "Address In Use", 
            description: "Port is already being used", 
            solutions: ["Use different port", "Kill existing process", "Check for port conflicts", "Use port detection"] 
          },
          "ECONNREFUSED": { 
            name: "Connection Refused", 
            description: "Target machine refused connection", 
            solutions: ["Check server status", "Verify port/host", "Check firewall", "Verify network connectivity"] 
          },
          "ENOTFOUND": { 
            name: "Not Found", 
            description: "DNS lookup failed", 
            solutions: ["Check domain name", "Verify DNS settings", "Check internet connection", "Use IP address"] 
          },
          "EMFILE": { 
            name: "Too Many Files", 
            description: "Too many open files", 
            solutions: ["Close file handles", "Increase file limits", "Check for file leaks", "Use proper cleanup"] 
          },
          "EACCES": { 
            name: "Access Denied", 
            description: "Permission denied", 
            solutions: ["Check file permissions", "Run with proper privileges", "Verify ownership", "Use sudo if needed"] 
          }
        }
      },
      react: {
        pattern: /(Warning:|Error:|Failed prop type)/gi,
        codes: {
          "Warning: Each child in a list should have a unique \"key\" prop": {
            name: "Missing Key Prop",
            description: "React needs unique keys for list items",
            solutions: ["Add unique key prop", "Use array index as fallback", "Ensure keys are stable", "Use item ID as key"]
          },
          "Warning: Failed prop type": {
            name: "PropTypes Validation Failed",
            description: "Component received invalid props",
            solutions: ["Check prop types", "Validate component props", "Fix prop values", "Update PropTypes definition"]
          },
          "Error: Objects are not valid as a React child": {
            name: "Invalid React Child",
            description: "Trying to render object directly",
            solutions: ["Convert object to string", "Render object properties", "Use JSON.stringify", "Check component return"]
          }
        }
      }
    };
  }
  
  // Periodic cleanup of old data
  chrome.alarms.create('cleanup', { periodInMinutes: 60 * 24 }); // Daily cleanup
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
      cleanupOldData();
    }
  });
  
  function cleanupOldData() {
    chrome.storage.local.get(['errorLog', 'dailyStats'], (result) => {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      // Clean old error logs
      if (result.errorLog) {
        const recentErrors = result.errorLog.filter(error => 
          new Date(error.timestamp).getTime() > oneWeekAgo
        );
        chrome.storage.local.set({ errorLog: recentErrors });
      }
      
      // Reset daily stats if older than today
      if (result.dailyStats && result.dailyStats.date !== new Date().toDateString()) {
        chrome.storage.local.set({
          dailyStats: {
            date: new Date().toDateString(),
            stats: { errorsDetected: 0, solutionsProvided: 0 }
          }
        });
      }
    });
  }