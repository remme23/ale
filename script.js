document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('order-form');
  const summary = document.getElementById('summary');
  const previousOrder = document.getElementById('previous-order');
  const totalEl = document.getElementById('total');
  const quantityInput = document.getElementById('quantity');
  const decreaseBtn = document.getElementById('decrease');
  const increaseBtn = document.getElementById('increase');
  const themeToggle = document.getElementById('theme-toggle');

  const pizzaPrices = {
    'Margherita': 5,
    'Diavola': 6,
    'Quattro Formaggi': 7,
    'Prosciutto e Funghi': 6.5
  };
  const extraPrice = 0.5;

  function updateTotal() {
    const pizza = form.pizza.value;
    const quantity = parseInt(quantityInput.value, 10) || 1;
    let total = pizzaPrices[pizza] * quantity;
    const extras = form.querySelectorAll('fieldset input[type="checkbox"]:checked');
    total += extras.length * extraPrice * quantity;
    totalEl.textContent = `€${total.toFixed(2)}`;
  }

  function loadLastOrder() {
    const last = localStorage.getItem('lastOrder');
    if (last) {
      const order = JSON.parse(last);
      previousOrder.textContent = `Ciao ${order.name}, il tuo ultimo ordine è stato una ${order.pizza} con ${order.extras.join(', ') || 'nessun extra'}`;
      previousOrder.classList.remove('hidden');
    }
  }

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function validatePhone(phone) {
    return /^(\+39)?\s?\d{9,10}$/.test(phone);
  }

  function showError(input, message) {
    const msgEl = document.getElementById(`${input.id}-error`);
    if (msgEl) msgEl.textContent = message;
    input.classList.toggle('invalid', !!message);
  }

  function clearErrors() {
    form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  }

  function buildSummary(order) {
    const extras = order.extras.length ? order.extras.join(', ') : 'Nessun extra';
    summary.innerHTML = `
      <div class="card">
        <h3>Riepilogo ordine</h3>
        <p><strong>Nome:</strong> ${order.name}</p>
        <p><strong>Pizza:</strong> ${order.pizza} x ${order.quantity}</p>
        <p><strong>Extra:</strong> ${extras}</p>
        <p><strong>Prezzo totale:</strong> €${order.total.toFixed(2)}</p>
        <p><strong>Pagamento:</strong> ${order.payment}</p>
        <p><strong>Note:</strong> ${order.notes || 'Nessuna'}</p>
        <button id="edit-order" class="submit-btn">Modifica ordine</button>
        <button id="new-order" class="submit-btn">Nuovo ordine</button>
      </div>`;
    summary.classList.add('show');
    summary.classList.remove('hidden');
    summary.scrollIntoView({behavior: 'smooth'});
  }

  function gatherOrder() {
    const extras = Array.from(form.querySelectorAll('fieldset input[type="checkbox"]:checked'))
      .map(cb => cb.value);
    const quantity = parseInt(quantityInput.value, 10) || 1;
    const total = parseFloat(totalEl.textContent.replace('€',''));
    return {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      pizza: form.pizza.value,
      quantity,
      extras,
      notes: form.notes.value.trim(),
      payment: form.payment.value,
      total
    };
  }

  function populateForm(order) {
    form.name.value = order.name;
    form.email.value = order.email;
    form.phone.value = order.phone;
    form.pizza.value = order.pizza;
    quantityInput.value = order.quantity;
    form.querySelectorAll('fieldset input[type="checkbox"]').forEach(cb => {
      cb.checked = order.extras.includes(cb.value);
    });
    form.notes.value = order.notes;
    form.payment.value = order.payment;
    form.terms.checked = true;
    updateTotal();
  }

  decreaseBtn.addEventListener('click', () => {
    let q = parseInt(quantityInput.value, 10) || 1;
    if (q > 1) quantityInput.value = q - 1;
    updateTotal();
  });
  increaseBtn.addEventListener('click', () => {
    let q = parseInt(quantityInput.value, 10) || 1;
    quantityInput.value = q + 1;
    updateTotal();
  });
  quantityInput.addEventListener('input', updateTotal);
  form.pizza.addEventListener('change', updateTotal);
  form.querySelectorAll('fieldset input[type="checkbox"]').forEach(cb => cb.addEventListener('change', updateTotal));

  form.email.addEventListener('input', () => {
    showError(form.email, validateEmail(form.email.value) ? '' : 'Email non valida');
  });
  form.phone.addEventListener('input', () => {
    showError(form.phone, validatePhone(form.phone.value) ? '' : 'Telefono non valido');
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;
    if (!form.name.value.trim()) { showError(form.name, 'Campo obbligatorio'); valid = false; }
    if (!validateEmail(form.email.value)) { showError(form.email, 'Email non valida'); valid = false; }
    if (!validatePhone(form.phone.value)) { showError(form.phone, 'Telefono non valido'); valid = false; }
    if (!form.terms.checked) { document.getElementById('terms-error').textContent = 'Necessario'; valid = false; }

    if (!valid) return;

    const order = gatherOrder();
    localStorage.setItem('lastOrder', JSON.stringify(order));
    buildSummary(order);
    form.classList.add('hidden');
  });

  summary.addEventListener('click', (e) => {
    if (e.target.id === 'edit-order') {
      const order = JSON.parse(localStorage.getItem('lastOrder'));
      populateForm(order);
      summary.classList.add('hidden');
      form.classList.remove('hidden');
    }
    if (e.target.id === 'new-order') {
      localStorage.removeItem('lastOrder');
      summary.classList.add('hidden');
      form.reset();
      updateTotal();
      form.classList.remove('hidden');
      previousOrder.classList.add('hidden');
    }
  });

  // Initialize
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
  updateTotal();
  loadLastOrder();
});
