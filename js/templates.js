/* ==========================================
   FacBTP Admin — Renderers templates partagés
   W2K-Digital 2025
   ========================================== */

function formaterMontant(v) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(v || 0));
}

function escHtml(t) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(t || ''));
  return d.innerHTML;
}

function getLbl(type) {
  const map = { devis:'Devis', facture:'Facture', bc:'Bon de commande' };
  return map[type] || 'Document';
}

function logoBlock(d, color) {
  if (d.logoDataUrl) return `<img src="${d.logoDataUrl}" alt="Logo" style="max-height:56px;max-width:150px;object-fit:contain">`;
  return `<div style="font-weight:800;font-size:1.1rem;letter-spacing:1px;color:${color||'#fff'}">${d.nomEnt||'MON ENTREPRISE'}</div>`;
}

function sigBlock(d) {
  return d.signatureDataUrl
    ? `<img src="${d.signatureDataUrl}" alt="Signature" style="max-height:48px;max-width:120px;display:block;margin-bottom:4px">`
    : '<div style="height:40px;border-bottom:1px solid #ccc;margin-bottom:4px"></div>';
}

function lignesRows(d) {
  if (!d.lignes || !d.lignes.length)
    return `<tr><td colspan="5" style="text-align:center;padding:12px;color:#9ca3af">Aucune prestation</td></tr>`;
  return d.lignes.map((l, i) => `
    <tr style="${i%2===0?'background:rgba(0,0,0,0.02)':''}">
      <td style="padding:8px 10px">${escHtml(l.desc)}</td>
      <td style="padding:8px;text-align:center">${l.qty}</td>
      <td style="padding:8px;text-align:center">${l.unite}</td>
      <td style="padding:8px;text-align:right">${formaterMontant(l.prixUnitaire || l.prix_unitaire)}</td>
      <td style="padding:8px;text-align:right;font-weight:600">${formaterMontant(l.total)}</td>
    </tr>`).join('');
}

function totauxBlock(d, accentColor, textColor) {
  return `
    <div style="display:flex;justify-content:flex-end;margin-top:16px">
      <table style="min-width:260px;border-collapse:collapse;font-size:13px">
        <tr><td style="padding:5px 12px;color:#666">Sous-total HT</td><td style="padding:5px 12px;text-align:right">${formaterMontant(d.sousTotal)} ${d.devise}</td></tr>
        ${d.appliquerTva!==false?`<tr><td style="padding:5px 12px;color:#666">TVA (${d.tvaInfo.taux}%)</td><td style="padding:5px 12px;text-align:right">${formaterMontant(d.tva)} ${d.devise}</td></tr>`:''}
        <tr style="background:${accentColor};color:${textColor||'#fff'}">
          <td style="padding:8px 12px;font-weight:700">TOTAL TTC</td>
          <td style="padding:8px 12px;text-align:right;font-weight:700">${formaterMontant(d.ttc)} ${d.devise}</td>
        </tr>
      </table>
    </div>`;
}

function notesBlock(d) {
  if (!d.notes) return '';
  return `<div style="margin-top:16px;padding:10px 14px;background:#f8f9fa;border-left:3px solid #e5e7eb;font-size:12px;color:#555">
    <strong>Notes :</strong> ${d.notes.replace(/\n/g,'<br>')}
  </div>`;
}

// =============================================
// DISPATCH
// =============================================
function renderTemplate(templateId, d, type) {
  const lbl = getLbl(type);
  const renderers = {
    'moderne-minimaliste':   () => renderModerne(d, lbl),
    'professionnel-premium': () => renderPremium(d, lbl),
    'classique-btp':         () => renderClassique(d, lbl),
    'corporate-formel':      () => renderCorporate(d, lbl),
    'elegant-sobre':         () => renderElegant(d, lbl),
    'artisan-traditionnel':  () => renderArtisan(d, lbl),
    'colore-dynamique':      () => renderColore(d, lbl),
    'startup-moderne':       () => renderStartup(d, lbl),
    'technique-ingenieur':   () => renderTechnique(d, lbl),
    'creatif-unique':        () => renderCreatif(d, lbl),
  };
  return (renderers[templateId] || renderers['moderne-minimaliste'])();
}

