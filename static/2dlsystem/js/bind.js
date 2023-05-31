document.getElementsByClassName('toggle-hud')[0].onclick = (event) => {
  document.getElementsByClassName('wrapper')[0].classList.toggle('hidden');
  event.target.classList.toggle('hidden');
}

document.getElementById('add-rule').onclick = (event) => {
  // make the elements
  const row = document.createElement('span');
  row.classList.add('row');

  const in1 = document.createElement('input');
  in1.classList.add('from');
  in1.type = 'text';
  row.appendChild(in1);

  const eq1 = document.createElement('p');
  eq1.classList.add('eq');
  eq1.innerHTML = '=';
  row.appendChild(eq1);

  const in2 = document.createElement('input');
  in2.type = 'text';
  row.appendChild(in2);

  const eq2 = document.createElement('p');
  eq2.classList.add('eq');
  eq2.innerHTML = 'x';
  eq2.onclick = evt => event.target.parentElement.remove();
  row.appendChild(eq2);

  // insert them
  const target = document.getElementById('rule-add-anchor');
  document.getElementById('rules').insertBefore(row, target);
}

document.getElementById('render-button').onclick = (event) => {
  cancel();

  let rules = {}

  const rulesRows = document.getElementById('rules').children;
  for (let row of rulesRows) {
    if (row.tagName == 'SPAN' && row.id != 'computeinputs') {
      rules[row.children[0].value] = row.children[2].value;
    }
  }

  const start = document.getElementById('start').value;
  const its = Number(document.getElementById('iterations').value);
  const _x = Number(document.getElementById('x-in').value)*wd/100;
  const _y = Number(document.getElementById('y-in').value)*hg/100;
  const colorStep = Number(document.getElementById('colorstep-in').value);
  const preserveColor = true; // document.getElementById('preservecolor-in');
  const angle = Number(document.getElementById('angle-in').value);

  const size = Number(document.getElementById('size-in').value);
  let renderSpeed = Number(document.getElementById('renderspeed-in').value);
  if (renderSpeed == 0 || isNaN(renderSpeed)) {
    renderSpeed = false;
  }

  updateVars(_x, _y, colorStep, preserveColor, angle);
  const computed = compute(start, rules, its);
  // console.log(computed)
  render(computed, angle, size, renderSpeed, currentRenderId.slice());
}

document.getElementById('render-button').onclick()
