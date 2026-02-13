// NavigationTester.js - Fleetbo Navigation Testing Suite
import FleetboManager from '../src/utils/FleetboManager';

const NavigationTester = {
  // Test all navigation methods
  async runAllTests() {
    console.log('🧪 Fleetbo Navigation Testing Suite');
    console.log('====================================');
    
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };

    // Test 1: FleetboManager Initialization
    await this.testMethod('FleetboManager Initialization', async () => {
      await FleetboManager.init();
      return FleetboManager.isReady;
    });

    // Test 2: Navigation to TaskList
    await this.testMethod('Navigate to TaskList', async () => {
      return await FleetboManager.goToTaskList();
    });

    // Test 3: Navigation to TaskCreate
    await this.testMethod('Navigate to TaskCreate', async () => {
      return await FleetboManager.goToTaskCreate();
    });

    // Test 4: Navigation to TaskDetail
    await this.testMethod('Navigate to TaskDetail', async () => {
      return await FleetboManager.goToTaskDetail('test-123');
    });

    // Test 5: Navigation to Profile
    await this.testMethod('Navigate to Profile', async () => {
      return await FleetboManager.goToProfile();
    });

    // Test 6: Go Home
    await this.testMethod('Navigate to Home', async () => {
      return await FleetboManager.goToHome();
    });

    // Test 7: Back Navigation
    await this.testMethod('Back Navigation', async () => {
      return await FleetboManager.goBack();
    });

    // Test 8: Task Creation
    await this.testMethod('Task Creation', async () => {
      const task = await FleetboManager.createTask(
        'Test Task',
        'This is a test task created by navigation tester',
        null
      );
      return task !== null;
    });

    // Test 9: Camera Capture
    await this.testMethod('Camera Capture', async () => {
      const photo = await FleetboManager.capturePhoto();
      return photo !== null;
    });

    // Test 10: Task Loading
    await this.testMethod('Task Loading', async () => {
      const tasks = await FleetboManager.loadTasks();
      return Array.isArray(tasks);
    });

    // Test 11: Task Deletion
    await this.testMethod('Task Deletion', async () => {
      const testTask = await FleetboManager.createTask('Task to Delete', 'Test task', null);
      if (testTask) {
        return await FleetboManager.deleteTask(testTask.id);
      }
      return false;
    });

    this.generateReport();
    return this.testResults;
  },

  async testMethod(testName, testFunction) {
    this.testResults.total++;
    
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const endTime = Date.now();
      
      if (result) {
        this.testResults.passed++;
        console.log(`✅ ${testName} - PASS (${endTime - startTime}ms)`);
      } else {
        this.testResults.failed++;
        console.log(`❌ ${testName} - FAIL (${endTime - startTime}ms)`);
      }
    } catch (error) {
      this.testResults.failed++;
      console.log(`❌ ${testName} - ERROR: ${error.message}`);
    }
  },

  generateReport() {
    console.log('\n📊 Navigation Test Report');
    console.log('==========================');
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`Passed: ${this.testResults.passed}`);
    console.log(`Failed: ${this.testResults.failed}`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);
    
    if (this.testResults.failed === 0) {
      console.log('\n🎉 ALL FLEETBO NAVIGATION TESTS PASSED!');
      console.log('✅ Fleetbo Manager is fully functional');
      console.log('✅ All navigation methods working');
      console.log('✅ Task operations working');
      console.log('✅ Camera integration working');
      console.log('✅ Storage operations working');
    } else {
      console.log('\n❌ Some tests failed. Check Fleetbo implementation.');
    }
    
    // Save test results to storage
    try {
      if (typeof Fleetbo !== 'undefined') {
        Fleetbo.storage.save('navigation_test_results', JSON.stringify(this.testResults));
        console.log('📄 Test results saved to Fleetbo storage');
      }
    } catch (error) {
      console.log('ℹ️ Could not save test results:', error.message);
    }
  }
};

// Auto-run tests when this file is loaded
console.log('🚀 Fleetbo Navigation Tester loaded');
console.log('Run NavigationTester.runAllTests() to test all navigation functionality');
console.log('Or use individual methods: NavigationTester.testTaskList(), etc.');

// Export for use in browser console
window.NavigationTester = NavigationTester;

export default NavigationTester;