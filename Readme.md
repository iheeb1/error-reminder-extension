# 🔍 Error Code Translator - Browser Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285f4?logo=google-chrome)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/error-code-translator)

A powerful browser extension that automatically detects error codes on any webpage, provides instant explanations, and offers quick access to solutions. Perfect for developers who want to debug faster and learn from errors efficiently.

## 🚀 Features

### ⚡ **Automatic Error Detection**
- **Real-time scanning** of webpages for error codes
- **Smart highlighting** with visual indicators
- **Pattern recognition** for multiple error types
- **Dynamic content monitoring** for SPAs

### 🎯 **Comprehensive Error Support**
- **HTTP Status Codes**: 400, 401, 403, 404, 500, 502, 503, etc.
- **JavaScript Errors**: TypeError, ReferenceError, SyntaxError, etc.
- **Node.js Errors**: ENOENT, EADDRINUSE, ECONNREFUSED, etc.
- **React/Framework Warnings**: Missing keys, prop validation, etc.

### 💡 **Interactive Solutions**
- **Hover tooltips** with instant explanations
- **One-click Stack Overflow search** with context
- **Documentation links** for quick reference
- **Copy error information** to clipboard

### 📊 **Developer Productivity**
- **Console error monitoring** with notifications
- **Daily statistics** tracking
- **Extension toggle** for individual tabs
- **Context menu integration**

## 📸 Screenshots

| Feature | Preview |
|---------|---------|
| **Error Highlighting** | *Automatic detection and highlighting of error codes* |
| **Interactive Tooltips** | *Hover explanations with solution links* |
| **Console Monitoring** | *Real-time error notifications* |
| **Extension Popup** | *Statistics and controls* |

## 🛠️ Installation

### **Method 1: Chrome Web Store** (Recommended)
*Coming soon - extension under review*

### **Method 2: Developer Mode** (Current)

1. **Download** or clone this repository
   ```bash
   git clone https://github.com/yourusername/error-code-translator.git
   cd error-code-translator
   ```

