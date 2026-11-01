(function(){
  const data=window.sumons||{};
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

  function header(){
    return `<div class="topbar">Private representation · curated homes · intelligent marketing</div>
    <header class="nav"><div class="wrap nav-inner">
      <div class="nav-left"><a class="nav-link" href="listings.html">Properties</a><a class="nav-link" href="buyers.html">Buy</a><a class="nav-link" href="sellers.html">Sell</a></div>
      <a class="brand" href="index.html" aria-label="Sumons Creation home"><span class="brand-mark"><i></i></span><span>SUMONS</span></a>
      <div class="nav-right"><a class="nav-link" href="neighborhoods.html">Areas</a><a class="nav-link" href="about.html">Studio</a><a class="nav-cta" href="contact.html">Private consultation</a><button class="menu-btn" data-menu>Menu</button></div>
    </div></header>
    <div class="mobile-panel" data-mobile><nav><a href="listings.html">Properties</a><a href="buyers.html">Buy</a><a href="sellers.html">Sell</a><a href="neighborhoods.html">Areas</a><a href="about.html">Studio</a><a href="contact.html">Contact</a></nav><div class="mobile-meta">Austin, Texas · ${data.brand?.phone||''}</div></div>`;
  }
  function footer(){
    return `<footer class="footer"><div class="wrap"><div class="footer-grid"><div><div class="footer-brand">Sumons Creation</div><p>Private real-estate representation and design-led property marketing for clients who value clarity, discretion and excellent execution.</p></div><div><h4>Explore</h4><a href="listings.html">Properties</a><a href="buyers.html">Buy with us</a><a href="sellers.html">Sell with us</a><a href="neighborhoods.html">Neighborhoods</a></div><div><h4>Studio</h4><a href="about.html">About Sumons</a><a href="insights.html">Market insights</a><a href="contact.html">Contact</a><a href="credits.html">Demo photo credits</a></div><div><h4>Demo contact</h4><a href="tel:+15125550198">${data.brand?.phone||''}</a><a href="mailto:hello@sumons-demo.com">${data.brand?.email||''}</a><a href="#">${data.brand?.instagram||''}</a></div></div><div class="footer-bottom"><span>© <span data-year></span> Sumons Creation · Demo template</span><span>Replace demo content before publishing · Privacy · Terms</span></div></div></footer>`;
  }
  $$('[data-site-header]').forEach(el=>el.innerHTML=header());
  $$('[data-site-footer]').forEach(el=>el.innerHTML=footer());
  $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  const menu=$('[data-menu]'), panel=$('[data-mobile]');
  if(menu&&panel) menu.addEventListener('click',()=>{panel.classList.toggle('open');document.body.classList.toggle('menu-open');menu.textContent=panel.classList.contains('open')?'Close':'Menu'});

  function card(p,large=false){
    return `<article class="property-card ${large?'large':''}" data-reveal><div class="property-media"><a href="property1612.html?id=${p.id}"><img src="${p.image}" alt="${p.name} demo property" loading="lazy"><span class="pill">${p.badge}</span></a><button class="heart" data-favorite="${p.id}" aria-label="Save ${p.name}">♡</button></div><a href="property1612.html?id=${p.id}"><div class="property-info"><div><h3>${p.name}</h3><div class="property-location">${p.address}</div></div><div class="property-price">${money(p.price)}</div></div><div class="property-meta"><span>${p.beds} beds</span><span>${p.baths} baths</span><span>${p.sqft.toLocaleString()} sqft</span></div></a></article>`;
  }
  function syncFavs(){
    const favs=JSON.parse(localStorage.getItem('sumons-favorites')||'[]');
    $$('[data-favorite]').forEach(btn=>{const on=favs.includes(btn.dataset.favorite);btn.classList.toggle('active',on);btn.textContent=on?'♥':'♡'});
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-favorite]');if(!b)return;e.preventDefault();let favs=JSON.parse(localStorage.getItem('sumons-favorites')||'[]');const id=b.dataset.favorite;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];localStorage.setItem('sumons-favorites',JSON.stringify(favs));syncFavs()});

  const featured=$('[data-featured]'); if(featured){featured.innerHTML=data.properties.slice(0,4).map((p,i)=>card(p,i===0)).join('');syncFavs()}
  const ngrid=$('[data-neighborhoods]'); if(ngrid){ngrid.innerHTML=data.neighborhoods.map(n=>`<article class="neighborhood" data-reveal><img src="${n.image}" alt="${n.name} lifestyle demo" loading="lazy"><div class="neighborhood-copy"><small>${n.kicker}</small><h3>${n.name}</h3><p>${n.text}</p><a class="text-link" href="neighborhoods.html">Explore area</a></div></article>`).join('')}

  const listingGrid=$('[data-listing-grid]');
  function renderListings(){if(!listingGrid)return;const q=($('[data-q]')?.value||'').toLowerCase(), type=$('[data-type]')?.value||'', beds=+$('[data-beds]')?.value||0, max=+$('[data-max]')?.value||Infinity;const list=data.properties.filter(p=>(!q||(p.name+' '+p.address).toLowerCase().includes(q))&&(!type||p.type===type)&&p.beds>=beds&&p.price<=max);listingGrid.innerHTML=list.length?list.map(p=>card(p)).join(''):'<div class="empty">No properties match these demo filters. Try widening your search.</div>';const c=$('[data-count]');if(c)c.textContent=`${list.length} curated ${list.length===1?'property':'properties'}`;syncFavs();observeReveal()}
  $$('[data-filter]').forEach(el=>el.addEventListener('input',renderListings));renderListings();

  const detail=$('[data-property-detail]'); if(detail){const id=new URLSearchParams(location.search).get('id');const p=data.properties.find(x=>x.id===id)||data.properties[0];document.title=`${p.name} | Sumons Creation`;detail.innerHTML=`<section class="detail-head"><div class="wrap"><div class="eyebrow">${p.status} · ${p.address}</div><div class="detail-headline"><h1 class="display">${p.name}</h1><div class="detail-price">${money(p.price)}</div></div></div></section><section class="gallery">${p.gallery.slice(0,3).map((im,i)=>`<figure><img src="${im}" alt="${p.name} ${i+1}" loading="${i?'lazy':'eager'}"></figure>`).join('')}</section><section><div class="wrap detail-body"><div><p class="detail-lead">${p.intro}</p><div class="detail-facts"><div class="fact"><strong>${p.beds}</strong><span>Bedrooms</span></div><div class="fact"><strong>${p.baths}</strong><span>Bathrooms</span></div><div class="fact"><strong>${p.sqft.toLocaleString()}</strong><span>Sq. ft.</span></div><div class="fact"><strong>${p.lot}</strong><span>Lot</span></div></div><div class="eyebrow">Residence details</div><h2 class="display" style="font-size:58px">Designed for the way you live.</h2><p class="muted">This is polished demonstration copy. Replace it with the verified listing description, disclosures and brokerage-required information for the actual property.</p><ul class="amenities">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul></div><aside><div class="inquiry-card"><div class="eyebrow">Private tour</div><h3>Experience ${p.name}.</h3><p class="muted">Request a private showing or ask for the complete property brief.</p><form data-demo-form><div class="field"><label>Name</label><input required placeholder="Your name"></div><div class="field" style="margin-top:12px"><label>Email</label><input type="email" required placeholder="you@example.com"></div><div class="field" style="margin-top:12px"><label>Phone</label><input placeholder="(555) 555-5555"></div><button class="btn btn-accent" style="width:100%;margin-top:16px">Request private tour</button><div class="muted" style="font-size:10px;margin-top:12px">Demo form. Connect to your CRM or form provider.</div></form></div></aside></div></section>`}

  $$('[data-demo-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const t=$('[data-toast]');if(t){t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3400)}f.reset()}));
  const estimate=$('[data-estimate]');if(estimate){estimate.addEventListener('submit',e=>{e.preventDefault();const value=+$('[name=homeValue]',estimate).value||0, condition=+$('[name=condition]',estimate).value||1, result=Math.round(value*condition);$('[data-estimate-result]').innerHTML=`<span>Demo positioning range</span><strong>${money(result*.96)} – ${money(result*1.04)}</strong><p style="color:#aaa69f;margin-bottom:0;font-size:12px">Illustrative only. A real pricing opinion requires property and market analysis.</p>`})}
  const quick=$('[data-quick-search]'); if(quick) quick.addEventListener('submit',e=>{e.preventDefault();const qs=new URLSearchParams();const loc=$('[name=location]',quick)?.value;if(loc)qs.set('q',loc);location.href='listingsd41d.html?'+qs.toString()});
  if(location.pathname.endsWith('listings.html')){const q=new URLSearchParams(location.search).get('q');if(q&&$('[data-q]')){$('[data-q]').value=q;renderListings()}}

  function observeReveal(){const items=$$('[data-reveal]:not(.visible)');if(!('IntersectionObserver'in window)){items.forEach(x=>x.classList.add('visible'));return}const io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');io.unobserve(en.target)}}),{threshold:.08});items.forEach(x=>io.observe(x))}observeReveal();
})();
