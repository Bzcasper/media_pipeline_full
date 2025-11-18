// Quick test for media server SDK
import { mediaServer } from './src/tools/mediaServer';

async function testMediaServer() {
  console.log('Testing Media Server SDK...\n');

  // Test 1: Generate image from HTML
  console.log('1. Testing HTML render + upload...');
  try {
    const result = await mediaServer.generateImage(
      '<html><body style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:48px;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif">Test Album</body></html>',
      512,
      512
    );
    console.log('   ✓ Image generated:', result.imageFileId);
    console.log('   URL:', result.imageUrl);
  } catch (err: any) {
    console.log('   ✗ Error:', err.message);
  }

  // Test 2: Upload file
  console.log('\n2. Testing file upload...');
  try {
    const testData = Buffer.from('Hello World');
    const result = await mediaServer.uploadFile(testData, 'tmp');
    console.log('   ✓ File uploaded:', result.file_id);
  } catch (err: any) {
    console.log('   ✗ Error:', err.message);
  }

  // Test 3: Download file
  console.log('\n3. Testing file download...');
  try {
    const response = await mediaServer.downloadFile('tmp_3c64b368-970c-45ee-a8b7-db7a4284d4e0.txt');
    const text = await response.text();
    console.log('   ✓ File downloaded, content:', text.substring(0, 50));
  } catch (err: any) {
    console.log('   ✗ Error:', err.message);
  }

  console.log('\n✅ Media Server SDK tests complete!');
}

testMediaServer().catch(console.error);
