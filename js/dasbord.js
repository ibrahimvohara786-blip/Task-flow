
const userData = JSON.parse(localStorage.getItem('taskflow-user'));
if (!userData) {
    window.location.href = 'index.html';
}

const welcomeUser = document.getElementById('welcomeUser');
const accountInfo = document.getElementById('accountInfo');
const themeBtn = document.getElementById('themeBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const sectionButtons = document.querySelectorAll('.nav-link');
const sections = {
    tasks: document.getElementById('tasksSection'),
    statistics: document.getElementById('statisticsSection'),
    settings: document.getElementById('settingsSection')
};

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDesc = document.getElementById('taskDesc');
const priority = document.getElementById('priority');
const dueDate = document.getElementById('dueDate');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('emptyState');
const toast = document.getElementById('toast');

const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const progressPercentEl = document.getElementById('progressPercent');
const progressBar = document.getElementById('progressBar');
const statCompletion = document.getElementById('statCompletion');
const statActive = document.getElementById('statActive');
const statHigh = document.getElementById('statHigh');
const statDueToday = document.getElementById('statDueToday');
const statOverdue = document.getElementById('statOverdue');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const exportTasksBtn = document.getElementById('exportTasksBtn');

let tasks = JSON.parse(localStorage.getItem('taskflow-tasks') || '[]');
let currentFilter = 'all';

const themeKey = 'taskflow-theme';
const savedTheme = localStorage.getItem(themeKey);
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

const setTheme = (theme) => {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem(themeKey, 'dark');
    } else {
        document.body.classList.remove('dark');
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem(themeKey, 'light');
    }
};

const showToast = (message) => {
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2400);
};

const saveTasks = () => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
    try { if (typeof updateAnalytics === 'function') updateAnalytics(); } catch(e){}
    try { if (typeof renderAchievements === 'function') renderAchievements(); } catch(e){}
    try { if (typeof renderGoals === 'function') renderGoals(); } catch(e){}
};

/* --- New features: Deep Work, Analytics, Achievements, Daily Goals --- */
const deepWorkBtn = document.getElementById('deepWorkBtn');
const deepWorkOverlay = document.getElementById('deepWorkOverlay');
const dwTimerEl = document.getElementById('dwTimer');
const dwStart = document.getElementById('dwStart');
const dwPause = document.getElementById('dwPause');
const dwReset = document.getElementById('dwReset');
const dwClose = document.getElementById('dwClose');

// Ensure completedAt on tasks when toggled
const markCompletedAt = (task, isCompleted) => {
    if (isCompleted) task.completedAt = new Date().toISOString(); else delete task.completedAt;
};

// Analytics & Productivity
const productivityScoreEl = document.getElementById('productivityScore');
const weeklyCompletedEl = document.getElementById('weeklyCompleted');
const currentStreakEl = document.getElementById('currentStreak');

const computeWeeklyCompleted = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    const weekStartStr = weekStart.toISOString().slice(0, 10);
    return tasks.filter(t => t.completedAt && t.completedAt.slice(0,10) >= weekStartStr).length;
};

const computeStreak = () => {
    const completedDates = new Set(tasks.filter(t => t.completedAt).map(t => t.completedAt.slice(0,10)));
    let streak = 0; let d = new Date();
    while (true) {
        const key = d.toISOString().slice(0,10);
        if (completedDates.has(key)) { streak++; d.setDate(d.getDate()-1); } else break;
    }
    return streak;
};

const computeProductivityScore = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const completionRate = total === 0 ? 0 : (completed / total) * 100;
    const streak = computeStreak();
    const streakBonus = Math.min(streak, 7) / 7 * 100;
    return Math.round((completionRate * 0.7) + (streakBonus * 0.3));
};

