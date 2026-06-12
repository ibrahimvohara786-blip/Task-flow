* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

:root {
  --bg: #f3f7ff;
  --card: rgba(255, 255, 255, 0.96);
  --text: #0f172a;
  --muted: #475569;
  --primary: #3b82f6;
  --accent: #f97316;
  --shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
}

.dark {
  --bg: #090b18;
  --card: rgba(15, 23, 42, 0.96);
  --text: #f8fafc;
  --muted: #94a3b8;
  --primary: #60a5fa;
  --accent: #fb923c;
  --shadow: 0 24px 80px rgba(15, 23, 42, 0.45);
}

html {
  scroll-behavior: smooth;
}

body {
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 30%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg) 100%);
  color: var(--text);
  min-height: 100vh;
  transition: background 0.4s ease, color 0.4s ease;
}

.theme-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: var(--card);
  box-shadow: var(--shadow);
  color: var(--text);
  font-size: 18px;
  display: grid;
  place-items: center;
}

.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 64px;
  padding: 64px;
}

.hero-copy {
  max-width: 560px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 18px;
}

.eyebrow::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
}

.hero-copy h1 {
  font-size: clamp(3rem, 4vw, 4.4rem);
  line-height: 1.02;
  margin-bottom: 22px;
}

.hero-copy p {
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.8;
  max-width: 520px;
  margin-bottom: 32px;
}

.hero-features {
  display: grid;
  gap: 14px;
}

.hero-features div {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.hero-features i {
  color: var(--primary);
}

.auth-card {
  max-width: 520px;
  width: 100%;
  background: var(--card);
  padding: 42px 40px;
  border-radius: 32px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
}

.tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: rgba(59, 130, 246, 0.12);
  border-radius: 16px;
  padding: 6px;
  gap: 6px;
  margin-bottom: 32px;
}

.tab {
  border: none;
  padding: 16px 0;
  border-radius: 14px;
  cursor: pointer;
  background: transparent;
  font-size: 1rem;
  font-weight: 700;
  color: var(--muted);
  transition: all 0.2s ease;
}

.tab.active {
  background: white;
  color: var(--text);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.dark .tab.active {
  background: rgba(255, 255, 255, 0.08);
}

.form-panel {
  display: grid;
  gap: 18px;
}

.form-panel h2 {
  font-size: 2rem;
}

.input-group {
  display: grid;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  color: var(--text);
}

.input-group input {
  width: 100%;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.92);
  color: var(--text);
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: var(--primary);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(59, 130, 246, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.hidden {
  display: none;
}
/* Forgot Password Modal Overlay */
/* =========================
   FORGOT PASSWORD MODAL
========================= */

.forgot-modal{
  display:none;
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  justify-content:center;
  align-items:center;
  z-index:9999;
}

.forgot-box{
  width:450px;
  max-width:90%;
  background:#ffffff;
  padding:35px;
  border-radius:24px;
  box-shadow:0 20px 60px rgba(0,0,0,.15);
  position:relative;
}

.forgot-box h2{
  font-size:2rem;
  margin-bottom:12px;
  color:#0f172a;
}

.forgot-box p{
  color:#64748b;
  margin-bottom:20px;
  line-height:1.6;
}

.forgot-box input{
  width:100%;
  height:56px;
  padding:0 18px;
  border:1px solid #dbeafe;
  border-radius:16px;
  background:#f8fafc;
  color:#111827;
  font-size:16px;
  margin-bottom:20px;
  outline:none;
}

.forgot-box input:focus{
  border-color:#3b82f6;
  box-shadow:0 0 0 4px rgba(59,130,246,.1);
}

.forgot-box .btn{
  width:100%;
}

.close-forgot{
  position:absolute;
  top:15px;
  right:15px;
  width:42px;
  height:42px;
  border:none;
  border-radius:12px;
  background:#f3f4f6;
  color:#111827;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:20px;
}

.close-forgot:hover{
  background:#e5e7eb;
}

/* Forgot Password Link */

.forgot-row{
  display:flex;
  justify-content:flex-end;
}

.forgot-link{
  background:none;
  border:none;
  color:var(--primary);
  cursor:pointer;
  font-size:.95rem;
  font-weight:600;
}

.forgot-link:hover{
  text-decoration:underline;
}

/* Dark Mode */

.dark .forgot-box{
  background:#111827;
}

.dark .forgot-box h2{
  color:#ffffff;
}

.dark .forgot-box p{
  color:#94a3b8;
}

.dark .forgot-box input{
  background:#1f2937;
  color:#ffffff;
  border-color:#374151;
}

.dark .close-forgot{
  background:#1f2937;
  color:#ffffff;
}

/* Toast */

.toast{
  position:fixed;
  top:20px;
  right:20px;
  background:#10b981;
  color:#fff;
  padding:14px 20px;
  border-radius:14px;
  display:none;
  z-index:10000;
  box-shadow:0 15px 40px rgba(16,185,129,.35);
}
/* Forgot Password Link */
.forgot-row{
  display:flex;
  justify-content:flex-end;
  margin-top:-5px;
}

.forgot-link{
  background:none;
  border:none;
  color:var(--primary);
  cursor:pointer;
  font-weight:600;
  font-size:.95rem;
}

.forgot-link:hover{
  text-decoration:underline;
}
.dark .forgot-box{
  background:#111827;
}

.dark .forgot-box h2{
  color:#fff;
}

.dark .forgot-box p{
  color:#94a3b8;
}

.dark .forgot-box input{
  background:#1f2937;
  color:#fff;
  border-color:#374151;
}

.dark .close-forgot{
  background:#1f2937;
  color:#fff;
}
.dark .forgot-box{
  background:#111827;
}

.dark .forgot-box h2{
  color:#fff;
}

.dark .forgot-box p{
  color:#94a3b8;
}

.dark .forgot-box input{
  background:#1f2937;
  color:#fff;
  border-color:#374151;
}

.dark .close-forgot{
  background:#1f2937;
  color:#fff;
}
@media (max-width: 1000px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 40px;
  }
}
.toast{
  position:fixed;
  top:20px;
  right:20px;
  background:#10b981;
  color:#fff;
  padding:14px 20px;
  border-radius:14px;
  display:none;
  z-index:9999;
  box-shadow:0 15px 40px rgba(16,185,129,.35);
}
@media (max-width: 680px) {
  .hero-copy h1 {
    font-size: 2.8rem;
  }

  .auth-card {
    padding: 30px;
  }
}
.forgot-box input{
  width:100% !important;
  height:56px !important;
  padding:0 18px !important;
  border:1px solid #dbeafe !important;
  border-radius:16px !important;
  background:#f8fafc !important;
  color:#111827 !important;
  font-size:16px !important;
  margin:16px 0 20px !important;
  outline:none !important;
}

.forgot-box .btn{
  width:100%;
  margin-top:10px;
}

.close-forgot{
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:22px;
}