// =============================================
// TEMPLATE 1 : MODERNE MINIMALISTE
// =============================================
function renderModerne(d, lbl) {
  return `<style>
    .t1{font-family:Inter,Arial,sans-serif;color:#1a1a2e;background:#fff;font-size:12px;line-height:1.5}
    .t1-head{background:#111827;color:#fff;padding:28px 32px;position:relative;overflow:hidden;min-height:110px}
    .t1-head::after{content:'';position:absolute;top:0;right:0;width:0;height:0;border-style:solid;border-width:110px 110px 0 0;border-color:#0EA5E9 transparent transparent transparent}
    .t1-head::before{content:'';position:absolute;top:0;right:60px;width:0;height:0;border-style:solid;border-width:110px 60px 0 0;border-color:#1d4ed8 transparent transparent transparent}
    .t1-head-inner{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:1}
    .t1-doctype{background:#0EA5E9;color:#fff;font-size:11px;font-weight:700;letter-spacing:2px;padding:4px 12px;margin-bottom:6px;display:inline-block}
    .t1-body{padding:24px 32px}
    .t1-infos{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #111827}
    .t1-bloc h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#0EA5E9;margin:0 0 6px;font-weight:700}
    .t1-bloc p{margin:0;font-size:12px;color:#374151;line-height:1.6}
    .t1-table{width:100%;border-collapse:collapse}
    .t1-table thead tr{background:#111827;color:#fff}
    .t1-table thead th{padding:9px 10px;text-align:left;font-size:10px;letter-spacing:1px;text-transform:uppercase;font-weight:600}
    .t1-table thead th:nth-child(n+2){text-align:right}
    .t1-table thead th:nth-child(2),.t1-table thead th:nth-child(3){text-align:center}
    .t1-table tbody tr:nth-child(even){background:#f8fafc}
    .t1-table tbody td{padding:8px 10px;border-bottom:1px solid #e5e7eb;font-size:12px}
    .t1-foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px;padding-top:16px;border-top:3px solid #0EA5E9}
    .t1-footer-bar{background:#111827;color:#9ca3af;font-size:10px;padding:10px 32px;display:flex;justify-content:space-between;margin-top:20px}
  </style>
  <div class="t1">
    <div class="t1-head">
      <div class="t1-head-inner">
        <div>${logoBlock(d,'#fff')}<div style="color:#9ca3af;font-size:11px;margin-top:6px">${d.adresse}</div></div>
        <div style="text-align:right">
          <div class="t1-doctype">${lbl.toUpperCase()}</div>
          <div style="font-size:13px;color:#93c5fd">N° ${d.num||'—'}</div>
          <div style="font-size:11px;color:#d1d5db">Date : ${d.date||'—'}</div>
          ${d.ech?`<div style="font-size:11px;color:#d1d5db">Validité : ${d.ech}</div>`:''}
        </div>
      </div>
    </div>
    <div class="t1-body">
      <div class="t1-infos">
        <div class="t1-bloc"><h4>Émetteur</h4><p>${d.nomEnt}<br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t1-bloc"><h4>Destinataire</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t1-table">
        <thead><tr><th style="width:40%">Description</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#0EA5E9','#fff')}${notesBlock(d)}
      <div class="t1-foot">
        <div>${sigBlock(d)}<span style="font-size:10px;color:#9ca3af">Signature et cachet</span></div>
        <div style="text-align:right;font-size:10px;color:#9ca3af">${d.tvaInfo.pays} — TVA ${d.tvaInfo.taux}%</div>
      </div>
    </div>
    <div class="t1-footer-bar"><span>${d.nomEnt}</span><span>${d.tel}</span><span>${d.email}</span></div>
  </div>`;
}

function renderPremium(d, lbl) {
  return `<style>
    .t2{font-family:Georgia,serif;color:#1a1a2e;background:#fff;font-size:12px;line-height:1.6}
    .t2-head{background:linear-gradient(135deg,#0F172A 0%,#1e293b 100%);padding:30px 36px 50px;position:relative;overflow:visible}
    .t2-wave{position:absolute;bottom:-1px;left:0;width:100%;height:40px}
    .t2-head-inner{display:flex;justify-content:space-between;align-items:flex-start}
    .t2-gold{color:#D4AF37;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:8px}
    .t2-body{padding:20px 36px 28px}
    .t2-infos{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px}
    .t2-bloc{padding:14px;background:#f8f7f4;border-left:3px solid #D4AF37}
    .t2-bloc h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#D4AF37;margin:0 0 8px;font-family:Inter,Arial,sans-serif;font-weight:700}
    .t2-bloc p{margin:0;font-size:12px;color:#374151;font-family:Inter,Arial,sans-serif;line-height:1.6}
    .t2-table{width:100%;border-collapse:collapse}
    .t2-table thead tr{border-bottom:2px solid #D4AF37}
    .t2-table thead th{padding:10px 12px;text-align:left;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#0F172A;font-family:Inter,Arial,sans-serif;font-weight:700}
    .t2-table thead th:nth-child(n+2){text-align:right}
    .t2-table thead th:nth-child(2),.t2-table thead th:nth-child(3){text-align:center}
    .t2-table tbody td{padding:9px 12px;border-bottom:1px solid #e8e4d9;font-size:12px;font-family:Inter,Arial,sans-serif}
    .t2-footer-bar{background:#0F172A;padding:14px 36px;display:flex;justify-content:space-around;margin-top:16px}
    .t2-footer-item{text-align:center;color:#9ca3af;font-size:10px;font-family:Inter,Arial,sans-serif}
    .t2-footer-item span{display:block;color:#D4AF37;font-size:9px;letter-spacing:1px;text-transform:uppercase;margin-bottom:2px}
  </style>
  <div class="t2">
    <div class="t2-head">
      <div class="t2-head-inner">
        <div>${logoBlock(d,'#D4AF37')}<div style="color:#94a3b8;font-size:11px;margin-top:8px;font-family:Inter,Arial,sans-serif">${d.adresse}</div></div>
        <div style="text-align:right">
          <div class="t2-gold">${lbl.toUpperCase()}</div>
          <div style="color:#fff;font-size:20px;font-weight:700;font-family:Inter,Arial,sans-serif">N° ${d.num||'—'}</div>
          <div style="color:#94a3b8;font-size:11px;margin-top:4px;font-family:Inter,Arial,sans-serif">Date : ${d.date||'—'}</div>
          ${d.ech?`<div style="color:#94a3b8;font-size:11px;font-family:Inter,Arial,sans-serif">Validité : ${d.ech}</div>`:''}
        </div>
      </div>
      <svg class="t2-wave" viewBox="0 0 800 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 C200,40 600,0 800,30 L800,40 L0,40 Z" fill="#D4AF37" opacity="0.6"/>
        <path d="M0,10 C300,40 500,10 800,20 L800,40 L0,40 Z" fill="#fff"/>
      </svg>
    </div>
    <div class="t2-body">
      <div class="t2-infos">
        <div class="t2-bloc"><h4>Émetteur</h4><p><strong>${d.nomEnt}</strong><br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t2-bloc"><h4>Destinataire</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t2-table">
        <thead><tr><th style="width:40%">Description</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#0F172A','#D4AF37')}${notesBlock(d)}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px">
        <div>${sigBlock(d)}<span style="font-size:10px;color:#9ca3af;font-family:Inter,Arial,sans-serif">Signature et cachet</span></div>
        <div style="text-align:right;font-size:10px;color:#9ca3af;font-family:Inter,Arial,sans-serif">${d.tvaInfo.pays} — TVA ${d.tvaInfo.taux}%</div>
      </div>
    </div>
    <div class="t2-footer-bar">
      <div class="t2-footer-item"><span>Téléphone</span>${d.tel||'—'}</div>
      <div class="t2-footer-item"><span>Email</span>${d.email||'—'}</div>
      <div class="t2-footer-item"><span>RCCM</span>${d.rccm||'—'}</div>
      <div class="t2-footer-item"><span>Pays</span>${d.tvaInfo.pays}</div>
    </div>
  </div>`;
}

