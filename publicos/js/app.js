
const accounts = {
    default: {
        expensesData: [500, 300, 150, 200, 100, 50, 400, 250, 350, 450],
        expensesLabels: ['Comida', 'Combustible', 'Renta', 'Transporte', 'Entretenimiento', 'Otros', 'Salud', 'Educación', 'Ropa', 'Ahorros'],
        incomeData: [1000, 1200, 800, 1500, 900],
        incomeLabels: ['Salario', 'Freelance', 'Inversiones', 'Regalos', 'Otros']
    }
};
let currentAccount = 'default';
let currentData = accounts[currentAccount].expensesData;
let currentLabels = accounts[currentAccount].expensesLabels;
const colors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)'
];
let total = currentData.reduce((acc, value) => acc + value, 0);

document.getElementById('totalExpenses').textContent = `Total: $${total}`;

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: currentLabels,
        datasets: [{
            label: 'Gastos',
            data: currentData,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': $';
                        }
                        if (context.raw !== null) {
                            label += context.raw;
                        }
                        return label;
                    }
                }
            }
        }
    }
});

const chartDataList = document.getElementById('chartDataList');
function updateHistory() {
    chartDataList.innerHTML = '';
    currentLabels.forEach((label, index) => {
        const percentage = ((currentData[index] / total) * 100).toFixed(2);
        const listItem = document.createElement('li');
        listItem.className = 'bg-gray-100 p-4 rounded-lg flex items-center justify-center space-x-2 border border-black';
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = colors[index];
        const text = document.createElement('span');
        text.textContent = `${label}: $${currentData[index]} (${percentage}%)`;
        listItem.appendChild(colorBox);
        listItem.appendChild(text);
        chartDataList.appendChild(listItem);
    });
}
updateHistory();

function openAddDataModal() {
    document.getElementById('addDataModal').style.display = "block";
}

function closeAddDataModal() {
    document.getElementById('addDataModal').style.display = "none";
}

function addData() {
    const newLabel = document.getElementById('newLabel').value;
    const newValue = parseFloat(document.getElementById('newValue').value);
    if (newLabel && !isNaN(newValue)) {
        const newColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
        currentLabels.push(newLabel);
        currentData.push(newValue);
        colors.push(newColor);
        total += newValue;

        document.getElementById('totalExpenses').textContent = `Total: $${total}`;

        myChart.data.labels = currentLabels;
        myChart.data.datasets[0].data = currentData;
        myChart.data.datasets[0].backgroundColor = colors;
        myChart.data.datasets[0].borderColor = colors;
        myChart.update();

        updateHistory();
        closeAddDataModal();
    }
}

function openCreateAccountModal() {
    document.getElementById('createAccountModal').style.display = "block";
}

function closeCreateAccountModal() {
    document.getElementById('createAccountModal').style.display = "none";
}

function showChart(type) {
if (type === 'expenses') {
currentData = accounts[currentAccount].expensesData;
currentLabels = accounts[currentAccount].expensesLabels;
} else if (type === 'income') {
currentData = accounts[currentAccount].incomeData;
currentLabels = accounts[currentAccount].incomeLabels;
}
total = currentData.reduce((acc, value) => acc + value, 0);
document.getElementById('totalExpenses').textContent = `Total: $${total}`;
myChart.data.labels = currentLabels;
myChart.data.datasets[0].data = currentData;
myChart.update();
updateHistory();
}

function switchAccount(accountName) {
currentAccount = accountName;
showChart('expenses');
updateHistory();
}

function deleteAccount(accountName) {
if (confirm(`¿Está seguro de que desea eliminar la cuenta "${accountName}"?`)) {
delete accounts[accountName];
const accountMenuContent = document.getElementById('accountMenuContent');
const accountItems = accountMenuContent.querySelectorAll('div');
accountItems.forEach(item => {
    if (item.textContent.includes(accountName)) {
        accountMenuContent.removeChild(item);
    }
});
if (currentAccount === accountName) {
    currentAccount = 'default';
    showChart('expenses');
    updateHistory();
}
}
}

function createAccount() {
const accountName = document.getElementById('accountName').value;
if (accountName && !accounts[accountName]) {
accounts[accountName] = {
    expensesData: [],
    expensesLabels: [],
    incomeData: [],
    incomeLabels: []
};
const accountMenuContent = document.getElementById('accountMenuContent');
const newAccountLink = document.createElement('a');
newAccountLink.href = "#";
newAccountLink.textContent = accountName;
newAccountLink.onclick = function() {
    switchAccount(accountName);
};
const deleteButton = document.createElement('span');
deleteButton.textContent = "Eliminar";
deleteButton.className = "delete-button";
deleteButton.onclick = function(event) {
    event.stopPropagation();
    deleteAccount(accountName);
};
const accountItem = document.createElement('div');
accountItem.style.display = "flex";
accountItem.style.alignItems = "center";
accountItem.appendChild(newAccountLink);
accountItem.appendChild(deleteButton);
accountMenuContent.insertBefore(accountItem, accountMenuContent.lastElementChild);
closeCreateAccountModal();
} else {
alert('La cuenta ya existe o el nombre está vacío');
}
}

