/* ==========================================
   FacBTP Admin — Dashboard
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
  if (!requireAuth()) return;

  // Date header
  document.getElementById('headerDate').textContent =
    new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  document.getElementById('sidebarFactbtp').href = 'https://factbtp.pro';
  document.getElementById('refreshBtn').addEventListener('click', chargerCommandes);

  // Filtres
  let filtreActif = 'all';
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      filtreActif = btn.dataset.filter;
      afficherTableau(filtreActif);
    });
  });

  let toutesCommandes = [];

  async function chargerCommandes() {
    document.getElementById('tableLoader').style.display = '';
    document.getElementById('ordersTable').style.display = 'none';
    document.getElementById('tableEmpty').style.display = 'none';

    try {
      const r = await fetch(API_URL + '/api/admin/documents', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (r.status === 401) { adminLogout(); return; }
      const data = await r.json();
      toutesCommandes = data.data || [];
      mettreAJourStats(toutesCommandes);
      afficherTableau(filtreActif);
    } catch(e) {
      document.getElementById('tableLoader').style.display = 'none';
      document.getElementById('tableEmpty').textContent = 'Erreur de chargement. Vérifiez votre connexion.';
      document.getElementById('tableEmpty').style.display = '';
    }
  }

  function mettreAJourStats(commandes) {
    const attente  = commandes.filter(c => c.statut === 'en_attente').length;
    const envoyes  = commandes.filter(c => c.statut === 'envoye').length;
    const revenu   = commandes.filter(c => c.statut === 'envoye').length * 1500;

    document.getElementById('statAttente').textContent = attente;
    document.getElementById('statEnvoyes').textContent = envoyes;
    document.getElementById('statTotal').textContent   = commandes.length;
    document.getElementById('statRevenu').textContent  = new Intl.NumberFormat('fr-FR').format(revenu) + ' FCFA';
  }

  function afficherTableau(filtre) {
    const liste = filtre === 'all'
      ? toutesCommandes
      : toutesCommandes.filter(c => c.statut === filtre);

    document.getElementById('tableLoader').style.display = 'none';

    if (!liste.length) {
      document.getElementById('tableEmpty').textContent = 'Aucune commande trouvée.';
      document.getElementById('tableEmpty').style.display = '';
      document.getElementById('ordersTable').style.display = 'none';
      return;
    }

    document.getElementById('tableEmpty').style.display = 'none';
    document.getElementById('ordersTable').style.display = '';

    const tbody = document.getElementById('ordersBody');
    tbody.innerHTML = liste.map(function(c) {
      const date    = new Date(c.created_at).toLocaleDateString('fr-FR');
      const statut  = c.statut === 'envoye'
        ? '<span class="badge badge--sent">✅ Envoyé</span>'
        : '<span class="badge badge--wait">⏳ En attente</span>';
      const montant = c.total_ttc
        ? new Intl.NumberFormat('fr-FR').format(Math.round(c.total_ttc)) + ' ' + (c.devise || 'FCFA')
        : '1 500 FCFA';
      const actionBtn = c.statut === 'envoye'
        ? '<button class="action-btn action-btn--sent" disabled>✓ Traité</button>'
        : `<button class="action-btn" data-id="${c.id}">📋 Ouvrir</button>`;

      return `<tr data-id="${c.id}">
        <td>${date}</td>
        <td>${formatType(c.type)}</td>
        <td>${c.numero || '—'}</td>
        <td title="${c.nom_entreprise || ''}">${c.nom_entreprise || '—'}</td>
        <td title="${c.email_client || ''}">${c.email_client || '—'}</td>
        <td>${c.telephone_wave || c.telephone || '—'}</td>
        <td style="font-weight:600">${montant}</td>
        <td>${statut}</td>
        <td>${actionBtn}</td>
      </tr>`;
    }).join('');

    // Clic sur ligne → ouvrir document
    tbody.querySelectorAll('tr').forEach(function(row) {
      row.addEventListener('click', function() {
        window.location.href = 'document.html?id=' + row.dataset.id;
      });
    });

    // Clic bouton action (stopper propagation)
    tbody.querySelectorAll('.action-btn:not([disabled])').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = 'document.html?id=' + btn.dataset.id;
      });
    });
  }

  function formatType(type) {
    const map = { devis: '📋 Devis', facture: '🧾 Facture', bc: '🛒 Bon de cmd' };
    return map[type] || type || '—';
  }

  chargerCommandes();
});