const updateAnalytics = () => {
    if (productivityScoreEl) productivityScoreEl.textContent = `${computeProductivityScore()}%`;
    if (weeklyCompletedEl) weeklyCompletedEl.textContent = computeWeeklyCompleted();
    if (currentStreakEl) currentStreakEl.textContent = `${computeStreak()} day${computeStreak()===1? '':'s'}`;
    try{ renderAnalyticsChart(); }catch(e){}
};

// Achievements
const achievementsListEl = document.getElementById('achievementsList');
const achievements = [
    { id: 'first-task', title: 'First Task', desc: 'Add your first task', earned: false },
    { id: 'five-complete', title: '5 Completed', desc: 'Complete 5 tasks', earned: false },
    { id: 'ten-complete', title: '10 Completed', desc: 'Complete 10 tasks', earned: false },
    { id: 'week-streak', title: '7-Day Streak', desc: 'Complete tasks 7 days in a row', earned: false }
];

const renderAchievements = () => {
    if (!achievementsListEl) return;
    const totalCompleted = tasks.filter(t => t.completed).length;
    achievements.forEach(a => {
        if (a.id === 'first-task') a.earned = tasks.length >= 1;
        if (a.id === 'five-complete') a.earned = totalCompleted >= 5;
        if (a.id === 'ten-complete') a.earned = totalCompleted >= 10;
        if (a.id === 'week-streak') a.earned = computeStreak() >= 7;
    });
    achievementsListEl.innerHTML = '';
    achievements.forEach(a => {
        const el = document.createElement('div'); el.className = 'achievement';
        el.innerHTML = `<div class="badge">${a.earned? '🏆':'🔒'}</div><div><strong>${a.title}</strong><p class="task-desc">${a.desc}</p></div>`;
        achievementsListEl.appendChild(el);
    });
};

// Daily Goals
const goalForm = document.getElementById('goalForm');
const goalInput = document.getElementById('goalInput');
const goalList = document.getElementById('goalList');
let goals = JSON.parse(localStorage.getItem('taskflow-goals') || '[]');

const saveGoals = () => { localStorage.setItem('taskflow-goals', JSON.stringify(goals)); };

const renderGoals = () => {
    if (!goalList) return;
    goalList.innerHTML = '';
    const today = new Date().toISOString().slice(0,10);
    const todaysGoals = goals.filter(g => g.date === today);
    if (todaysGoals.length === 0) { goalList.innerHTML = '<div class="empty-state">No goals set for today.</div>'; return; }
    todaysGoals.forEach((g, idx) => {
        const li = document.createElement('li'); li.className = 'goal-item';
        li.innerHTML = `<div>${g.title}</div><div><button class="secondary-btn" data-idx="${idx}">${g.completed? 'Undo' : 'Done'}</button></div>`;
        goalList.appendChild(li);
    });
};

// Analytics chart rendering (7-day simple bars)
const analyticsChartEl = document.getElementById('analyticsChart');
const getLast7Days = () => {
    const now = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(now.getDate() - i);
        days.push(d.toISOString().slice(0,10));
    }
    return days;
};

const renderAnalyticsChart = () => {
    if (!analyticsChartEl) return;
    const days = getLast7Days();
    const counts = days.map(day => tasks.filter(t=>t.completedAt && t.completedAt.slice(0,10)===day).length);
    analyticsChartEl.innerHTML = '';
    const max = Math.max(...counts, 1);
    // create bars with animated fill
    days.forEach((d,i)=>{
        const bar = document.createElement('div'); bar.className = 'bar';
        const fill = document.createElement('div'); fill.className = 'fill';
        const h = Math.round((counts[i]/max)*100);
        fill.style.height = '6%';
        const label = document.createElement('small'); label.textContent = counts[i];
        const date = document.createElement('div'); date.style.fontSize = '.7rem'; date.style.color = 'var(--muted)'; date.style.marginTop = '6px'; date.textContent = d.slice(5);
        bar.appendChild(label);
        bar.appendChild(fill);
        bar.appendChild(date);
        analyticsChartEl.appendChild(bar);
        // animate to target height
        requestAnimationFrame(()=>{ setTimeout(()=>{ fill.style.height = `${Math.max(6,h)}%`; }, i*60); });
    });
};