function renderClassique(d, lbl) {
  return `<style>
    .t3{font-family:Inter,Arial,sans-serif;color:#111;background:#fff;font-size:12px;line-height:1.5}
    .t3-head{background:#111827;position:relative;overflow:hidden}
    .t3-head-top{display:flex;justify-content:space-between;align-items:center;padding:20px 28px}
    .t3-head-diag{height:28px;background:#F59E0B;clip-path:polygon(0 0,100% 0,95% 100%,0 100%)}
    .t3-body{padding:20px 28px}
    .t3-title{font-size:18px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#111827}
    .t3-subtitle{color:#F59E0B;font-size:10px;letter-spacing:2px;font-weight:700;margin-bottom:16px}
    .t3-infos{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
    .t3-bloc h4{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px;color:#111827}
    .t3-bloc p{margin:0;font-size:11.5px;color:#374151;line-height:1.6}
    .t3-table{width:100%;border-collapse:collapse}
    .t3-table thead tr{background:#F59E0B}
    .t3-table thead th{padding:9px 10px;text-align:left;font-size:10px;font-weight:700;color:#111}
    .t3-table thead th:nth-child(n+2){text-align:right}
    .t3-table thead th:nth-child(2),.t3-table thead th:nth-child(3){text-align:center}
    .t3-table tbody td{padding:8px 10px;border-bottom:1px solid #f3f4f6;font-size:12px}
    .t3-foot-bar{background:#111827;margin-top:20px;padding:12px 28px;display:flex;justify-content:space-between}
    .t3-foot-item{color:#9ca3af;font-size:10px}
  </style>
  <div class="t3">
    <div class="t3-head">
      <div class="t3-head-top">
        ${logoBlock(d,'#fff')}
        <div style="text-align:right;color:#fff">
          <div style="font-size:10px;letter-spacing:2px;color:#F59E0B;font-weight:700;margin-bottom:4px">${lbl.toUpperCase()}</div>
          <div style="font-size:13px;color:#d1d5db">N° ${d.num||'—'}</div>
          <div style="font-size:11px;color:#9ca3af">Date : ${d.date||'—'}</div>
        </div>
      </div>
      <div class="t3-head-diag"></div>
    </div>
    <div class="t3-body">
      <div class="t3-title">Construction ${lbl}</div>
      <div class="t3-subtitle">Document BTP Professionnel${d.ech?' · Validité : '+d.ech:''}</div>
      <div class="t3-infos">
        <div class="t3-bloc"><h4>Émetteur</h4><p><strong>${d.nomEnt}</strong><br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t3-bloc"><h4>Client</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t3-table">
        <thead><tr><th style="width:40%">Désignation</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#F59E0B','#111')}${notesBlock(d)}
      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <div style="text-align:center">${sigBlock(d)}<span style="font-size:10px;color:#9ca3af">Signature et cachet</span></div>
      </div>
    </div>
    <div class="t3-foot-bar">
      <span class="t3-foot-item">☎ ${d.tel||'—'}</span>
      <span class="t3-foot-item">@ ${d.email||'—'}</span>
      <span class="t3-foot-item">📍 ${d.adresse||'—'}</span>
    </div>
  </div>`;
}

