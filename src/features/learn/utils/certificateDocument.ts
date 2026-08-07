interface CertificateDocumentInput {
  brand: string
  heading: string
  awarded: string
  studentName: string
  courseLine: string
  code: string
  issuedAt: string
  lang: string
  dir: 'ltr' | 'rtl'
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function buildCertificateHtml(input: CertificateDocumentInput): string {
  const brand = escapeHtml(input.brand)
  const heading = escapeHtml(input.heading)
  const awarded = escapeHtml(input.awarded)
  const studentName = escapeHtml(input.studentName)
  const courseLine = escapeHtml(input.courseLine)
  const code = escapeHtml(input.code)
  const issuedAt = escapeHtml(input.issuedAt)

  return `<!DOCTYPE html>
<html lang="${escapeHtml(input.lang)}" dir="${input.dir}">
<head>
  <meta charset="utf-8" />
  <title>${brand} — ${heading}</title>
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
    <p class="brand">${brand}</p>
    <h1>${heading}</h1>
    <p class="awarded">${awarded}</p>
    <p class="name">${studentName}</p>
    <p class="course">${courseLine}</p>
    <div class="meta">
      <span>${code}</span>
      <span>${issuedAt}</span>
    </div>
  </article>
</body>
</html>`
}

export function downloadCertificateHtml(html: string, fileName: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function printCertificateHtml(html: string): void {
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.style.position = 'fixed'
  frame.style.right = '0'
  frame.style.bottom = '0'
  frame.style.width = '0'
  frame.style.height = '0'
  frame.style.border = '0'
  document.body.append(frame)

  const frameWindow = frame.contentWindow
  const frameDocument = frame.contentDocument
  if (!frameWindow || !frameDocument) {
    frame.remove()
    return
  }

  frameDocument.open()
  frameDocument.write(html)
  frameDocument.close()

  const cleanup = () => {
    frame.remove()
  }

  frameWindow.addEventListener('afterprint', cleanup)
  window.setTimeout(() => {
    frameWindow.focus()
    frameWindow.print()
    window.setTimeout(cleanup, 1000)
  }, 250)
}
