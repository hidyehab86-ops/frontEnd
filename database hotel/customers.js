let customers = [];
let editingId = null;

const form = document.getElementById("customer-form");
const body = document.getElementById("customers-body");
const search = document.getElementById("search");
const message = document.getElementById("table-message");

async function loadCustomers() {
  customers = await getCustomers(); // Function: getCustomers
  showCustomers();
}

function showCustomers() {
  const text = search.value.trim().toLowerCase();

  const filtered = customers.filter((c) => {
    const data = `${c.id} ${c.name} ${c.phone} ${c.email} ${c.nationality}`.toLowerCase();
    return data.includes(text);
  });

  document.getElementById("total-customers").textContent = customers.length;
  document.getElementById("search-results").textContent = filtered.length;

  const now = new Date();

  const newCount = customers.filter((c) => {
    const date = new Date(c.createdAt);
    return (
      !isNaN(date) &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  document.getElementById("new-customers").textContent = newCount;
  body.innerHTML = "";

  filtered.forEach((c) => {
    const row = document.createElement("tr");

    [c.id, c.name, c.phone, c.email || "-", c.nationality || "-"].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actions = document.createElement("td");
    actions.className = "actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.dataset.id = c.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.dataset.id = c.id;

    actions.append(editButton, deleteButton);
    row.appendChild(actions);
    body.appendChild(row);
  });

  message.textContent = filtered.length
    ? `Showing ${filtered.length} customer(s).`
    : "No customers found.";
}

function resetForm() {
  form.reset();
  editingId = null;

  document.getElementById("form-title").textContent = "Add New Customer";
  document.getElementById("submit-button").textContent = "+ Add Customer";
  document.getElementById("cancel-edit").hidden = true;
}

function findCustomer(id) {
  return customers.find((c) => String(c.id) === String(id));
}

function editCustomer(id) {
  const customer = findCustomer(id);
  if (!customer) return;

  editingId = id;

  document.getElementById("name").value = customer.name;
  document.getElementById("phone").value = customer.phone;
  document.getElementById("email").value = customer.email || "";
  document.getElementById("nationality").value = customer.nationality || "";

  document.getElementById("form-title").textContent = "Edit Customer";
  document.getElementById("submit-button").textContent = "Save Changes";
  document.getElementById("cancel-edit").hidden = false;
  document.getElementById("name").focus();
}

async function deleteCustomer(id) {
  const customer = findCustomer(id);
  if (!customer) return;

  if (!confirm(`Are you sure you want to delete ${customer.name}?`)) return;

  await deleteCustomerById(id); // Function: deleteCustomerById

  if (String(editingId) === String(id)) resetForm();

  await loadCustomers();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    nationality: document.getElementById("nationality").value.trim()
  };

  if (editingId !== null) {
    await updateCustomer(editingId, data); // Function: updateCustomer
  } else {
    await addCustomer(data); // Function: addCustomer
  }

  resetForm();
  await loadCustomers();
});

body.addEventListener("click", (e) => {
  const button = e.target.closest("button[data-id]");
  if (!button) return;

  const id = button.dataset.id;

  if (button.classList.contains("edit-button")) {
    editCustomer(id);
  }

  if (button.classList.contains("delete-button")) {
    deleteCustomer(id);
  }
});

document.getElementById("cancel-edit").addEventListener("click", resetForm);

search.addEventListener("input", showCustomers);

loadCustomers();