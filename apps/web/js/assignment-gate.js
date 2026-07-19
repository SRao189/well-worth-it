(() => {
  const gate = document.querySelector('#assignmentGate');
  const app = document.querySelector('#appShell');
  const safety = document.querySelector('#safetyGate');
  const enter = document.querySelector('#enterAssignmentDemo');
  const enterSafety = document.querySelector('#enterSafetyDemo');
  if (!gate || !app || !enter || !safety || !enterSafety) return;
  const key = 'wwi-assignment-disclaimer-v1';
  function openApp() {
    gate.hidden = true;
    safety.hidden = true;
    app.setAttribute('aria-hidden', 'false');
    document.body.classList.remove('gate-open');
  }
  function openSafety() { gate.hidden = true; safety.hidden = false; enterSafety.focus(); }
  if (sessionStorage.getItem(key) === 'acknowledged') openApp();
  else {
    document.body.classList.add('gate-open');
    enter.focus();
  }
  enter.addEventListener('click', openSafety);
  enterSafety.addEventListener('click', () => { sessionStorage.setItem(key, 'acknowledged'); openApp(); });
})();
