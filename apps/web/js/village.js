document.querySelectorAll('.building-card button').forEach(button=>button.addEventListener('click',()=>{button.textContent='Collected';button.disabled=true}));