function renderCorporate(d, lbl) {
  return `<style>
    .t4{font-family:Inter,Arial,sans-serif;color:#1f2937;background:#fff;font-size:12px;line-height:1.5}
    .t4-head{background:#1E3A5F;padding:0;position:relative;min-height:100px}
    .t4-head-left{position:absolute;left:0;top:0;bottom:0;width:55%;background:#1E3A5F;display:flex;flex-direction:column;justify-content:center;padding:20px 28px;clip-path:polygon(0 0,100% 0,88% 100%,0 100%)}
    .t4-head-right{position:absolute;right:0;top:0;bottom:0;width:48%;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;padding:20px 24px}
    .t4-badge{background:#2563EB;color:#fff;font-size:10px;font-weight:700;letter-spacing:2px;padding:5px 14px;margin-bottom:8px;display:inline-block}
    .t4-body{padding:22px 28px}
    .t4-infos{display:grid;grid-template-columns:1fr 1fr;border:1px solid #e5e7eb;margin-bottom:20px}
    .t4-bloc{padding:14px 16px}
    .t4-bloc:first-child{border-right:1px solid #e5e7eb}
    .t4-bloc h4{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;color:#2563EB}
    .t4-bloc p{margin:0;font-size:12px;color:#374151;line-height:1.6}
    .t4-table{width:100%;border-collapse:collapse}
    .t4-table thead tr{background:#1E3A5F;color:#fff}
    .t4-table thead th{padding:9px 12px;font-size:10px;font-weight:700;text-align:left}
    .t4-table thead th:nth-child(n+2){text-align:right}
    .t4-table thead th:nth-child(2),.t4-table thead th:nth-child(3){text-align:center}
    .t4-table tbody td{padding:8px 12px;border-bottom:1px solid #e5e7eb}
    .t4-foot-bar{margin-top:20px;background:#1E3A5F;padding:10px 28px;display:flex;justify-content:space-between}
    .t4-foot-item{color:#93c5fd;font-size:10px}
  </style>
  <div class="t4">
    <div class="t4-head" style="height:100px">
      <div class="t4-head-left">
        ${logoBlock(d,'#fff')}
        <div style="color:#93c5fd;font-size:10px;margin-top:6px">${d.adresse}</div>
      </div>
      <div class="t4-head-right">
        <div class="t4-badge">${lbl.toUpperCase()}</div>
        <div style="color:#1E3A5F;font-size:14px;font-weight:700">N° ${d.num||'—'}</div>
        <div style="color:#6b7280;font-size:11px">Date : ${d.date||'—'}</div>
        ${d.ech?`<div style="color:#6b7280;font-size:11px">Validité : ${d.ech}</div>`:''}
      </div>
    </div>
    <div class="t4-body">
      <div class="t4-infos">
        <div class="t4-bloc"><h4>Émetteur</h4><p><strong>${d.nomEnt}</strong><br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t4-bloc"><h4>Destinataire</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t4-table">
        <thead><tr><th style="width:40%">Description</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#1E3A5F','#fff')}${notesBlock(d)}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px">
        <div style="font-size:10px;color:#9ca3af">${d.tvaInfo.pays} — TVA ${d.tvaInfo.taux}%</div>
        <div style="text-align:center">${sigBlock(d)}<span style="font-size:10px;color:#9ca3af">Signature</span></div>
      </div>
    </div>
    <div class="t4-foot-bar">
      <span class="t4-foot-item">${d.tel||''}</span>
      <span class="t4-foot-item">${d.email||''}</span>
      <span class="t4-foot-item">${d.rccm?'RCCM : '+d.rccm:d.adresse}</span>
    </div>
  </div>`;
}

function renderElegant(d, lbl) {
  return `<style>
    .t5{font-family:'Palatino Linotype',Georgia,serif;color:#1a1a1a;background:#fff;font-size:12px;line-height:1.6;padding:24px}
    .t5-border{border:1px solid #1a1a1a;padding:20px;position:relative}
    .t5-border::before{content:'';position:absolute;top:4px;left:4px;right:4px;bottom:4px;border:1px solid #ccc;pointer-events:none}
    .t5-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #1a1a1a}
    .t5-title{font-size:22px;font-weight:400;letter-spacing:4px;text-transform:uppercase;text-align:center;margin-bottom:4px}
    .t5-subtitle{text-align:center;font-size:9px;letter-spacing:6px;text-transform:uppercase;color:#666;margin-bottom:16px}
    .t5-hr{border:none;border-top:1px solid #1a1a1a;margin:0 40px 20px}
    .t5-infos{display:grid;grid-template-columns:1fr auto 1fr;margin-bottom:20px}
    .t5-bloc h4{font-size:8px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;font-style:italic;color:#666}
    .t5-bloc p{margin:0;font-size:11.5px;line-height:1.7}
    .t5-divider{width:1px;background:#ccc;margin:0 20px}
    .t5-table{width:100%;border-collapse:collapse}
    .t5-table thead tr{border-top:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a}
    .t5-table thead th{padding:8px 10px;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:600;text-align:left;background:#f9f9f9}
    .t5-table thead th:nth-child(n+2){text-align:right}
    .t5-table thead th:nth-child(2),.t5-table thead th:nth-child(3){text-align:center}
    .t5-table tbody td{padding:8px 10px;border-bottom:1px dotted #ddd;font-size:12px}
    .t5-table tbody td:nth-child(n+2){text-align:right}
    .t5-table tbody td:nth-child(2),.t5-table tbody td:nth-child(3){text-align:center}
    .t5-foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid #1a1a1a}
  </style>
  <div class="t5">
    <div class="t5-border">
      <div class="t5-title">${lbl}</div>
      <div class="t5-subtitle">Document officiel</div>
      <hr class="t5-hr">
      <div class="t5-head">
        <div>${logoBlock(d,'#1a1a1a')}</div>
        <div style="text-align:right;font-size:11px;color:#444;line-height:2">
          N° ${d.num||'—'}<br>Date : ${d.date||'—'}<br>${d.ech?'Validité : '+d.ech:''}
        </div>
      </div>
      <div class="t5-infos">
        <div class="t5-bloc"><h4>Émetteur</h4><p>${d.nomEnt}<br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t5-divider"></div>
        <div class="t5-bloc"><h4>Destinataire</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t5-table">
        <thead><tr><th style="width:40%">Description</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#1a1a1a','#fff')}${notesBlock(d)}
      <div class="t5-foot">
        <div>${sigBlock(d)}<span style="font-size:10px;color:#9ca3af;font-style:italic">Signature et cachet</span></div>
        <div style="text-align:right;font-size:10px;color:#9ca3af">${d.tvaInfo.pays} — TVA ${d.tvaInfo.taux}%</div>
      </div>
    </div>
  </div>`;
}

