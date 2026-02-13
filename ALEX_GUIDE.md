# Alex AI Prompts and Insights

## 🤖 Understanding Alex's Capabilities and Limitations

Alex is Fleetbo's AI assistant designed for rapid development, but has specific patterns, strengths, and limitations. Understanding these will help you get the best results.

## 🧠 Core Capabilities

### What Alex Does Well
✅ **React Component Generation** - Boilerplate pages with routing
✅ **Native Module Templates** - Android/iOS boilerplates
✅ **Basic Functionality** - CRUD operations, navigation
✅ **Error Handling** - Basic try-catch patterns
✅ **UI Components** - Bootstrap-styled components

### What Alex Struggles With
❌ **Complex Logic** - Multi-step business logic
❌ **Advanced State Management** - Redux, Context API patterns
❌ **Custom Animations** - Complex CSS animations
❌ **Large File Operations** - Processing large files
❌ **Database Schema Design** - Complex relationships
❌ **Third-party Integration** - APIs beyond Fleetbo ecosystem
❌ **Performance Optimization** - Advanced caching strategies

## 🎯 Optimal Prompt Patterns

### 1. Simple, Specific Requests
**Good Examples:**
```
npm run fleetbo alex "Create a camera page with photo preview and delete functionality"
npm run fleetbo alex "Generate a task list with search and filter capabilities"
npm run fleetbo alex "Create a user profile with avatar and statistics"
```

**Why They Work:**
- Clear, single responsibility
- Limited scope (one feature at a time)
- Concrete, tangible output

### 2. Use Fleetbo Context
**Good Examples:**
```
npm run fleetbo alex "Create a camera module using Fleetbo PhotoCapture with auto-focus and flash support"
npm run fleetbo alex "Add navigation helper that integrates with Fleetbo's existing routing system"
```

### 3. Follow Existing Patterns
**Good Examples:**
```
npm run fleetbo alex "Generate a page similar to TaskList with modern card design"
npm run fleetbo alex "Create a module like NavigationHelper but for swipe gestures"
```

## 🔍 Common Alex Limitations

### Output Format
- **Max 300 characters** per request
- **Single feature focus** - Don't ask for multiple things at once
- **Context preserved** across multiple requests in same session

### Technical Constraints
- **No file system access** - Can't read/write arbitrary files
- **Limited external APIs** - Only Fleetbo ecosystem services
- **Basic state management** - No complex state solutions
- **Template-based** - Uses standard React patterns

## 🚨 Known Alex Flaws

### 1. Generic Code Generation
**Issue**: Alex may generate generic, over-engineered solutions
**Impact**: Inefficient, hard to maintain code
**Mitigation**: Be more specific about exact requirements

### 2. Inconsistent Documentation
**Issue**: Generated code may lack proper comments or documentation
**Impact**: Difficult for other developers to understand
**Mitigation**: Review and add JSDoc comments to generated code

### 3. Over-Abstracted Solutions
**Issue**: Creates unnecessary complexity for simple problems
**Impact**: Performance degradation, harder debugging
**Mitigation**: Request simpler, more direct solutions

### 4. Hardcoded Values
**Issue**: May use hardcoded values instead of dynamic configuration
**Impact**: Poor flexibility, deployment issues
**Mitigation**: Ask for configurable parameters

## 📋 Alex by Feature Category

### 📸 Camera Integration
**Strengths**: Permission handling, photo capture, gallery access
**Limitations**: Complex image processing, multiple file formats
**Best Prompts**: 
```
"Create camera module with permission handling for Android 10+ including runtime permissions and storage access"
"Generate photo capture component with automatic image compression and thumbnail generation"
```

### 🧭 Navigation System
**Strengths**: Page routing, back navigation, deep linking
**Limitations**: Complex gestures, advanced animations
**Best Prompts**:
```
"Create navigation helper with swipe gesture support and haptic feedback"
"Generate bottom tab navigation system with customizable icons and labels"
```

### 💾 Data Management
**Strengths**: Local storage, cloud sync, CRUD operations
**Limitations**: Complex queries, large datasets, real-time updates
**Best Prompts**:
```
"Create offline-first data management system with automatic conflict resolution"
"Generate data synchronization module with queue management and retry logic"
```

### 🎨 UI Components
**Strengths**: Modern layouts, responsive design
**Limitations**: Complex animations, custom themes
**Best Prompts**:
```
"Create responsive card component with hover effects and loading states"
"Generate modal component with backdrop blur and accessibility features"
```

## 🔧 Debugging Alex-Generated Code

### 1. Review Before Implementation
```bash
# Always review Alex-generated code before committing
# Check for:
# - Security vulnerabilities
# - Performance issues
# - Best practices violations
# - Missing error handling
```

### 2. Start Simple, Add Complexity
```javascript
// Don't ask Alex for everything at once
// Start with basic functionality, then add features incrementally

// BAD: "Create a complete task management system"
// GOOD: "Create a basic task list with add/delete"
```

### 3. Test Extensively
```bash
# Test Alex-generated code in multiple scenarios
npm test              # Unit tests
npm run fleetbo         # Integration tests
```

### 4. Use Version Control
```bash
# Track Alex-generated code changes
git add .
git commit -m "feat: Add camera module via Alex"
```

## 🎯 Getting Best Results

### Before Prompting Alex
1. **Have clear requirements** - Know exactly what you want
2. **Check existing code** - Review similar patterns in your codebase
3. **Consider constraints** - File size, complexity, time limits
4. **Plan for iteration** - Start with MVP, add features later

### During Development
1. **Iterate frequently** - Small, focused prompts work better
2. **Test each change** - Verify functionality before moving on
3. **Keep sessions short** - Alex context improves with focused interactions
4. **Document decisions** - Note why you chose certain approaches

### Example Workflow
```bash
# Week 1: Basic structure
npm run fleetbo alex "Create basic task list with local storage"

# Week 2: Add camera
npm run fleetbo alex "Add camera module with photo capture and storage"

# Week 3: Refine UI
npm run fleetbo alex "Improve task list UI with modern design and animations"
```

## ⚠️ When to Override Alex

### Manual Implementation Required
For complex features beyond Alex's capabilities:
1. **Design architecture yourself** - Plan components, state flow
2. **Write custom code** - Implement directly in JavaScript/TypeScript
3. **Integrate with Fleetbo** - Use Fleetbo APIs for native features
4. **Test thoroughly** - Comprehensive testing essential

### Examples of Custom Implementation
```javascript
// Custom camera integration
class CustomCamera {
  async capture() {
    // Use native camera APIs directly
    // Integrate with Fleetbo PhotoCapture when needed
  }
}

// Custom data sync
class CustomSync {
  async sync() {
    // Implement sophisticated sync logic
    // Handle conflicts, retries, offline queue
  }
}
```

---

## 📚 Continuous Improvement

### Learning from Alex
1. **Study generated patterns** - Understand common solutions
2. **Adapt best practices** - Apply Alex patterns to your own code
3. **Extend functionality** - Build on Alex's foundation
4. **Share insights** - Document discoveries for team

### Contributing to Alex
1. **Report issues** - Help improve Alex's capabilities
2. **Request features** - Suggest improvements to Fleetbo team
3. **Share patterns** - Upload successful workflows to community

---

**Master Alex as a development accelerator, not a replacement for engineering judgment.** 🚀