// input.addEventListener('input', function (e) {
//   console.log('input event', e.target.value);
// });
// input.addEventListener('keydown', function (e) {
//   console.log('keydown event', e.target.value);
// });
// input.addEventListener('input', function (e) {
//   console.log('keypress event', e.target.value);
// });
// input.addEventListener('input', function (e) {
//   console.log('keyup event', e.target.value);
// });

document.addEventListener('reset', function (e) {
  console.log('reset');
});

invalid.addEventListener('invalid', function (e) {
  console.log(e);
});