function renderArtisan(d, lbl) {
  return `<style>
    .t6{font-family:'Palatino Linotype',Georgia,serif;color:#3d2b1f;background:#f5f0e8;font-size:12px;line-height:1.6;padding:24px}
    .t6-outer{border:4px double #8b5e3c;padding:20px;background:#fdf8f0;position:relative}
    .t6-corner{position:absolute;width:32px;height:32px;border-color:#8b5e3c}
    .t6-corner--tl{top:8px;left:8px;border-top:3px solid;border-left:3px solid}
    .t6-corner--tr{top:8px;right:8px;border-top:3px solid;border-right:3px solid}
    .t6-corner--bl{bottom:8px;left:8px;border-bottom:3px solid;border-left:3px solid}
    .t6-corner--br{bottom:8px;right:8px;border-bottom:3px solid;border-right:3px solid}
    .t6-head{text-align:center;padding:16px 0 20px;border-bottom:2px solid #8b5e3c;margin-bottom:20px}
    .t6-title{font-size:24px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#3d2b1f;margin-bottom:4px}
    .t6-meta{display:flex;justify-content:space-between;font-size:11px;color:#5c4033;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #c4a882}
    .t6-infos{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:18px}
    .t6-bloc{border:1px solid #c4a882;padding:12px 14px;background:#fefcf7}
    .t6-bloc h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#8b5e3c;margin:0 0 6px;font-style:italic}
    .t6-bloc p{margin:0;font-size:12px;line-height:1.7;color:#3d2b1f}
    .t6-table{width:100%;border-collapse:collapse}
    .t6-table thead tr{background:#8b5e3c;color:#fdf8f0}
    .t6-table thead th{padding:8px 10px;font-size:10px;letter-spacing:1px;font-weight:600;text-align:left}
    .t6-table thead th:nth-child(n+2){text-align:right}
    .t6-table thead th:nth-child(2),.t6-table thead th:nth-child(3){text-align:center}
    .t6-table tbody td{padding:8px 10px;border-bottom:1px solid #e8dcc8;font-size:12px}
    .t6-table tbody tr:nth-child(even){background:#fef9f2}
    .t6-foot{margin-top:16px;display:flex;justify-content:space-between;align-items:flex-end;padding-top:14px;border-top:2px solid #8b5e3c}
  </style>
  <div class="t6">
    <div class="t6-outer">
      <div class="t6-corner t6-corner--tl"></div><div class="t6-corner t6-corner--tr"></div>
      <div class="t6-corner t6-corner--bl"></div><div class="t6-corner t6-corner--br"></div>
      <div class="t6-head">
        <div style="color:#8b5e3c;font-size:20px;letter-spacing:8px;margin-bottom:8px">✦ ✦ ✦</div>
        ${logoBlock(d,'#3d2b1f')}
        <div class="t6-title" style="margin-top:10px">${lbl}</div>
        <div style="font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#8b5e3c;font-style:italic">Document officiel — ${d.tvaInfo.pays}</div>
      </div>
      <div class="t6-meta">
        <span>Réf. : <strong>${d.num||'—'}</strong></span>
        <span>Date : <strong>${d.date||'—'}</strong></span>
        ${d.ech?`<span>Validité : <strong>${d.ech}</strong></span>`:''}
      </div>
      <div class="t6-infos">
        <div class="t6-bloc"><h4>Émetteur</h4><p><strong>${d.nomEnt}</strong><br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t6-bloc"><h4>Client</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t6-table">
        <thead><tr><th style="width:40%">Désignation</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#8b5e3c','#fff')}${notesBlock(d)}
      <div class="t6-foot">
        <div style="font-size:10px;color:#8b5e3c">${d.tvaInfo.pays} — TVA ${d.tvaInfo.taux}%</div>
        <div style="text-align:center">${sigBlock(d)}<span style="font-size:10px;color:#8b5e3c;font-style:italic">Cachet et signature</span></div>
      </div>
      <div style="text-align:center;color:#8b5e3c;font-size:11px;letter-spacing:6px;margin-top:12px">✦ · · · ✦</div>
    </div>
  </div>`;
}

