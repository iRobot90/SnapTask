# SnapTask 📸 Offline-First Task Manager

A modern task management application built with Fleetbo Native Runtime, featuring camera integration, offline-first architecture, and seamless cloud synchronization.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Camera Integration**: Capture photos and attach to tasks
- **💾 Offline Storage**: Local data persistence with automatic cloud sync
- **🔄 Auto-Sync**: Seamless data synchronization when online
- **🎨 Modern UI**: Clean, responsive interface without distracting elements
- **📱 User Profiles**: Personal statistics and account management
- **🧭 Error Handling**: Graceful fallbacks and user-friendly error messages

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 with modern hooks
- **UI Components**: Lucide React icons, custom animations
- **Styling**: Responsive CSS with gradient effects
- **Native Runtime**: Fleetbo OS with cloud compilation
- **Navigation**: React Router with Fleetbo integration
- **Storage**: Fleetbo storage vault + cloud sync
- **Build Tools**: React Scripts, Babel, Webpack
- **AI Assistant**: Fleetbo Alex for code generation

## 📱 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Fleetbo Studio VS Code extension (recommended)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd SnapTask01

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Fleetbo credentials

# Start development server
npm run fleetbo

# Build for production
npm run fleetbo android  # Android
npm run fleetbo ios        # iOS
```

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_FLEETBO_DB_KEY=your_database_key_here
REACT_APP_ENTERPRISE_ID=your_enterprise_id
REACT_KEY_APP=your_app_key
REACT_APP_TESTER_EMAIL=your_email@domain.com
```

## 🏠 Fleetbo Commands

### Development
```bash
npm run fleetbo              # Start development environment
npm run fleetbo alex          # Access Alex AI assistant
```

### Generation
```bash
npm run fleetbo page "PageName"    # Create new React page
npm run fleetbo ios page "ModuleName"  # Generate iOS module
npm run fleetbo android page "ModuleName" # Generate Android module
```

### Deployment
```bash
npm run fleetbo android         # Build and deploy Android app
npm run fleetbo ios             # Build and deploy iOS app
```

## 📁 Project Structure

```
SnapTask01/
├── public/
│   └── native/
│       ├── android/           # Native Android modules (.kt files)
│       └── ios/              # Native iOS modules (.swift files)
├── src/
│   ├── app/               # React components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Profile.jsx       # User profile
│   │   ├── TaskList.jsx      # Task management
│   │   ├── TaskCreate.jsx    # Task creation
│   │   ├── TaskDetail.jsx    # Task details
│   │   ├── TaskUtils.jsx      # Shared utilities
│   │   └── mocks/           # Mock components
│   │       ├── CameraCapture.jsx
│   │       ├── NavigationHelper.jsx
│   │       └── etc.
│   ├── App.js              # Main application routing
│   └── index.js            # Application entry point
├── package.json              # Dependencies and scripts
└── .env                   # Environment configuration
```

## 🔧 Development Guide

### 1. Project Setup
1. Fork or clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Start development server: `npm run fleetbo`

### 2. Using Alex AI Assistant
Access Alex for intelligent code generation:
```bash
npm run fleetbo alex "Create a camera module with photo compression"
```

### 3. Adding New Features
Generate pages and native modules:
```bash
# Create a new page
npm run fleetbo page "TaskAnalytics"

# Generate Android camera module
npm run fleetbo android page "AdvancedCamera"

# Generate iOS navigation module
npm run fleetbo ios page "SwipeNavigation"
```

### 4. Building for Production
```bash
# Android build
npm run fleetbo android

# iOS build
npm run fleetbo ios
```

### 5. Key Development Patterns

#### Camera Integration
```javascript
// Request camera permission
const hasPermission = await Fleetbo.exec('CameraPermission', 'request');

// Capture photo with Alex's PhotoCapture module
const result = await Fleetbo.exec('PhotoCapture', 'capture');

// Save photo to storage
await Fleetbo.storage.save('task_photo', result);
```

#### Offline Data Management
```javascript
// Save to local storage
await Fleetbo.storage.save('snap_tasks', JSON.stringify(tasks));

// Sync with cloud when online
if (isOnline) {
  await Fleetbo.addWithUserId('Tasks', 'UserTasks', taskData);
}
```

#### Navigation System
```javascript
// Consistent back navigation
await Fleetbo.exec('NavigationHelper', 'goBack');

// Page navigation
Fleetbo.openPage('taskdetail');
Fleetbo.openPageId('taskdetail', taskId);
```

## 🎯 Architecture Decisions

### Offline-First Design
- Local storage as primary data source
- Cloud sync as secondary feature
- Graceful degradation when offline
- Progressive enhancement when online

### Component Architecture
- Atomic components with single responsibilities
- Shared utility functions
- Custom hooks for common patterns
- Mock components for browser testing

### State Management
- React hooks for local state
- Fleetbo storage for persistence
- Optimistic updates for better UX

## 🔍 Troubleshooting

