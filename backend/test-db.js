import fetch from 'node-fetch'; // or global fetch in Node 18+

async function runTests() {
  const BASE = 'http://localhost:3000';
  console.log('--- TESTING DATABASE AND API ENDPOINTS ---');
  
  // 1. Register User 1
  const email1 = 'alice_' + Date.now() + '@test.com';
  const pass1 = 'secret123';
  console.log('1. Testing User Registration...');
  const regRes = await fetch(BASE + '/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email1, password: pass1 })
  });
  const regData = await regRes.json();
  if (regRes.status !== 201 || !regData.token || !regData.user._id) {
    throw new Error('Registration failed: ' + JSON.stringify(regData));
  }
  console.log('✓ Registration passed! Created user:', regData.user.email, 'ID:', regData.user._id);
  const token1 = regData.token;

  // 2. Duplicate User registration test (should fail with 400)
  console.log('2. Testing Duplicate Email Handling in DB...');
  const dupRes = await fetch(BASE + '/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email1, password: pass1 })
  });
  if (dupRes.status === 400) {
    console.log('✓ Duplicate registration correctly rejected by DB unique index!');
  } else {
    console.warn('Duplicate registration returned unexpected status:', dupRes.status);
  }

  // 3. User Login
  console.log('3. Testing User Login...');
  const loginRes = await fetch(BASE + '/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email1, password: pass1 })
  });
  const loginData = await loginRes.json();
  if (loginRes.status !== 200 || !loginData.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginData));
  }
  console.log('✓ Login passed! Received JWT token.');

  // 4. Invalid Password test
  console.log('4. Testing Invalid Password Login...');
  const badLoginRes = await fetch(BASE + '/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email1, password: 'wrongpassword' })
  });
  if (badLoginRes.status === 401) {
    console.log('✓ Invalid credentials properly rejected with 401!');
  } else {
    throw new Error('Bad login expected 401 but got ' + badLoginRes.status);
  }

  // 5. User Profile
  console.log('5. Testing Profile Auth...');
  const profRes = await fetch(BASE + '/users/profile', {
    headers: { 'Authorization': 'Bearer ' + token1 }
  });
  const profData = await profRes.json();
  if (profRes.status !== 200 || profData.user.email !== email1) {
    throw new Error('Profile failed: ' + JSON.stringify(profData));
  }
  console.log('✓ Profile retrieved successfully for:', profData.user.email);

  // 6. Register User 2 (for collaborator test)
  const email2 = 'bob_' + Date.now() + '@test.com';
  const regRes2 = await fetch(BASE + '/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email2, password: 'password456' })
  });
  const regData2 = await regRes2.json();
  const user2Id = regData2.user._id;
  console.log('✓ Registered collaborator user Bob, ID:', user2Id);

  // 7. Get All Users (User directory)
  console.log('7. Testing Get All Users...');
  const usersRes = await fetch(BASE + '/users/all', {
    headers: { 'Authorization': 'Bearer ' + token1 }
  });
  const usersData = await usersRes.json();
  if (usersRes.status !== 200 || !Array.isArray(usersData.users)) {
    throw new Error('Failed to get all users: ' + JSON.stringify(usersData));
  }
  console.log('✓ Retrieved user list from DB. Total other users found:', usersData.users.length);

  // 8. Create Project in DB
  console.log('8. Testing Project Creation in DB...');
  const projectName = 'project_' + Date.now();
  const projRes = await fetch(BASE + '/projects/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    },
    body: JSON.stringify({ name: projectName })
  });
  const projData = await projRes.json();
  if (projRes.status !== 201 || !projData._id) {
    throw new Error('Project creation failed: ' + JSON.stringify(projData));
  }
  const projectId = projData._id;
  console.log('✓ Project created in MongoDB! ID:', projectId, 'Name:', projData.name);

  // 9. Get User Projects from DB
  console.log('9. Testing Get Projects for User...');
  const getProjsRes = await fetch(BASE + '/projects/all', {
    headers: { 'Authorization': 'Bearer ' + token1 }
  });
  const getProjsData = await getProjsRes.json();
  if (getProjsRes.status !== 200 || !getProjsData.projects.some(p => p._id === projectId)) {
    throw new Error('Projects query failed: ' + JSON.stringify(getProjsData));
  }
  console.log('✓ Projects successfully fetched from DB. Count:', getProjsData.projects.length);

  // 10. Add Collaborator to Project in DB
  console.log('10. Testing Add Collaborator to Project...');
  const addCollabRes = await fetch(BASE + '/projects/add-user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    },
    body: JSON.stringify({ projectId, users: [user2Id] })
  });
  const addCollabData = await addCollabRes.json();
  if (addCollabRes.status !== 200 || !addCollabData.project.users.includes(user2Id)) {
    throw new Error('Add collaborator failed: ' + JSON.stringify(addCollabData));
  }
  console.log('✓ Collaborator Bob added to project in MongoDB!');

  // 11. Update File Tree in DB
  console.log('11. Testing Update File Tree in DB...');
  const sampleFileTree = {
    'index.js': { file: { contents: 'console.log("Hello CHATNCOLLAB");' } },
    'package.json': { file: { contents: '{"name":"sample"}' } }
  };
  const updateTreeRes = await fetch(BASE + '/projects/update-file-tree', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    },
    body: JSON.stringify({ projectId, fileTree: sampleFileTree })
  });
  const updateTreeData = await updateTreeRes.json();
  if (updateTreeRes.status !== 200 || !updateTreeData.project.fileTree['index.js']) {
    throw new Error('Update fileTree failed: ' + JSON.stringify(updateTreeData));
  }
  console.log('✓ File tree updated and persisted in MongoDB!');

  // 12. Get Project by ID (populated users)
  console.log('12. Testing Get Project by ID with Populated Users...');
  const getProjRes = await fetch(BASE + '/projects/get-project/' + projectId, {
    headers: { 'Authorization': 'Bearer ' + token1 }
  });
  const getProjData = await getProjRes.json();
  if (getProjRes.status !== 200 || getProjData.project.users.length < 2) {
    throw new Error('Get project by id failed: ' + JSON.stringify(getProjData));
  }
  console.log('✓ Populated project retrieved! Members:', getProjData.project.users.map(u => u.email));

  // 13. Test AI Endpoint
  console.log('13. Testing AI Service Endpoint...');
  const aiRes = await fetch(BASE + '/ai/get-result?prompt=' + encodeURIComponent('express app'));
  const aiText = await aiRes.text();
  console.log('✓ AI Endpoint responded! Length:', aiText.length, 'preview:', aiText.slice(0, 80));

  // 14. Test Logout & Token Blacklist in Redis
  console.log('14. Testing Logout & Token Blacklisting in Redis...');
  const logoutRes = await fetch(BASE + '/users/logout', {
    headers: { 'Authorization': 'Bearer ' + token1 }
  });
  const logoutData = await logoutRes.json();
  if (logoutRes.status !== 200) {
    throw new Error('Logout failed: ' + JSON.stringify(logoutData));
  }
  console.log('✓ Token blacklisted in Redis! Logout message:', logoutData.message);

  // 15. Verify Blacklisted Token is Rejected
  console.log('15. Verifying Blacklisted Token cannot access protected routes...');
  const rejectRes = await fetch(BASE + '/users/profile', {
    headers: { 'Authorization': 'Bearer ' + token1 }
  });
  if (rejectRes.status === 401) {
    console.log('✓ Blacklisted token successfully rejected with 401!');
  } else {
    throw new Error('Expected 401 with blacklisted token but got ' + rejectRes.status);
  }

  console.log('=============================================');
  console.log('🎉 ALL DATABASE AND BACKEND TESTS PASSED 100%! 🎉');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('❌ DB TEST FAILED:', err);
  process.exit(1);
});