function renderColore(d, lbl) {
  return `<style>
    .t7{font-family:Inter,Arial,sans-serif;color:#1f2937;background:#fff;font-size:12px;line-height:1.5}
    .t7-head{position:relative;height:130px;overflow:hidden}
    .t7-tri-o{position:absolute;top:0;left:0;width:0;height:0;border-style:solid;border-width:130px 220px 0 0;border-color:#F97316 transparent transparent transparent}
    .t7-tri-t{position:absolute;top:0;right:0;width:0;height:0;border-style:solid;border-width:0 0 130px 280px;border-color:transparent transparent #0891B2 transparent}
    .t7-content{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:center;padding:20px 28px;z-index:10}
    .t7-body{padding:20px 28px}
    .t7-infos{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
    .t7-bloc{padding:12px 14px;border-top:3px solid}
    .t7-bloc--1{border-color:#F97316;background:#fff7ed}
    .t7-bloc--2{border-color:#0891B2;background:#ecfeff}
    .t7-bloc h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;font-weight:700}
    .t7-bloc--1 h4{color:#F97316}
    .t7-bloc--2 h4{color:#0891B2}
    .t7-bloc p{margin:0;font-size:11.5px;line-height:1.6;color:#374151}
    .t7-table{width:100%;border-collapse:collapse}
    .t7-table thead tr{background:linear-gradient(90deg,#F97316,#0891B2);color:#fff}
    .t7-table thead th{padding:9px 10px;font-size:10px;font-weight:700;text-align:left}
    .t7-table thead th:nth-child(n+2){text-align:right}
    .t7-table thead th:nth-child(2),.t7-table thead th:nth-child(3){text-align:center}
    .t7-table tbody td{padding:8px 10px;border-bottom:1px solid #f3f4f6}
    .t7-footer{background:linear-gradient(90deg,#F97316,#0891B2);margin-top:20px;padding:10px 28px;display:flex;justify-content:space-between}
    .t7-footer span{color:#fff;font-size:10px}
  </style>
  <div class="t7">
    <div class="t7-head">
      <div class="t7-tri-o"></div><div class="t7-tri-t"></div>
      <div class="t7-content">
        <div>${logoBlock(d,'#fff')}<div style="color:rgba(255,255,255,0.8);font-size:10px;margin-top:4px">${d.adresse}</div></div>
        <div style="text-align:right;color:#fff">
          <div style="font-size:11px;font-weight:700;letter-spacing:2px;opacity:0.9">${lbl.toUpperCase()}</div>
          <div style="font-size:15px;font-weight:800">N° ${d.num||'—'}</div>
          <div style="font-size:11px;opacity:0.8">Date : ${d.date||'—'}</div>
          ${d.ech?`<div style="font-size:11px;opacity:0.8">Validité : ${d.ech}</div>`:''}
        </div>
      </div>
    </div>
    <div class="t7-body">
      <div class="t7-infos">
        <div class="t7-bloc t7-bloc--1"><h4>Émetteur</h4><p><strong>${d.nomEnt}</strong><br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t7-bloc t7-bloc--2"><h4>Destinataire</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t7-table">
        <thead><tr><th style="width:40%">Description</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#F97316','#fff')}${notesBlock(d)}
      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <div style="text-align:center">${sigBlock(d)}<span style="font-size:10px;color:#9ca3af">Signature et cachet</span></div>
      </div>
    </div>
    <div class="t7-footer"><span>${d.tel||''}</span><span>${d.email||''}</span><span>${d.tvaInfo.pays}</span></div>
  </div>`;
}

function renderStartup(d, lbl) {
  return `<style>
    .t8{font-family:Inter,Arial,sans-serif;color:#1f2937;background:#fff;font-size:12px;line-height:1.5}
    .t8-head{display:grid;grid-template-columns:1fr 1fr;min-height:110px}
    .t8-left{background:#0D9488;padding:22px 24px;display:flex;flex-direction:column;justify-content:center;clip-path:polygon(0 0,100% 0,88% 100%,0 100%)}
    .t8-right{background:#FB7185;padding:22px 24px 22px 36px;display:flex;flex-direction:column;justify-content:center}
    .t8-body{padding:20px 26px}
    .t8-infos{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
    .t8-bloc{padding:12px 14px;background:#f9fafb;border-radius:6px;border-left:4px solid #0D9488}
    .t8-bloc:last-child{border-left-color:#FB7185}
    .t8-bloc h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;font-weight:700;color:#0D9488}
    .t8-bloc:last-child h4{color:#FB7185}
    .t8-bloc p{margin:0;font-size:12px;line-height:1.6;color:#374151}
    .t8-table{width:100%;border-collapse:collapse}
    .t8-table thead tr{background:#0D9488;color:#fff}
    .t8-table thead th{padding:9px 12px;font-size:10px;font-weight:700;text-align:left}
    .t8-table thead th:nth-child(n+2){text-align:right}
    .t8-table thead th:nth-child(2),.t8-table thead th:nth-child(3){text-align:center}
    .t8-table tbody td{padding:8px 12px;border-bottom:1px solid #f0fdfa}
    .t8-footer{background:#0D9488;padding:10px 26px;display:flex;justify-content:space-between;margin-top:16px}
    .t8-footer span{color:#ccfbf1;font-size:10px}
  </style>
  <div class="t8">
    <div class="t8-head">
      <div class="t8-left">
        <div style="font-size:18px;margin-bottom:8px">🏗</div>
        ${logoBlock(d,'#fff')}
        <div style="color:rgba(255,255,255,0.75);font-size:10px;margin-top:4px">${d.adresse}</div>
      </div>
      <div class="t8-right">
        <div style="color:rgba(255,255,255,0.8);font-size:10px;font-weight:700;letter-spacing:2px;margin-bottom:6px">${lbl.toUpperCase()}</div>
        <div style="color:#fff;font-size:18px;font-weight:800">N° ${d.num||'—'}</div>
        <div style="color:rgba(255,255,255,0.85);font-size:11px;margin-top:4px">Date : ${d.date||'—'}</div>
        ${d.ech?`<div style="color:rgba(255,255,255,0.85);font-size:11px">Validité : ${d.ech}</div>`:''}
      </div>
    </div>
    <div class="t8-body">
      <div class="t8-infos">
        <div class="t8-bloc"><h4>Émetteur</h4><p><strong>${d.nomEnt}</strong><br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t8-bloc"><h4>Destinataire</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t8-table">
        <thead><tr><th style="width:40%">Description</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#0D9488','#fff')}${notesBlock(d)}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px">
        <div style="font-size:10px;color:#9ca3af">${d.tvaInfo.pays} — TVA ${d.tvaInfo.taux}%</div>
        <div style="text-align:center">${sigBlock(d)}<span style="font-size:10px;color:#9ca3af">Signature</span></div>
      </div>
    </div>
    <div class="t8-footer"><span>${d.tel||''}</span><span>${d.email||''}</span><span>${d.tvaInfo.pays}</span></div>
  </div>`;
}

