const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const themeBtn = document.getElementById('themeBtn');

const savedTheme = localStorage.getItem('taskflow-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

const setTheme = (theme) => {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('taskflow-theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('taskflow-theme', 'light');
  }
};

const switchTab = (tab) => {
  if (tab === 'login') {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
};

loginTab.addEventListener('click', () => switchTab('login'));
signupTab.addEventListener('click', () => switchTab('signup'));

themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  setTheme(isDark ? 'dark' : 'light');
});

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('taskflow-users') || '[]');
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem('taskflow-users', JSON.stringify(users));
};

const showAlert = (message) => {
  alert(message);
};

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    showAlert('Please fill in every field.');
    return;
  }

  const users = getUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    showAlert('This email is already registered. Please login.');
    switchTab('login');
    return;
  }

  users.push({ name, email, password });
  saveUsers(users);
  localStorage.setItem('taskflow-user', JSON.stringify({ name, email }));
  window.location.href = 'dashboard.html';
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const users = getUsers();
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    showAlert('Invalid email or password.');
    return;
  }

  localStorage.setItem('taskflow-user', JSON.stringify({ name: user.name, email: user.email }));
  window.location.href = 'dashboard.html';
});

if (window.location.pathname.endsWith('dashboard.html')) {
  const activeUser = localStorage.getItem('taskflow-user');
  if (!activeUser) {
    window.location.href = 'index.html';
  }
}