// Stats sub-navigation handling
const subnavBtns = document.querySelectorAll('.subnav-btn');
const overviewElements = document.querySelectorAll('.details-grid');
const analyticsSection = document.getElementById('analyticsSection');
const achievementsSection = document.getElementById('achievementsSection');
const goalsSection = document.getElementById('goalsSection');

subnavBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        subnavBtns.forEach(b=>b.classList.toggle('active', b===btn));
        const key = btn.dataset.sub;
        // toggle visibility
        overviewElements.forEach(e=> e.style.display = key==='overview' ? '' : 'none');
        if (analyticsSection) analyticsSection.style.display = key==='analytics' ? '' : 'none';
        if (achievementsSection) achievementsSection.style.display = key==='achievements' ? '' : 'none';
        if (goalsSection) goalsSection.style.display = key==='goals' ? '' : 'none';
    });
});

goalForm && goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = goalInput.value.trim(); if (!title) return;
    const today = new Date().toISOString().slice(0,10);
    goals.push({ title, completed: false, date: today });
    saveGoals(); renderGoals(); goalInput.value = '';
});

goalList && goalList.addEventListener('click', (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    const idx = Number(btn.dataset.idx);
    const today = new Date().toISOString().slice(0,10);
    const todays = goals.filter(g => g.date === today);
    const goal = todays[idx]; if (!goal) return;
    goal.completed = !goal.completed; saveGoals(); renderGoals();
});

// Deep Work mode: simple timer and overlay
let dwInterval = null; let dwSeconds = 25*60; let dwRunning = false;
const formatTime = s => { const m = Math.floor(s/60); const sec = s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; };
const openDeepWork = () => { if (deepWorkOverlay) deepWorkOverlay.style.display='flex'; if (dwTimerEl) dwTimerEl.textContent = formatTime(dwSeconds); };
const closeDeepWork = () => { if (deepWorkOverlay) deepWorkOverlay.style.display='none'; clearInterval(dwInterval); dwInterval=null; dwRunning=false; };
const startDW = () => { if (dwRunning) return; dwRunning=true; dwInterval = setInterval(()=>{ if (dwSeconds<=0){ clearInterval(dwInterval); dwRunning=false; showToast('Deep work session finished'); return; } dwSeconds--; if (dwTimerEl) dwTimerEl.textContent = formatTime(dwSeconds); },1000); };
const pauseDW = () => { if (dwInterval) { clearInterval(dwInterval); dwInterval=null; dwRunning=false; } };
const resetDW = () => { pauseDW(); dwSeconds = 25*60; if (dwTimerEl) dwTimerEl.textContent = formatTime(dwSeconds); };

deepWorkBtn && deepWorkBtn.addEventListener('click', ()=>{ openDeepWork(); });
dwStart && dwStart.addEventListener('click', startDW);
dwPause && dwPause.addEventListener('click', pauseDW);
dwReset && dwReset.addEventListener('click', resetDW);
dwClose && dwClose.addEventListener('click', ()=>{ closeDeepWork(); });



const getHighPriorityCount = () => tasks.filter((task) => task.priority === 'High').length;

const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    progressPercentEl.textContent = `${progress}%`;
    progressBar.style.width = `${progress}%`;

    const today = new Date().toISOString().slice(0, 10);
    const dueToday = tasks.filter((task) => task.dueDate === today && !task.completed).length;
    const overdue = tasks.filter((task) => task.dueDate && task.dueDate < today && !task.completed).length;

    statCompletion.textContent = `${progress}%`;
    statActive.textContent = pending;
    statHigh.textContent = getHighPriorityCount();
    statDueToday.textContent = dueToday;
    statOverdue.textContent = overdue;
};