2. **Download icons** and place them in the extension folder:
   - [icon16.png](https://img.icons8.com/fluency-systems-regular/16/error--v1.png)
   - [icon48.png](https://img.icons8.com/fluency-systems-regular/48/error--v1.png)
   - [icon128.png](https://img.icons8.com/fluency-systems-regular/128/error--v1.png)

3. **Open Chrome** and navigate to `chrome://extensions/`

4. **Enable Developer mode** (toggle in top-right corner)

5. **Click "Load unpacked"** and select the extension folder

6. **Pin the extension** to your toolbar for easy access

## 🎮 Usage

### **Automatic Detection**
- Simply browse any webpage
- Error codes are automatically highlighted in red
- Hover over highlighted errors for instant explanations

### **Manual Analysis**
- Select any text containing error codes
- Right-click and choose "Analyze Error Code"
- Get instant explanations and solutions

### **Console Monitoring**
- Errors from browser console are automatically detected
- Floating notifications appear for new errors
- Click notifications for detailed explanations

### **Extension Controls**
- Click the extension icon to open the control panel
- Toggle error detection on/off per tab
- View daily statistics and test functionality
- Clear extension data when needed

## 🏗️ Project Structure

```
error-code-translator/
├── manifest.json          # Extension configuration
├── content.js             # Main error detection logic
├── background.js          # Service worker & context menus
├── popup.html            # Extension popup interface
├── styles.css            # UI styling and animations
├── icons/
│   ├── icon16.png        # 16x16 extension icon
│   ├── icon48.png        # 48x48 extension icon
│   └── icon128.png       # 128x128 extension icon
└── README.md             # This file
```

## 🔧 Technical Details

### **Technologies Used**
- **Manifest V3** - Latest Chrome extension standard
- **Content Scripts** - For webpage interaction
- **Service Worker** - Background processing
- **Chrome APIs** - Storage, notifications, context menus
- **Modern CSS** - Animations and responsive design

### **Performance Features**
- **Debounced scanning** to avoid performance issues
- **Efficient text node traversal** with TreeWalker
- **Memory management** with automatic cleanup
- **Smart caching** of error patterns

### **Security & Privacy**
- **No external API calls** - all processing is local
- **Minimal permissions** - only what's necessary
- **No data collection** - your data stays private
- **Open source** - fully auditable code

## 📚 Supported Error Types

<details>
<summary><b>HTTP Status Codes</b></summary>

| Code | Name | Description |
|------|------|-------------|
| 400 | Bad Request | Server cannot process request due to client error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Server refuses to authorize |
| 404 | Not Found | Requested resource not found |
| 422 | Unprocessable Entity | Request contains semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Generic server error |
| 502 | Bad Gateway | Invalid response from upstream |
| 503 | Service Unavailable | Server temporarily unavailable |
| 504 | Gateway Timeout | Upstream server timeout |

</details>

<details>
<summary><b>JavaScript Errors</b></summary>

| Error | Description | Common Causes |
|-------|-------------|---------------|
| TypeError | Wrong data type operation | null/undefined access, wrong method calls |
| ReferenceError | Variable not defined | Typos, scope issues, missing imports |
| SyntaxError | Invalid syntax | Missing brackets, semicolons, typos |
| RangeError | Number out of range | Array bounds, recursion depth |
| URIError | Invalid URI | Malformed URLs, encoding issues |
| EvalError | Error in eval() | Avoid using eval() |

</details>

<details>
<summary><b>Node.js Errors</b></summary>

| Error | Description | Solutions |
|-------|-------------|-----------|
| ENOENT | File/directory not found | Check paths, create missing files |
| EADDRINUSE | Port already in use | Use different port, kill process |
| ECONNREFUSED | Connection refused | Check server status, firewall |
| ENOTFOUND | DNS lookup failed | Check domain, internet connection |
| EMFILE | Too many open files | Close handles, increase limits |
| EACCES | Permission denied | Check permissions, use sudo |

</details>

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Bug Reports**
- Use the [issue tracker](https://github.com/yourusername/error-code-translator/issues)
- Include browser version and error details
- Provide steps to reproduce

### **Feature Requests**
- Check existing [issues](https://github.com/yourusername/error-code-translator/issues) first
- Describe the feature and use case
- Consider implementation complexity

### **Development**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Adding Error Types**
To add support for new error patterns:

1. **Update** `ERROR_PATTERNS` in `content.js`
2. **Add** corresponding entries in `background.js`
3. **Test** with sample error codes
4. **Update** documentation

Example:
```javascript
python: {
  pattern: /(IndentationError|SyntaxError|NameError)/gi,
  codes: {
    "IndentationError": { 
      name: "Indentation Error", 
      description: "Incorrect indentation in Python code",
      solutions: ["Check indentation", "Use consistent tabs/spaces", "Fix nested blocks"]
    }
  }
}
```

## 🐛 Known Issues

- **Large pages**: May have slight delay on pages with extensive text
- **Dynamic content**: Some dynamically loaded content may need manual refresh
- **Firefox**: Currently Chrome/Edge only (Firefox version planned)

## 🗺️ Roadmap

### **Version 1.1**
- [ ] Firefox compatibility
- [ ] More error pattern support (Python, Java, C++)
- [ ] Custom error pattern editor
- [ ] Export error reports

### **Version 1.2**
- [ ] Team sharing features
- [ ] Error pattern suggestions
- [ ] Integration with popular dev tools
- [ ] Offline documentation

### **Version 2.0**
- [ ] AI-powered error explanations
- [ ] Code fix suggestions
- [ ] Learning mode with tutorials
- [ ] Developer analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons8** for providing the extension icons
- **Stack Overflow** for being an amazing resource
- **Chrome Extensions community** for documentation and examples
- **All contributors** who help improve this extension

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/error-code-translator/issues)
- **Email**: your.email@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

<div align="center">

**⭐ If this extension helped you debug faster, please give it a star! ⭐**

[Report Bug](https://github.com/yourusername/error-code-translator/issues) • [Request Feature](https://github.com/yourusername/error-code-translator/issues) • [Contribute](https://github.com/yourusername/error-code-translator/pulls)

</div>