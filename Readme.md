# Error Code Translator - Browser Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285f4?logo=google-chrome)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/iheeb1/error-code-translator)

Automatically detects error codes on any webpage, provides instant explanations, and offers quick access to solutions. Built for developers who want to debug efficiently.

## Features

- **Automatic Detection**: Real-time scanning and highlighting of error codes
- **Comprehensive Support**: HTTP, JavaScript, Node.js, React errors and more
- **Interactive Solutions**: Hover tooltips with Stack Overflow integration
- **Console Monitoring**: Real-time error notifications from browser console
- **Productivity Tools**: Daily stats, toggle controls, context menu integration

## Installation

### Chrome Web Store
*Extension currently under review*

### Developer Mode
1. Clone or download this repository
2. Download icons: [16px](https://img.icons8.com/fluency-systems-regular/16/error--v1.png), [48px](https://img.icons8.com/fluency-systems-regular/48/error--v1.png), [128px](https://img.icons8.com/fluency-systems-regular/128/error--v1.png)
3. Open Chrome → `chrome://extensions/` → Enable Developer mode
4. Click "Load unpacked" and select the extension folder

## Usage

- **Automatic**: Browse any webpage - errors are highlighted automatically
- **Manual**: Select text → Right-click → "Analyze Error Code"
- **Console**: Monitor real-time errors with floating notifications
- **Controls**: Click extension icon for stats and settings

## Supported Errors

### HTTP Status Codes
400, 401, 403, 404, 422, 429, 500, 502, 503, 504

### JavaScript Errors
TypeError, ReferenceError, SyntaxError, RangeError, URIError, EvalError

### Node.js Errors
ENOENT, EADDRINUSE, ECONNREFUSED, ENOTFOUND, EMFILE, EACCES

### Framework Warnings
React prop validation, missing keys, component errors

## Technical Details

- **Manifest V3** compatible
- **No external API calls** - fully local processing
- **Minimal permissions** - only necessary access
- **Performance optimized** - debounced scanning
- **Open source** - fully auditable

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/name`)
5. Create Pull Request

### Adding Error Types
Update `ERROR_PATTERNS` in `content.js`:
```javascript
newErrorType: {
  pattern: /your-pattern/gi,
  codes: {
    "ErrorCode": { 
      name: "Error Name", 
      description: "Error description",
      solutions: ["Solution 1", "Solution 2"]
    }
  }
}
```

## Roadmap

- **v1.1**: Firefox support, Python/Java errors
- **v1.2**: Custom patterns, team features  
- **v2.0**: AI explanations, code fix suggestions

## License

MIT License - see LICENSE file for details.

## Support

- [GitHub Issues](https://github.com/iheeb1/error-code-translator/issues)
- Email: ihebbenromdhane2@gmail.com

---

**Star this repo if it helps your debugging workflow**

[Report Bug](https://github.com/iheeb1/error-code-translator/issues) • [Request Feature](https://github.com/iheeb1/error-code-translator/issues) • [Contribute](https://github.com/iheeb1/error-code-translator/pulls)