import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://qjumscqosateiskpybal.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdW1zY3Fvc2F0ZWlza3B5YmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNzk4MTQsImV4cCI6MjA0ODg1NTgxNH0.UU345RAV6vO4pdH8b8nNGlePkrK83uapYBf75zUDN4I';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário já está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        document.getElementById('loginPopup').style.display = 'flex';
    } else {
        document.getElementById('app').style.display = 'block';
        loadData();
    }

    // Evento de submit para o formulário de login
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('loginPassword').value;

        if (username === 'nocsv2' && password === 'sv2tecno') {
            localStorage.setItem('isLoggedIn', true);
            document.getElementById('loginPopup').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            loadData();
        } else {
            alert('Usuário ou senha incorretos');
        }
    });

    // Evento de logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        document.getElementById('app').style.display = 'none';
        document.getElementById('loginPopup').style.display = 'flex';
    });

    // Eventos para abrir popups
    document.getElementById('addPasswordBtn').addEventListener('click', function() {
        document.getElementById('passwordPopup').style.display = 'flex';
        populateCompanySelect(document.getElementById('passwordForm').querySelector('#companySelect'));
    });

    document.getElementById('addNomenclatureBtn').addEventListener('click', function() {
        document.getElementById('nomenclaturePopup').style.display = 'flex';
        populateCompanySelect(document.getElementById('nomenclatureForm').querySelector('#nomenclatureCompanySelect'));
    });

    document.getElementById('exportDataBtn').addEventListener('click', function() {
        document.getElementById('exportDataPopup').style.display = 'flex';
    });

    document.getElementById('importDataBtn').addEventListener('click', function() {
        document.getElementById('importDataPopup').style.display = 'flex';
    });

    document.getElementById('addCompanyBtn').addEventListener('click', function() {
        document.getElementById('companyPopup').style.display = 'flex';
    });

    // Eventos para fechar popups
    document.getElementById('closePasswordPopup').addEventListener('click', function() {
        document.getElementById('passwordPopup').style.display = 'none';
    });

    document.getElementById('closeNomenclaturePopup').addEventListener('click', function() {
        document.getElementById('nomenclaturePopup').style.display = 'none';
    });

    document.getElementById('closeExportDataPopup').addEventListener('click', function() {
        document.getElementById('exportDataPopup').style.display = 'none';
    });

    document.getElementById('closeImportDataPopup').addEventListener('click', function() {
        document.getElementById('importDataPopup').style.display = 'none';
    });

    document.getElementById('closeCompanyPopup').addEventListener('click', function() {
        document.getElementById('companyPopup').style.display = 'none';
    });

    // Adicionar evento de submit para o formulário de senhas
    document.getElementById('passwordForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addPassword();
    });

    // Adicionar evento de submit para o formulário de nomenclaturas
    document.getElementById('nomenclatureForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addNomenclature();
    });

    // Adicionar evento de submit para o formulário de empresas
    document.getElementById('companyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addCompany();
    });

    // Adicionar evento de submit para o formulário de importação de dados
    document.getElementById('importDataForm').addEventListener('submit', function(event) {
        event.preventDefault();
        importData();
    });

    // Adicionar evento de submit para o formulário de exportação de dados
    document.getElementById('exportDataForm').addEventListener('submit', function(event) {
        event.preventDefault();
        exportData();
    });

    // Evento de pesquisa
    document.getElementById('search').addEventListener('input', function() {
        filterData(this.value, document.getElementById('filter').value);
    });

    // Evento de filtro
    document.getElementById('filter').addEventListener('change', function() {
        filterData(document.getElementById('search').value, this.value);
    });
});

async function loadData() {
    const passwords = await loadFromSupabase('passwords');
    const nomenclatures = await loadFromSupabase('nomenclatures');
    const companies = await loadFromSupabase('companies');

    localStorage.setItem('passwords', JSON.stringify(passwords));
    localStorage.setItem('nomenclatures', JSON.stringify(nomenclatures));
    localStorage.setItem('companies', JSON.stringify(companies));

    updatePasswordsTable();
    updateNomenclaturesTable();
    populateCompanySelect(document.getElementById('passwordForm').querySelector('#companySelect'));
    populateCompanySelect(document.getElementById('nomenclatureForm').querySelector('#nomenclatureCompanySelect'));
}