### Common Issues

#### 1. Navigation Not Working
**Solution**: Ensure Fleetbo runtime is active
```bash
npm run fleetbo  # Restart development environment
```

#### 2. Camera Permission Denied
**Solution**: Check permission handling in CameraPermission module
```javascript
const hasPermission = await Fleetbo.exec('CameraPermission', 'request');
if (!hasPermission) {
  showError('Permission Denied', 'Camera access is required');
  return;
}
```

#### 3. Build Failures
**Solution**: Check native modules in `public/native/`
```bash
ls public/native/android/  # Verify Android modules
ls public/native/ios/       # Verify iOS modules
```

#### 4. Sync Not Working
**Solution**: Verify internet connectivity and Fleetbo server status
```bash
# Test connectivity
ping 8.8.8.8

# Check Fleetbo status
npm run fleetbo alex "Check sync status"
```

## 🎨 Customization Guide

### Branding
Update colors, fonts, and logos:
- Modify `src/index.css` for global styles
- Update icons in components
- Custom animations and transitions

### Adding New Features
1. Use Fleetbo page generator for boilerplate
2. Use Alex AI for complex functionality
3. Follow existing component patterns
4. Add proper error handling and loading states

### Performance Optimization
- Use React.memo() for expensive components
- Implement virtual scrolling for long lists
- Optimize image loading with lazy loading
- Minimize re-renders with proper key props

## 🧪 Testing Strategy

### Unit Testing
```bash
npm test                    # Run React tests
```

### Integration Testing
1. Test camera functionality on real devices
2. Verify offline/online sync behavior
3. Test navigation flow between all screens
4. Validate error handling scenarios

### E2E Testing
```bash
# Install Play Store testing app
npm install -g @react-native-community/cli

# Build for testing
npm run fleetbo android --variant=testing
```

## 🚀 Deployment

### Preparation Checklist
- [ ] Environment variables configured
- [ ] All features tested on devices
- [ ] Performance optimized
- [ ] Security review completed
- [ ] Documentation updated
- [ ] App store assets prepared

### Release Process
```bash
# Android release build
npm run fleetbo android

# iOS release build  
npm run fleetbo ios

# Version management
npm version patch    # 0.1.1
npm version minor    # 0.2.0
npm version major    # 1.0.0

# Create release tag
git tag -a v1.0.0 -m "First stable release"
```

### Store Deployment
1. **Google Play Store**: Upload APK via Google Play Console
2. **Apple App Store**: Upload IPA via App Store Connect
3. **Fleetbo Cloud**: Automatic deployment available

## 📚 API Reference

### Fleetbo Storage
```javascript
// Save data to local storage
await Fleetbo.storage.save('key', data);

// Read data from local storage  
const data = await Fleetbo.storage.read('key');

// Clear all data
await Fleetbo.storage.wipe();
```

### Fleetbo Navigation
```javascript
// Navigate to page
Fleetbo.openPage('pageName');

// Navigate with data
Fleetbo.openPageId('pageName', 'dataId');

// Go back
Fleetbo.exec('NavigationHelper', 'goBack');

// Go to home
Fleetbo.toHome();

// Set navigation bar
Fleetbo.setNavbarVisible(true/false);
```

### Fleetbo Database Operations
```javascript
// Add document with auto ID
await Fleetbo.addWithUserId('db', 'table', data);

// Add document with custom ID
await Fleetbo.addWithId('db', 'table', data, 'customId');

// Get documents (public)
await Fleetbo.getDocsG('db', 'table');

// Get documents (user-specific)
await Fleetbo.getDocsU('db', 'table');

// Get single document
await Fleetbo.getDoc('db', 'table', 'documentId');

// Update document
await Fleetbo.addWithId('db', 'table', updatedData, 'documentId');

// Delete document
await Fleetbo.delete('db', 'table', 'documentId');

// Atomic increment
await Fleetbo.incrementFieldValue('db', 'table', 'docId', 'fieldName', 1);
```

### Fleetbo Camera Operations
```javascript
// Request camera permission
const permission = await Fleetbo.exec('CameraPermission', 'request');

// Capture photo
const result = await Fleetbo.exec('PhotoCapture', 'capture');

// Access photo gallery
const photos = await Fleetbo.exec('Camera', 'getGallery');
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and commit regularly
4. Create pull requests for review
5. Update documentation with new features

### Code Standards
- Use ES6+ JavaScript features
- Follow React best practices
- Implement proper error boundaries
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Commit Message Format
```
type(scope): brief description

feat(camera): Add photo compression support
fix(navigation): Resolve back button issues  
docs(readme): Update installation guide
```

## 📞 Support

### Getting Help
1. **Documentation**: Check this README and project docs
2. **Issues**: Report bugs via GitHub Issues
3. **Community**: Join our Discord community
4. **Enterprise**: Contact support@fleetbo.io for enterprise support

---

**Built with ❤️ using Fleetbo Native Runtime**