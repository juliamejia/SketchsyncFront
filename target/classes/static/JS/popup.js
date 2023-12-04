var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
	overlay = document.getElementById('overlay'),
	btnCerrarPopup = document.getElementById('btn-cerrar-popup'),
	overgame = document.getElementById('overgame');
	//btnAbrirWin = document.getElementById('btn-abrir-win')

btnAbrirPopup.addEventListener('click', function(){
    overlay.classList.add('active');
});

btnCerrarPopup.addEventListener('click', function(){
	overlay.classList.remove('active');
});
