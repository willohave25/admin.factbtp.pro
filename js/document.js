/* ==========================================
   FacBTP Admin — Détail document + envoi email
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
  if (!requireAuth()) return;

  const params = new URLSearchParams(window.location.search);
  const docId  = params.get('id');
  if (!docId) { window.location.href = 'dashboard.html'; return; }

  let docData = null;

  async function chargerDocument() {
    try {
      const r = await fetch(API_URL + '/api/admin/documents/' + docId, {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (r.status === 401) { adminLogout(); return; }
      const data = await r.json();
      docData = data.data;
      afficherDocument(docData);
    } catch(e) {
      document.getElementById('docLoader').innerHTML = '❌ Erreur de chargement.';
    }
  }

  function afficherDocument(doc) {
    document.getElementById('docLoader').style.display = 'none';
    document.getElementById('docPreview').style.display = '';
    document.getElementById('docInfoBar').style.display = 'flex';

    // Header
    const LABELS = { devis:'Devis', facture:'Facture', bc:'Bon de commande' };
    document.getElementById('docTitle').textContent =
      (LABELS[doc.type] || doc.type) + ' N°' + (doc.numero || '—');
    document.getElementById('docMeta').textContent =
      new Date(doc.created_at).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    // Info bar
    document.getElementById('infoEnt').textContent     = doc.nom_entreprise || '—';
    document.getElementById('infoEmail').textContent   = doc.email_client   || '—';
    document.getElementById('infoTelWave').textContent = doc.telephone_wave || doc.telephone || '—';
    document.getElementById('infoMontant').textContent =
      (doc.total_ttc ? new Intl.NumberFormat('fr-FR').format(Math.round(doc.total_ttc)) : '1 500') +
      ' ' + (doc.devise || 'FCFA');

    const statutEl = document.getElementById('infoStatut');
    if (doc.statut === 'envoye') {
      statutEl.innerHTML = '<span class="badge badge--sent">✅ Envoyé</span>';
      document.getElementById('btnSend').textContent = '✓ Déjà envoyé';
      document.getElementById('btnSend').disabled = true;
    } else {
      statutEl.innerHTML = '<span class="badge badge--wait">⏳ En attente</span>';
      document.getElementById('btnSend').disabled = false;
    }

    // Rendu du document avec le bon template
    const lignes = parseJsonSafe(doc.lignes) || [];
    const d = {
      nomEnt:   doc.nom_entreprise || '',
      adresse:  doc.adresse        || '',
      tel:      doc.telephone      || '',
      email:    doc.email_entreprise || '',
      rccm:     doc.rccm           || '',
      nomCli:   doc.nom_client     || '',
      adrCli:   doc.adresse_client || '',
      telCli:   doc.telephone_client || '',
      emailCli: doc.email_client   || '',
      num:      doc.numero         || '',
      date:     formatDate(doc.date_document),
      ech:      formatDate(doc.date_echeance),
      notes:    doc.notes          || '',
      lignes:   lignes,
      sousTotal: doc.sous_total    || 0,
      tva:      doc.montant_tva    || 0,
      ttc:      doc.total_ttc      || 0,
      devise:   doc.devise         || 'FCFA',
      tvaInfo:  { taux: doc.taux_tva || 18, pays: getPays(doc.code_pays) },
      appliquerTva: doc.appliquer_tva !== false,
      logoDataUrl:       null,
      signatureDataUrl:  null,
    };

    const templateId = doc.template_id || 'moderne-minimaliste';
    const html = renderTemplate(templateId, d, doc.type || 'devis');
    document.getElementById('docPreview').innerHTML = html;
  }

  // Bouton imprimer
  document.getElementById('btnPrint').addEventListener('click', function() {
    const html = document.getElementById('docPreview').innerHTML;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>body{margin:0;background:#fff}@media print{@page{size:A4;margin:0}body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style>
    </head><body>${html}
    <script>window.onload=function(){window.print();setTimeout(function(){window.close()},600)}<\/script>
    </body></html>`);
    w.document.close();
  });

  // Bouton envoyer
  document.getElementById('btnSend').addEventListener('click', async function() {
    if (!docData) return;
    const btn = this;
    btn.disabled = true;
    btn.textContent = '⏳ Envoi en cours...';

    try {
      const r = await fetch(API_URL + '/api/admin/send/' + docId, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
          emailClient:  docData.email_client,
          nomClient:    docData.nom_client,
          nomEntreprise:docData.nom_entreprise,
          type:         docData.type,
          numero:       docData.numero,
          totalTtc:     docData.total_ttc,
          devise:       docData.devise || 'FCFA',
        })
      });

      if (r.status === 401) { adminLogout(); return; }
      const data = await r.json();

      if (data.success) {
        document.getElementById('sendSuccess').style.display = '';
        document.getElementById('infoStatut').innerHTML = '<span class="badge badge--sent">✅ Envoyé</span>';
        btn.textContent = '✓ Document envoyé';
      } else {
        throw new Error(data.error || 'Erreur envoi');
      }
    } catch(e) {
      btn.disabled = false;
      btn.textContent = '📧 Envoyer au client';
      alert('Erreur : ' + e.message);
    }
  });

  // Helpers
  function parseJsonSafe(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  }

  function formatDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString('fr-FR');
  }

  function getPays(code) {
    const map = {
      CI:"Côte d'Ivoire",SN:"Sénégal",CM:"Cameroun",ML:"Mali",BF:"Burkina Faso",
      TG:"Togo",BJ:"Bénin",NE:"Niger",GN:"Guinée",GA:"Gabon",CG:"Congo",
      MG:"Madagascar",KM:"Comores",DJ:"Djibouti",FR:"France",BE:"Belgique"
    };
    return map[code] || code || "Afrique";
  }

  chargerDocument();
});