async function loadFromSupabase(tableName) {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.error('Error loading data from Supabase:', error);
        return [];
    }
    return data;
}

async function addPassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('passwordInput').value;
    const platform = document.getElementById('platform').value;
    const company = document.getElementById('companySelect').value;

    const { data, error } = await supabase.from('passwords').insert([{ email, password, platform, company }]);
    if (error) {
        console.error('Error adding password:', error);
        alert('Erro ao adicionar senha');
    } else {
        loadData();
        document.getElementById('passwordPopup').style.display = 'none';
    }
}

async function addNomenclature() {
    const abbreviation = document.getElementById('abbreviation').value;
    const meaning = document.getElementById('meaning').value;
    const company = document.getElementById('nomenclatureCompanySelect').value;

    const { data, error } = await supabase.from('nomenclatures').insert([{ abbreviation, meaning, company }]);
    if (error) {
        console.error('Error adding nomenclature:', error);
        alert('Erro ao adicionar nomenclatura');
    } else {
        loadData();
        document.getElementById('nomenclaturePopup').style.display = 'none';
    }
}

async function addCompany() {
    const companyName = document.getElementById('companyName').value;
    const companyColor = document.getElementById('companyColor').value;

    const { data, error } = await supabase.from('companies').insert([{ name: companyName, color: companyColor }]);
    if (error) {
        console.error('Error adding company:', error);
        alert('Erro ao adicionar empresa');
    } else {
        loadData();
        document.getElementById('companyPopup').style.display = 'none';
    }
}

function updatePasswordsTable() {
    const passwordsTable = document.getElementById('passwordsTable');
    passwordsTable.innerHTML = '';

    const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    passwords.forEach((password, index) => {
        const card = createCard(password, 'password', index);
        passwordsTable.appendChild(card);
    });
}

function updateNomenclaturesTable() {
    const nomenclaturesTable = document.getElementById('nomenclaturesTable');
    nomenclaturesTable.innerHTML = '';

    const nomenclatures = JSON.parse(localStorage.getItem('nomenclatures')) || [];
    nomenclatures.forEach((nomenclature, index) => {
        const card = createCard(nomenclature, 'nomenclature', index);
        nomenclaturesTable.appendChild(card);
    });
}

function createCard(data, type, index) {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = type === 'password' ? data.email : data.abbreviation;
    card.appendChild(title);

    const content = document.createElement('p');
    content.textContent = type === 'password' ? `Senha: ${data.password}` : `Significado: ${data.meaning}`;
    card.appendChild(content);

    const tags = document.createElement('div');
    tags.className = 'tags';
    const tag = document.createElement('span');
    tag.textContent = data.company;
    tags.appendChild(tag);
    card.appendChild(tags);

    const companyDot = document.createElement('span');
    companyDot.className = 'company-dot';
    const company = JSON.parse(localStorage.getItem('companies')).find(c => c.name === data.company);
    companyDot.style.backgroundColor = company ? company.color : '#000';
    card.appendChild(companyDot);

    const companyName = document.createElement('span');
    companyName.textContent = data.company;
    card.appendChild(companyName);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', function() {
        editItem(card, data, type, index);
    });
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.addEventListener('click', function() {
        deleteItem(type, index);
    });
    actions.appendChild(deleteBtn);

    card.appendChild(actions);

    return card;
}

