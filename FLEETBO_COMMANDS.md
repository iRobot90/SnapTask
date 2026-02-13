# Fleetbo Commands Cheat Sheet

Quick reference for common Fleetbo development commands and patterns.

## 🚀 Development Commands

### Environment Management
```bash
npm run fleetbo              # Start development with Fleetbo runtime
npm run fleetbo alex          # Access Alex AI assistant
npm run fleetbo dev           # Alternative dev command
```

### Page Generation
```bash
npm run fleetbo page "Name"      # Generate new React page
```

### Native Module Generation
```bash
npm run fleetbo android page "Module"  # Generate Android Kotlin module
npm run fleetbo ios page "Module"     # Generate iOS Swift module
```

### Deployment
```bash
npm run fleetbo android           # Build and deploy Android
npm run fleetbo ios              # Build and deploy iOS
npm run fleetbo build            # Build for production only
```

## 📝 Common Tasks

### Setting Up New Feature
```bash
# 1. Generate a new page
npm run fleetbo page "FeatureName"

# 2. Generate related native module if needed
npm run fleetbo alex "Create native module for FeatureName"

# 3. Add navigation in App.js (auto-injected)
```

### Debugging Common Issues

#### Navigation Not Working
```bash
# Check if Fleetbo runtime is active
npm run fleetbo alex "Check system status"

# Restart development environment
npm run fleetbo
```

#### Camera/Permission Issues
```bash
# Test camera permission module
npm run fleetbo alex "Test camera permission system"

# Check permission state
Fleetbo.exec('CameraPermission', 'check');
```

#### Sync Issues
```bash
# Test connectivity
npm run fleetbo alex "Test sync and offline functionality"

# Check storage status
await Fleetbo.storage.read('snap_tasks');
```

#### Build Failures
```bash
# Verify native modules exist
ls public/native/android/
ls public/native/ios/

# Clean build cache
rm -rf build/
npm run build
```

## 🔧 Code Patterns

### Error Handling
```javascript
const showError = (title, message) => {
  const toast = document.createElement('div');
  toast.className = 'fixed-top alert alert-warning alert-dismissible fade show m-3 mx-3';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    <div class="d-flex align-items-center">
      <div class="spinner-border spinner-border-sm me-3"></div>
      <div>
        <strong>${title}</strong><br>
        <small>${message}</small>
      </div>
      <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;
  
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};
```

### Navigation
```javascript
// Back navigation
await Fleetbo.exec('NavigationHelper', 'goBack');

// Page navigation
Fleetbo.openPage('tasklist');
Fleetbo.openPageId('taskdetail', taskId);

// Home navigation
Fleetbo.toHome();
```

### Storage Operations
```javascript
// Save to local storage
await Fleetbo.storage.save('key', JSON.stringify(data));

// Read from local storage
const data = await Fleetbo.storage.read('key');

// Atomic operations
await Fleetbo.incrementFieldValue('db', 'table', 'docId', 'count', 1);
```

### Camera Integration
```javascript
// Request permission
const hasPermission = await Fleetbo.exec('CameraPermission', 'request');

// Capture photo
const result = await Fleetbo.exec('PhotoCapture', 'capture');

// Save photo
await Fleetbo.storage.save('photo_' + Date.now(), result);
```

## 🎨 Alex AI Prompts

### Camera Integration
```
Create camera module with auto-focus and flash support
Generate photo capture with compression and EXIF data
Add camera permission handling for Android 10+
```

### Navigation Enhancement
```
Create swipe navigation module with gesture support
Generate back navigation with haptic feedback
Add bottom navigation bar with tabs
```

### Data Management
```
Create offline-first database with automatic sync
Implement data validation and conflict resolution
Add data export/import functionality
Create backup and restore system
```

### UI Enhancement
```
Generate modern loading animations and transitions
Create responsive design system
Add dark mode support
Implement accessibility features
Generate custom animations and micro-interactions
```

## 🔍 Debugging Tips

### Console Debugging
```javascript
// Enable Fleetbo debug mode
Fleetbo.setDebugMode(true);

// Log navigation events
Fleetbo.on('NAVIGATION', (data) => console.log('Navigation:', data));

// Monitor storage operations
Fleetbo.on('STORAGE_OPERATION', (data) => console.log('Storage:', data));
```

### Performance Monitoring
```javascript
// Monitor app performance
Fleetbo.exec('Performance', 'getCurrentMetrics');

// Track memory usage
Fleetbo.exec('Performance', 'getMemoryUsage');
```

## 📱 Environment Variables

### Required Variables
```env
REACT_APP_FLEETBO_DB_KEY=your_fleetbo_db_key
REACT_APP_ENTERPRISE_ID=your_enterprise_id  
REACT_KEY_APP=your_app_name
REACT_APP_TESTER_EMAIL=your_test_email
```

### Optional Variables
```env
DANGEROUSLY_DISABLE_HOST_CHECK=true    # Skip host validation
GENERATE_SOURCEMAP=false               # Exclude source maps
FAST_REFRESH=false                      # Disable fast refresh
```

## 🚀 Deployment Commands

### Android
```bash
# Production build
npm run fleetbo android

# Testing build
npm run fleetbo android --env=testing

# Version bump
npm version patch
npm run fleetbo android --tag=v1.0.1
```

### iOS
```bash
# Production build
npm run fleetbo ios

# Testing build
npm run fleetbo ios --env=testing

# Version bump
npm version minor
npm run fleetbo ios --tag=v1.0.1
```

## 🔧 Configuration Files

### .env Structure
```bash
# Core Fleetbo configuration
REACT_APP_FLEETBO_DB_KEY=73b63583c1a80eedff7974f288f7c577440606898eaa6a9219d69a6f84b135cb30d87e1b218c53e0c55a9aea59ac70d969f5ae10e507
REACT_APP_ENTERPRISE_ID=WfO7GR3OyIGHkwd8Z3sv
REACT_KEY_APP=SnapTask01
REACT_APP_TESTER_EMAIL=amiandajesse27@gmail.com

# Development settings
DANGEROUSLY_DISABLE_HOST_CHECK=true
WDS_SOCKET_PORT=3000
GENERATE_SOURCEMAP=false
FAST_REFRESH=false
INLINE_RUNTIME_CHUNK=false
```

## 🎯 Best Practices

### Code Organization
- Keep components small and focused
- Use custom hooks for shared logic
- Implement proper error boundaries
- Follow consistent naming conventions
- Add JSDoc for complex functions

### Performance Optimization
- Use React.memo() for expensive renders
- Implement virtual scrolling for long lists
- Optimize image loading with lazy loading
- Use Fleetbo storage for caching frequently accessed data

### Security Considerations
- Validate all user inputs
- Sanitize data before storage
- Use Fleetbo's built-in security features
- Never log sensitive information
- Implement proper authentication flows

### Testing Strategy
- Test offline functionality extensively
- Verify camera permissions on different Android versions
- Test sync behavior under various network conditions
- Use Fleetbo mock components for browser testing

---

**📝 Keep this reference handy during development!**