function renderTechnique(d, lbl) {
  return `<style>
    .t9{font-family:'Courier New',Courier,monospace;color:#111;background:#fff;font-size:11.5px;line-height:1.5}
    .t9-bar{background:#0D9488;height:8px}
    .t9-head{border:1px solid #ccc;border-top:none;padding:16px 24px;display:flex;justify-content:space-between;background:#f8fffe}
    .t9-title-block{border:2px solid #0D9488;padding:6px 14px;margin-bottom:8px;display:inline-block}
    .t9-title{font-size:16px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#0D9488}
    .t9-id-block{border:1px solid #0D9488;padding:8px 12px;min-width:180px;background:#fff}
    .t9-id-row{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:10px}
    .t9-id-label{color:#0D9488;font-weight:700}
    .t9-body{padding:16px 24px}
    .t9-section{border:1px solid #ccc;margin-bottom:14px}
    .t9-section-title{background:#0D9488;color:#fff;padding:4px 10px;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700}
    .t9-section-body{padding:10px 12px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .t9-fval{border-bottom:1px solid #ccc;padding-bottom:3px;display:block;color:#111;margin-top:4px}
    .t9-table{width:100%;border-collapse:collapse;border:1px solid #ccc}
    .t9-table thead tr{background:#0D9488;color:#fff}
    .t9-table thead th{padding:7px 10px;font-size:9px;font-weight:700;text-align:left;border:1px solid rgba(255,255,255,0.2)}
    .t9-table thead th:nth-child(n+2){text-align:right}
    .t9-table thead th:nth-child(2),.t9-table thead th:nth-child(3){text-align:center}
    .t9-table tbody td{padding:7px 10px;border:1px solid #e5e7eb;font-size:11px}
    .t9-total-row{background:#0D9488;color:#fff;padding:6px 10px;display:flex;justify-content:space-between;font-weight:700;margin-top:4px}
    .t9-bottombar{background:#0D9488;padding:6px 24px;display:flex;justify-content:space-between;font-size:9px;letter-spacing:1px;color:#fff;margin-top:16px}
  </style>
  <div class="t9">
    <div class="t9-bar"></div>
    <div class="t9-head">
      <div>
        <div class="t9-title-block">
          <div class="t9-title">${lbl}</div>
          <div style="font-size:9px;letter-spacing:4px;color:#666;margin-top:2px">Document BTP — Technique</div>
        </div>
        <div style="font-size:11px;color:#444;margin-top:6px">${logoBlock(d,'#0D9488')}</div>
      </div>
      <div class="t9-id-block">
        <div class="t9-id-row">
          <span class="t9-id-label">REF :</span><span>${d.num||'—'}</span>
          <span class="t9-id-label">DATE :</span><span>${d.date||'—'}</span>
          ${d.ech?`<span class="t9-id-label">VALID :</span><span>${d.ech}</span>`:''}
          <span class="t9-id-label">PAYS :</span><span>${d.tvaInfo.pays}</span>
        </div>
      </div>
    </div>
    <div class="t9-body">
      <div class="t9-section">
        <div class="t9-section-title">Identification des parties</div>
        <div class="t9-section-body">
          <div>
            <span style="font-size:9px;color:#0D9488;letter-spacing:1px;text-transform:uppercase;font-weight:700">Émetteur</span>
            <span class="t9-fval"><strong>${d.nomEnt}</strong></span>
            <span class="t9-fval">${d.adresse||'—'}</span>
            <span class="t9-fval">${d.tel||'—'}</span>
          </div>
          <div>
            <span style="font-size:9px;color:#0D9488;letter-spacing:1px;text-transform:uppercase;font-weight:700">Client</span>
            <span class="t9-fval"><strong>${d.nomCli||'—'}</strong></span>
            <span class="t9-fval">${d.adrCli||'—'}</span>
            <span class="t9-fval">${d.telCli||'—'}</span>
          </div>
        </div>
      </div>
      <table class="t9-table">
        <thead><tr><th style="width:38%">Désignation</th><th>Qté</th><th>Unité</th><th>P.U. HT</th><th>Montant HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;margin-top:10px">
        <div style="font-size:11px">
          <div style="display:grid;grid-template-columns:1fr auto;gap:2px 16px;max-width:260px">
            <span style="color:#666">Sous-total HT</span><span style="text-align:right">${formaterMontant(d.sousTotal)} ${d.devise}</span>
            ${d.appliquerTva!==false?`<span style="color:#666">TVA (${d.tvaInfo.taux}%)</span><span style="text-align:right">${formaterMontant(d.tva)} ${d.devise}</span>`:''}
          </div>
          <div class="t9-total-row" style="margin-top:6px"><span>TOTAL TTC</span><span>${formaterMontant(d.ttc)} ${d.devise}</span></div>
        </div>
      </div>
      ${notesBlock(d)}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px;padding-top:12px;border-top:2px solid #0D9488">
        <div style="font-size:10px;color:#666">TVA : ${d.tvaInfo.taux}% — ${d.tvaInfo.pays}</div>
        <div style="text-align:center">${sigBlock(d)}<span style="font-size:9px;color:#9ca3af;letter-spacing:1px;text-transform:uppercase">Signature</span></div>
      </div>
    </div>
    <div class="t9-bottombar">
      <span>${d.nomEnt}</span><span>${d.tel||''}</span><span>${d.email||''}</span><span>factbtp.pro</span>
    </div>
  </div>`;
}

