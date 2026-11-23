// Source: PrepAssist.html L5571-L5587 (articleArt)
// The article hero illustration as SVG markup. Body copied from the HTML; only the two lookup
// tables are typed. Drawn with react-native-svg's SvgXml by ArticleScreen.
export function articleArt(kind: string, big?: boolean): string {
  const bg = ({ trade: '#E8F3FC', econ: '#E8F3FC', court: '#FFF4E2', mineral: '#F4F6F9', leaf: '#E8F3FC', orbit: '#FFF4E2' } as Record<string, string>)[kind] || '#EEE';
  const k = ({
    trade: `<circle cx="90" cy="86" r="44" fill="#6C5DD3" opacity=".85"/><circle cx="150" cy="86" r="44" fill="#F5A01F" opacity=".85"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<circle cx="${150 + 30 * Math.cos(a)}" cy="${86 + 30 * Math.sin(a)}" r="2.6" fill="#FFE07A"/>`; }).join('')}
      <path d="M90 86 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>
      <g stroke="#fff" stroke-width="1" opacity=".6">${Array.from({ length: 24 }, (_, i) => { const a = i * Math.PI / 12; return `<path d="M${90 + 16 * Math.cos(a)} ${86 + 16 * Math.sin(a)} L${90 + 22 * Math.cos(a)} ${86 + 22 * Math.sin(a)}"/>`; }).join('')}</g>
      <path d="M20 160 H220" stroke="#25272D" stroke-width="1"/><rect x="40" y="140" width="40" height="20" fill="#25272D"/><rect x="84" y="146" width="30" height="14" fill="#1667B0"/><rect x="118" y="142" width="36" height="18" fill="#3B5BCC"/><rect x="158" y="148" width="26" height="12" fill="#E8890C"/>`,
    econ: `<path d="M30 150 H210" stroke="#25272D"/>${[40, 62, 54, 78, 70, 92, 100].map((h, i) => `<rect x="${40 + i * 24}" y="${150 - h}" width="14" height="${h}" fill="${i === 6 ? '#1B8AD3' : '#3B5BCC'}" opacity="${i === 6 ? 1 : .55}"/>`).join('')}
      <text x="190" y="52" font-family="'Inter Tight',Inter,sans-serif" font-size="46" fill="#25272D" text-anchor="middle">₹</text><path d="M44 108 L68 90 L92 96 L116 72 L140 80 L164 56 L188 50" stroke="#B23B2E" stroke-width="2" fill="none"/>`,
    court: `<path d="M50 70 L120 36 L190 70Z" fill="#1667B0"/><rect x="50" y="70" width="140" height="8" fill="#25272D"/>${[62, 88, 114, 140, 166].map(x => `<rect x="${x}" y="80" width="12" height="62" fill="#FFFFFF" stroke="#1667B0"/>`).join('')}<rect x="44" y="142" width="152" height="8" fill="#25272D"/><rect x="36" y="150" width="168" height="8" fill="#1667B0"/><circle cx="120" cy="56" r="6" fill="#FFD27A"/>`,
    mineral: `${([[80, 90, 30, '#3B5BCC'], [130, 70, 24, '#0A97B8'], [160, 120, 34, '#6C5DD3'], [100, 140, 20, '#E8890C']] as [number, number, number, string][]).map(([x, y, r, c]) => `<path d="M${x} ${y - r} L${x + r * .87} ${y - r / 2} L${x + r * .87} ${y + r / 2} L${x} ${y + r} L${x - r * .87} ${y + r / 2} L${x - r * .87} ${y - r / 2}Z" fill="${c}" opacity=".85"/>`).join('')}`,
    leaf: `<path d="M60 150 C60 80 120 40 190 40 C190 110 140 160 60 150Z" fill="#3E9A55"/><path d="M60 150 C100 110 140 80 180 50" stroke="#E8F3FC" stroke-width="2" fill="none"/><path d="M20 160 C60 150 90 170 130 160 S200 150 230 160" stroke="#0A97B8" stroke-width="3" fill="none"/>`,
    orbit: `<ellipse cx="120" cy="96" rx="90" ry="34" fill="none" stroke="#25272D" stroke-dasharray="3 5"/><circle cx="120" cy="96" r="30" fill="#0A97B8"/><path d="M96 86 Q120 70 146 90" stroke="#E8F3FC" stroke-width="2" fill="none"/><g transform="translate(196 78) rotate(30)"><path d="M0 -14 L6 0 V14 H-6 V0Z" fill="#FFFFFF" stroke="#25272D"/><path d="M-2 14 L0 22 L2 14" fill="#F5A01F"/></g>`,
  } as Record<string, string>)[kind] || '';
  return `<svg viewBox="0 0 240 ${big ? 172 : 190}" preserveAspectRatio="xMidYMid slice"><rect width="240" height="200" fill="${bg}"/>${k}</svg>`;
}
