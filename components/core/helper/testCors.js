// corsTestModule.js
async function testCORS(url) {
    // Helper function to test a fetch call
    async function testFetch(url, options) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return { success: true, status: response.status };
        } else {
          return { success: false, status: response.status, error: 'Response not OK' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  
    // Test GET request
    const getResult = await testFetch(url, { method: 'GET' });
  
    // Test POST request
    const postResult = await testFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });
  
    return { getResult, postResult };
  }
  
  export { testCORS };
  