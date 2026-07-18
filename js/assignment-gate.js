(() => {
  const gate = document.querySelector('#assignmentGate');
  const app = document.querySelector('#appShell');
  const enter = document.querySelector('#enterAssignmentDemo');
  if (!gate || !app || !enter) return;
  const key = 'wwi-assignment-disclaimer-v1';
  function openApp() {
    gate.hidden = true;
    app.setAttribute('aria-hidden', 'false');
    document.body.classList.remove('gate-open');
  }
  if (sessionStorage.getItem(key) === 'acknowledged') openApp();
  else {
    document.body.classList.add('gate-open');
    enter.focus();
  }
  enter.addEventListener('click', () => {
    sessionStorage.setItem(key, 'acknowledged');
    openApp();
  });
})();
