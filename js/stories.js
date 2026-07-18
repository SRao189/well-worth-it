document.querySelectorAll('.story-card button:not([disabled])').forEach(button=>button.addEventListener('click',()=>{button.textContent='Story source pending licensing';button.disabled=true;}));
