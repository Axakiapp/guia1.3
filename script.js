<script type="module">
// === Inicialização Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore, collection, query, where, orderBy, getDocs, onSnapshot, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhvZXmusoB02FP6yA5w2RNwmdJadOr4Tg",
  authDomain: "guia1-23459.firebaseapp.com",
  projectId: "guia1-23459",
  storageBucket: "guia1-23459.firebasestorage.app",
  messagingSenderId: "862045707475",
  appId: "1:862045707475:web:612e498abd24c7bd548826"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Função auxiliar para imagem base64 ===
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    if(!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = ()=> resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// === CATEGORIAS ===
const categories = [
  "Alimentação","Beleza","Saúde","Serviços","Comércio","Automotivo","Profissionais Autônomos"
];
const catGrid = document.getElementById('catGrid');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const citySelect = document.getElementById('citySelect');
const cardsEl = document.getElementById('cards');

// Preenche o menu suspenso
categories.forEach(c=>{
  const opt = document.createElement('option');
  opt.value = c;
  opt.textContent = c;
  categorySelect.appendChild(opt);
});

// Cria os botões da grade de categorias
categories.forEach(c=>{
  const btn = document.createElement('button');
  btn.className='cat';
  btn.setAttribute('data-cat', c);
  btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg><span>${c}</span>`;
  btn.addEventListener('click', ()=>{
    categorySelect.value = c; // sincroniza com o menu
    doSearch();
  });
  catGrid.appendChild(btn);
});

// === Função para renderizar cards ===
function renderCards(data){
  cardsEl.innerHTML = '';
  if(!data || data.length===0){
    cardsEl.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }
  data.forEach(d=>{
    const div = document.createElement('div');
    div.className='card';
    const img = d.imagem || '';
    const thumb = img
      ? `<img class="thumb" src="${img}" alt="${d.nome}">`
      : `<div class="thumb" style="background:#f1f3f5;display:flex;align-items:center;justify-content:center;color:#777">Sem foto</div>`;
    const insta = d.instagram ? `<a href="${d.instagram}" target="_blank"><img src="assets/ig.png" width="20"></a>` : '';
    const whats = d.whatsapp ? `<a href="https://wa.me/${d.whatsapp.replace(/\D/g,'')}" target="_blank" class="btn">WhatsApp</a>` : '';
    const maps = d.endereco ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.endereco+', '+d.cidade)}" target="_blank" class="btn">Ver no mapa</a>` : '';

    div.innerHTML = `${thumb}
      <div class="card-body">
        <h4>${d.nome}</h4>
        <p>${d.descricao || ''}</p>
        <div class="meta">${d.categoria || ''} • ${d.cidade || ''}</div>
        <div class="icons">${whats} ${insta} ${maps}</div>
      </div>`;
    cardsEl.appendChild(div);
  });
}

// === Carrega anúncios ativos ===
function loadActive(){
  const q = query(collection(db, "cadastros"), where("status", "==", "active"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap)=>{
    const items = [];
    snap.forEach(doc=> items.push(doc.data()));
    renderCards(items);
  });
}
loadActive();

// === Busca e filtros ===
async function doSearch(){
  const qText = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  const city = citySelect.value;
  const ref = query(collection(db,"cadastros"), where("status","==","active"), orderBy("createdAt","desc"));
  const snap = await getDocs(ref);
  const results = [];
  snap.forEach(doc=>{
    const d = doc.data();
    const matchQ = qText === '' || (d.nome + ' ' + (d.descricao||'') + ' ' + (d.endereco||'')).toLowerCase().includes(qText);
    const matchCat = cat === '' || d.categoria === cat;
    const matchCity = city === '' || d.cidade === city;
    if(matchQ && matchCat && matchCity) results.push(d);
  });
  renderCards(results);
}

// === Eventos ===
document.getElementById('searchBtn').addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e=>{ if(e.key==='Enter') doSearch(); });
categorySelect.addEventListener('change', doSearch);
citySelect.addEventListener('change', doSearch);

// === “Ver todos” ===
document.getElementById('viewAll').addEventListener('click', ()=>{
  categorySelect.value = '';
  citySelect.value = '';
  searchInput.value = '';
  loadActive();
});

// === Envio do formulário ===
document.getElementById('adForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const nome = f_nome.value.trim();
  const endereco = f_endereco.value.trim();
  const bairro = f_bairro.value.trim();
  const cidade = f_cidade.value.trim();
  const telefone = f_telefone.value.trim();
  const whatsapp = f_whatsapp.value.trim();
  const email = f_email.value.trim();
  const descricao = f_descricao.value.trim();
  const imagemFile = f_imagem.files[0];

  if(!nome || !endereco || !bairro || !cidade){
    alert("Preencha os campos obrigatórios: nome, endereço, bairro e cidade.");
    return;
  }

  const imgBase64 = await fileToBase64(imagemFile);
  const data = {
    nome, endereco, bairro, cidade, telefone, whatsapp, email, descricao,
    imagem: imgBase64 || null,
    categoria: categorySelect.value || '',
    status: "pending",
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db,"cadastros"), data);
    alert("Cadastro enviado com sucesso! Aguarde aprovação.");
    e.target.reset();
  } catch (err) {
    alert("Erro ao enviar: " + err.message);
  }
});
</script>