function renderCreatif(d, lbl) {
  return `<style>
    .t10{font-family:Inter,Arial,sans-serif;color:#1f2937;background:#fff;font-size:12px;line-height:1.5}
    .t10-head{display:grid;grid-template-columns:55% 45%;min-height:120px}
    .t10-left{background:#7C3AED;padding:22px 28px;display:flex;flex-direction:column;justify-content:center;clip-path:polygon(0 0,100% 0,92% 100%,0 100%)}
    .t10-right{background:#06B6D4;padding:22px 20px 22px 32px;display:flex;flex-direction:column;justify-content:center}
    .t10-pill{background:rgba(255,255,255,0.2);color:#fff;font-size:9px;font-weight:700;letter-spacing:3px;padding:3px 10px;border-radius:20px;display:inline-block;margin-bottom:8px;text-transform:uppercase}
    .t10-body{padding:20px 28px}
    .t10-infos{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
    .t10-bloc{padding:12px 14px;border-radius:8px}
    .t10-bloc--1{background:#f5f3ff;border-left:4px solid #7C3AED}
    .t10-bloc--2{background:#ecfeff;border-left:4px solid #06B6D4}
    .t10-bloc h4{font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;font-weight:700}
    .t10-bloc--1 h4{color:#7C3AED}
    .t10-bloc--2 h4{color:#06B6D4}
    .t10-bloc p{margin:0;font-size:12px;line-height:1.6;color:#374151}
    .t10-table{width:100%;border-collapse:collapse}
    .t10-table thead tr{background:linear-gradient(90deg,#7C3AED,#06B6D4);color:#fff}
    .t10-table thead th{padding:9px 12px;font-size:10px;font-weight:700;text-align:left}
    .t10-table thead th:nth-child(n+2){text-align:right}
    .t10-table thead th:nth-child(2),.t10-table thead th:nth-child(3){text-align:center}
    .t10-table tbody td{padding:8px 12px;border-bottom:1px solid #f3f4f6}
    .t10-table tbody tr:nth-child(even){background:#faf5ff}
    .t10-footer{background:linear-gradient(90deg,#7C3AED,#06B6D4);padding:10px 28px;display:flex;justify-content:space-between;margin-top:16px}
    .t10-footer span{color:#fff;font-size:10px;opacity:0.9}
  </style>
  <div class="t10">
    <div class="t10-head">
      <div class="t10-left">
        <div class="t10-pill">${lbl}</div>
        ${logoBlock(d,'#fff')}
        <div style="color:rgba(255,255,255,0.7);font-size:10px;margin-top:6px">${d.adresse}</div>
      </div>
      <div class="t10-right">
        <div style="color:rgba(255,255,255,0.8);font-size:9px;font-weight:700;letter-spacing:3px;margin-bottom:8px">RÉFÉRENCE</div>
        <div style="color:#fff;font-size:18px;font-weight:800">N° ${d.num||'—'}</div>
        <div style="color:rgba(255,255,255,0.85);font-size:11px;margin-top:6px">Date : ${d.date||'—'}</div>
        ${d.ech?`<div style="color:rgba(255,255,255,0.85);font-size:11px">Validité : ${d.ech}</div>`:''}
      </div>
    </div>
    <div class="t10-body">
      <div class="t10-infos">
        <div class="t10-bloc t10-bloc--1"><h4>Émetteur</h4><p><strong>${d.nomEnt}</strong><br>${d.adresse?d.adresse+'<br>':''}${d.tel?d.tel+'<br>':''}${d.email||''}${d.rccm?'<br>RCCM : '+d.rccm:''}</p></div>
        <div class="t10-bloc t10-bloc--2"><h4>Destinataire</h4><p><strong>${d.nomCli||'—'}</strong><br>${d.adrCli?d.adrCli+'<br>':''}${d.telCli?d.telCli+'<br>':''}${d.emailCli||''}</p></div>
      </div>
      <table class="t10-table">
        <thead><tr><th style="width:40%">Description</th><th>Qté</th><th>Unité</th><th>Prix HT</th><th>Total HT</th></tr></thead>
        <tbody>${lignesRows(d)}</tbody>
      </table>
      ${totauxBlock(d,'#7C3AED','#fff')}${notesBlock(d)}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px">
        <div style="font-size:10px;color:#9ca3af">${d.tvaInfo.pays} — TVA ${d.tvaInfo.taux}%</div>
        <div style="text-align:center">${sigBlock(d)}<span style="font-size:10px;color:#9ca3af">Signature</span></div>
      </div>
    </div>
    <div class="t10-footer"><span>${d.nomEnt}</span><span>${d.tel||''}</span><span>${d.email||''}</span></div>
  </div>`;
}
