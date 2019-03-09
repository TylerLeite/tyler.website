document.getElementsByClassName('toggle-hud')[0].onclick = function (event) {
  document.getElementsByClassName('wrapper')[0].classList.toggle('hidden');
  event.target.classList.toggle('hidden');
}
