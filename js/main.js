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
// ============================
// FORGOT PASSWORD FEATURE
// ============================

const forgotBtn = document.getElementById("forgotPasswordBtn");
const forgotModal = document.getElementById("forgotModal");
const closeForgot = document.getElementById("closeForgot");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.innerText = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

if (forgotBtn) {
  forgotBtn.addEventListener("click", () => {
    forgotModal.style.display = "flex";
  });
}

if (closeForgot) {
  closeForgot.addEventListener("click", () => {
    forgotModal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === forgotModal) {
    forgotModal.style.display = "none";
  }
});

if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener("click", async () => {

    const email = document.getElementById("resetEmail").value.trim();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    resetPasswordBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    resetPasswordBtn.disabled = true;

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: "a1d8293a-605f-454f-9192-9e98805ffb8d",
            subject: "TaskFlow Password Reset Request",
            from_name: "TaskFlow",
            email: email,
            message: `Password reset requested for: ${email}`
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast("Reset request sent successfully!");
        forgotModal.style.display = "none";
        document.getElementById("resetEmail").value = "";
      } else {
        alert("Failed to send request.");
      }

    } catch (error) {
      alert("Something went wrong.");
      console.error(error);
    }

    resetPasswordBtn.innerHTML = "Send Reset Request";
    resetPasswordBtn.disabled = false;

  });
}