async function editItem(card, data, type, index) {
    const title = card.querySelector('h3');
    const content = card.querySelector('p');
    const tags = card.querySelector('.tags');
    const companyDot = card.querySelector('.company-dot');
    const companyName = card.querySelector('span:last-child');
    const actions = card.querySelector('.actions');

    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <input type="text" id="editTitle" value="${title.textContent}" required>
        <input type="text" id="editContent" value="${content.textContent.split(': ')[1]}" required>
        <select id="editCompany" required>
            <!-- Aqui serão adicionadas as empresas -->
        </select>
        <button type="submit" class="save">Salvar</button>
        <button type="button" class="cancel">Cancelar</button>
    `;

    populateCompanySelect(editForm.querySelector('#editCompany'));

    actions.innerHTML = '';
    card.appendChild(editForm);

    editForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const newTitle = document.getElementById('editTitle').value;
        const newContent = document.getElementById('editContent').value;
        const newCompany = document.getElementById('editCompany').value;

        if (type === 'password') {
            data.email = newTitle;
            data.password = newContent;
        } else {
            data.abbreviation = newTitle;
            data.meaning = newContent;
        }

        data.company = newCompany;

        const { error } = await supabase.from(type + 's').update(data).eq('id', data.id);
        if (error) {
            console.error('Error updating item:', error);
            alert('Erro ao editar item');
        } else {
            loadData();
        }
    });

    editForm.querySelector('.cancel').addEventListener('click', function() {
        card.innerHTML = '';
        card.appendChild(title);
        card.appendChild(content);
        card.appendChild(tags);
        card.appendChild(companyDot);
        card.appendChild(companyName);
        card.appendChild(actions);
    });
}

function deleteItem(type, index) {
    const items = JSON.parse(localStorage.getItem(type + 's')) || [];
    const item = items[index];

    const { error } = await supabase.from(type + 's').delete().eq('id', item.id);
    if (error) {
        console.error('Error deleting item:', error);
        alert('Erro ao excluir item');
    } else {
        loadData();
    }
}

function filterData(query, filter) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const content = card.querySelector('p').textContent.toLowerCase();
        const company = card.querySelector('span:last-child').textContent.toLowerCase();

        let match = false;
        if (filter === 'all') {
            match = title.includes(query.toLowerCase()) || content.includes(query.toLowerCase()) || company.includes(query.toLowerCase());
        } else if (filter === 'email' || filter === 'abbreviation') {
            match = title.includes(query.toLowerCase());
        } else if (filter === 'company') {
            match = company.includes(query.toLowerCase());
        }

        card.style.display = match ? 'block' : 'none';
    });
}

function populateCompanySelect(selectElement) {
    selectElement.innerHTML = '';
    const companies = JSON.parse(localStorage.getItem('companies')) || [];
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.name;
        option.textContent = company.name;
        selectElement.appendChild(option);
    });
}

function exportData() {
    const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    const nomenclatures = JSON.parse(localStorage.getItem('nomenclatures')) || [];
    const companies = JSON.parse(localStorage.getItem('companies')) || [];
    const data = { passwords, nomenclatures, companies };
    const format = document.getElementById('exportFormat').value;

    if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'csv') {
        const csvContent = "data:text/csv;charset=utf-8," 
            + passwords.map(password => `${password.email},${password.password},${password.platform},${password.company}`).join("\n")
            + "\n"
            + nomenclatures.map(nomenclature => `${nomenclature.abbreviation},${nomenclature.meaning},${nomenclature.company}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (format === 'excel') {
        const workbook = XLSX.utils.book_new();
        const passwordsSheet = XLSX.utils.json_to_sheet(passwords);
        const nomenclaturesSheet = XLSX.utils.json_to_sheet(nomenclatures);
        XLSX.utils.book_append_sheet(workbook, passwordsSheet, 'Senhas');
        XLSX.utils.book_append_sheet(workbook, nomenclaturesSheet, 'Nomenclaturas');
        XLSX.writeFile(workbook, 'data.xlsx');
    }

    document.getElementById('exportDataPopup').style.display = 'none';
}

function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = JSON.parse(event.target.result);
            importToSupabase(data.passwords, 'passwords');
            importToSupabase(data.nomenclatures, 'nomenclatures');
            importToSupabase(data.companies, 'companies');
            loadData();
            document.getElementById('importDataPopup').style.display = 'none';
        };
        reader.readAsText(file);
    }
}

function importToSupabase(items, tableName) {
    items.forEach(item => {
        supabase.from(tableName).insert([item]);
    });
}
