const itemsPerPage = 10; // Número de itens por página
let currentPage = 1; // Página atual
let allProducts = []; // Armazena todos os produtos retornados

async function fetchProducts(month, startDate, endDate) {
  try {
    console.log(month);   
    if (month === '') {
      const response = await fetch(`http://localhost:3000/voyant/products?dataInicial=${startDate}&dataFinal=${endDate}`);
      const data = await response.json();     
      return data;
    } else {
      const response = await fetch(`http://localhost:3000/voyant/products/data?mes=${month}`);
      const data = await response.json();   
      return data;  
    }  
  } catch (error) {
    console.error(error);
    document.getElementById('loading').innerText = 'Erro ao carregar produtos.';
    return [];
  }
}

async function loadProducts(month, startDate, endDate) {
  allProducts = await fetchProducts(month, startDate, endDate);
  if (allProducts.length > 0) {
    renderTable();
    renderPagination();
    document.getElementById('loading').style.display = 'none';
    document.getElementById('productTable').style.display = 'table';
  } else {
    document.getElementById('loading').innerText = 'Nenhum produto encontrado.';
    document.getElementById('productTable').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
  }
}


function renderTable() {
  const tableBody = document.getElementById('productTableBody');
  tableBody.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = allProducts.slice(start, end);

  paginatedProducts.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.product_name}</td>
      <td>${product.quantity_sold}</td>
      <td>${product.total_sales_value}</td>
    `;
    tableBody.appendChild(row);
  });
}


function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.addEventListener('click', () => {
      currentPage = i;
      renderTable();
      renderPagination();
    });
    pagination.appendChild(button);
  }

  pagination.style.display = 'block';
}


document.getElementById('month').addEventListener('change', () => {
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
});

document.getElementById('startDate').addEventListener('change', () => {
  document.getElementById('month').value = '';
});

document.getElementById('endDate').addEventListener('change', () => {
  document.getElementById('month').value = '';
});


document.getElementById('filterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const month = document.getElementById('month').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  document.getElementById('loading').style.display = 'block';
  document.getElementById('productTable').style.display = 'none';

  currentPage = 1;
  loadProducts(month, startDate, endDate);
});
