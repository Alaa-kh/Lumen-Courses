import{a as e,n as t,t as n}from"./Button-B7vBFRIy.js";import{t as r}from"./StateMessage-BgwnGf35.js";import{d as i,o as a}from"./index-CTcBpFqC.js";import{t as o}from"./Reveal-CvCiHEC5.js";import{t as s}from"./format-maTaLQSE.js";import{t as c}from"./useLearnActions-B5euWZJr.js";function l(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function u(e){let t=l(e.brand),n=l(e.heading),r=l(e.awarded),i=l(e.studentName),a=l(e.courseLine),o=l(e.code),s=l(e.issuedAt);return`<!DOCTYPE html>
<html lang="${l(e.lang)}" dir="${e.dir}">
<head>
  <meta charset="utf-8" />
  <title>${t} — ${n}</title>
  <style>
    @page { size: A4 landscape; margin: 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: "Segoe UI", Tahoma, sans-serif;
      color: #121212;
      background: #f3f1ec;
    }
    .certificate {
      width: min(100%, 920px);
      padding: 48px 40px;
      text-align: center;
      border: 3px solid #ff4d00;
      background:
        radial-gradient(circle at top right, #ffe8de, transparent 45%),
        #ffffff;
    }
    .brand {
      margin: 0 0 16px;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 2.4rem;
      line-height: 1.15;
    }
    .awarded {
      margin: 0;
      color: #6b6b6b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.875rem;
    }
    .name {
      margin: 24px 0;
      font-size: 2rem;
      font-weight: 700;
      color: #ff4d00;
    }
    .course {
      margin: 0 auto;
      max-width: 36rem;
      color: #6b6b6b;
      line-height: 1.5;
    }
    .meta {
      display: flex;
      justify-content: center;
      gap: 28px;
      flex-wrap: wrap;
      margin-top: 32px;
      color: #6b6b6b;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <article class="certificate">
    <p class="brand">${t}</p>
    <h1>${n}</h1>
    <p class="awarded">${r}</p>
    <p class="name">${i}</p>
    <p class="course">${a}</p>
    <div class="meta">
      <span>${o}</span>
      <span>${s}</span>
    </div>
  </article>
</body>
</html>`}function d(e,t){let n=new Blob([e],{type:`text/html;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=t,i.rel=`noopener`,document.body.append(i),i.click(),i.remove(),URL.revokeObjectURL(r)}function f(e){let t=document.createElement(`iframe`);t.setAttribute(`aria-hidden`,`true`),t.style.position=`fixed`,t.style.right=`0`,t.style.bottom=`0`,t.style.width=`0`,t.style.height=`0`,t.style.border=`0`,document.body.append(t);let n=t.contentWindow,r=t.contentDocument;if(!n||!r){t.remove();return}r.open(),r.write(e),r.close();let i=()=>{t.remove()};n.addEventListener(`afterprint`,i),window.setTimeout(()=>{n.focus(),n.print(),window.setTimeout(i,1e3)},250)}var p={page:`_page_c7ri1_1`,toolbar:`_toolbar_c7ri1_5`,certificate:`_certificate_c7ri1_13`,"certificate-in":`_certificate-in_c7ri1_1`,brand:`_brand_c7ri1_26`,"rise-in":`_rise-in_c7ri1_1`,awarded:`_awarded_c7ri1_44`,name:`_name_c7ri1_52`,"pop-in":`_pop-in_c7ri1_1`,course:`_course_c7ri1_60`,meta:`_meta_c7ri1_67`},m=e();function h(){let{id:e=``}=i(),{t:l,i18n:h}=t(),{data:g,isLoading:_,isError:v,refetch:y}=c(e),b=()=>g?u({brand:l(`app.name`),heading:l(`learn.certificateHeading`),awarded:l(`learn.certificateAwarded`),studentName:g.studentName??``,courseLine:l(`learn.certificateFor`,{course:g.course?.title??``}),code:g.certificateCode,issuedAt:s(g.issuedAt,h.language),lang:h.language,dir:h.dir()===`rtl`?`rtl`:`ltr`}):null;return _?(0,m.jsx)(a,{}):v||!g?(0,m.jsx)(`div`,{className:`container page`,children:(0,m.jsx)(r,{title:l(`errors.loadFailed`),description:l(`errors.generic`),actionLabel:l(`app.retry`),onAction:()=>void y()})}):(0,m.jsxs)(`div`,{className:`container page ${p.page}`,children:[(0,m.jsxs)(`div`,{className:p.toolbar,children:[(0,m.jsx)(n,{type:`button`,variant:`secondary`,onClick:()=>{let e=b();e&&f(e)},children:l(`learn.printCertificate`)}),(0,m.jsx)(n,{type:`button`,onClick:()=>{if(!g)return;let e=b();e&&d(e,`lumen-certificate-${g.certificateCode}.html`)},children:l(`learn.downloadCertificate`)})]}),(0,m.jsx)(o,{variant:`scale`,children:(0,m.jsxs)(`article`,{className:p.certificate,children:[(0,m.jsx)(`p`,{className:p.brand,children:l(`app.name`)}),(0,m.jsx)(`h1`,{children:l(`learn.certificateHeading`)}),(0,m.jsx)(`p`,{className:p.awarded,children:l(`learn.certificateAwarded`)}),(0,m.jsx)(`p`,{className:p.name,children:g.studentName}),(0,m.jsx)(`p`,{className:p.course,children:l(`learn.certificateFor`,{course:g.course?.title??``})}),(0,m.jsxs)(`div`,{className:p.meta,children:[(0,m.jsx)(`span`,{children:g.certificateCode}),(0,m.jsx)(`span`,{children:s(g.issuedAt,h.language)})]})]})})]})}export{h as CertificateView};