const renderTasks = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    const filteredTasks = tasks.filter((task) => {
        const matchesFilter = currentFilter === 'all' ||
            (currentFilter === 'completed' ? task.completed :
            currentFilter === 'pending' ? !task.completed :
            currentFilter === 'due-today' ? task.dueDate === today && !task.completed :
            currentFilter === 'overdue' ? task.dueDate && task.dueDate < today && !task.completed : false);
        const matchesSearch = task.title.toLowerCase().includes(keyword) || (task.description && task.description.toLowerCase().includes(keyword));
        return matchesFilter && matchesSearch;
    });

    taskList.innerHTML = '';
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    filteredTasks.forEach((task, index) => {
        const item = document.createElement('li');
        const taskDescription = task.description ? `<p class="task-desc">${task.description}</p>` : '';
        const isToday = task.dueDate === today;
        const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
        const dueBadge = task.dueDate ? `<span class="due-badge ${isOverdue ? 'overdue' : isToday ? 'today' : ''}">${isOverdue ? 'Overdue' : isToday ? 'Due Today' : 'Due'}</span>` : '';

        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="task-info">
                <strong>${task.title}</strong>
                ${taskDescription}
                <div class="task-meta">
                    <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
                    <small>${task.dueDate ? `Due ${task.dueDate}` : 'No due date'}</small>
                    ${dueBadge}
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" type="button" title="Edit task" data-action="edit" data-index="${index}"><i class="fa-solid fa-pen"></i></button>
                <button class="complete-btn" type="button" title="Toggle complete" data-action="toggle" data-index="${index}"><i class="fa-solid fa-check"></i></button>
                <button class="delete-btn" type="button" title="Delete task" data-action="delete" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(item);
    });

    updateStats();
    saveTasks();
};

const switchSection = (section) => {
    Object.entries(sections).forEach(([key, element]) => {
        element.classList.toggle('hidden', key !== section);
    });
    sectionButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.section === section);
    });
};

sectionButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
});

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = taskInput.value.trim();
    const due = dueDate.value;
    const level = priority.value;

    if (!title) {
        showToast('Enter a task title first.');
        return;
    }

    tasks.unshift({ title, description: taskDesc.value.trim(), priority: level, dueDate: due, completed: false, createdAt: new Date().toISOString() });
    taskInput.value = '';
    taskDesc.value = '';
    dueDate.value = '';
    priority.value = 'Low';
    renderTasks();
    showToast('Task added successfully.');
});

searchInput.addEventListener('input', renderTasks);

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
        renderTasks();
    });
});

taskList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const index = Number(button.dataset.index);

    if (action === 'delete') {
        tasks.splice(index, 1);
        renderTasks();
        showToast('Task deleted.');
    }
    if (action === 'toggle') {
        tasks[index].completed = !tasks[index].completed;
        markCompletedAt(tasks[index], tasks[index].completed);
        renderTasks();
        showToast(tasks[index].completed ? 'Task completed.' : 'Task marked pending.');
    }
    if (action === 'edit') {
        const edited = prompt('Edit task title', tasks[index].title);
        if (edited && edited.trim()) {
            tasks[index].title = edited.trim();
            renderTasks();
            showToast('Task updated.');
        }
    }
});

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('taskflow-user');
    window.location.href = 'index.html';
});

themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
});

themeToggleBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    showToast('Theme updated.');
});

clearTasksBtn.addEventListener('click', () => {
    tasks = [];
    renderTasks();
    showToast('All tasks removed.');
});

clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.completed);
    renderTasks();
    showToast('Completed tasks cleared.');
});

exportTasksBtn.addEventListener('click', () => {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'taskflow-tasks.json';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast('Tasks exported.');
});

welcomeUser.textContent = `Welcome back, ${userData.name}`;
accountInfo.textContent = `${userData.name} • ${userData.email}`;

renderTasks();
try{ updateAnalytics(); }catch(e){}
try{ renderAchievements(); }catch(e){}
try{ renderGoals(); }catch(e){}
