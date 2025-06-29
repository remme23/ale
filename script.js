document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('order-form');
  const summary = document.getElementById('summary');

  function showActions(name, pizza) {
    summary.innerHTML = `
      <p>Grazie ${name}! Hai ordinato una pizza ${pizza}.</p>
      <button id="confirm">Conferma ordine</button>
      <button id="cancel">Annulla ordine</button>
    `;
    const confirm = document.getElementById('confirm');
    const cancel = document.getElementById('cancel');
    confirm.addEventListener('click', () => {
      summary.textContent = 'Ordine confermato!';
    });
    cancel.addEventListener('click', () => {
      summary.textContent = 'Ordine annullato.';
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements['name'].value;
    const pizza = form.elements['pizza'].value;
    showActions(name, pizza);
    form.reset();
  });
});
