const error1Btn = document.getElementById('error1');
const error2Btn = document.getElementById('error2');

error1Btn.addEventListener('click', async e => {
  e.preventDefault();
  await fetch('/typeError');
});

error2Btn.addEventListener('click', async e => {
  e.preventDefault();
  await fetch('/referenceError');
});
