const fs = require('fs');
const path = require('path');

// Tamanhos dos ícones necessários
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Conteúdo do ícone SVG base64 (simplificado)
const svgContent = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="#000000"/>
  <rect x="64" y="64" width="384" height="384" rx="96" fill="#ffffff"/>
  
  <!-- Ícone de entrega/moto -->
  <g transform="translate(128, 128) scale(0.5)">
    <!-- Moto -->
    <path d="M200 300 C200 250, 250 200, 300 200 L400 200 C450 200, 500 250, 500 300 L500 350 C500 400, 450 450, 400 450 L300 450 C250 450, 200 400, 200 350 Z" fill="#000000"/>
    
    <!-- Rodas -->
    <circle cx="250" cy="400" r="40" fill="#333333" stroke="#000000" stroke-width="8"/>
    <circle cx="450" cy="400" r="40" fill="#333333" stroke="#000000" stroke-width="8"/>
    
    <!-- Motorista -->
    <circle cx="350" cy="280" r="30" fill="#FFD700"/>
    <path d="M320 310 L380 310 L380 350 C380 370, 360 390, 340 390 L360 390 C340 390, 320 370, 320 350 Z" fill="#FFD700"/>
    
    <!-- Caixa de entrega -->
    <rect x="280" y="320" width="80" height="60" fill="#FF6B6B" stroke="#000000" stroke-width="4"/>
    <rect x="290" y="330" width="60" height="40" fill="#FFE66D"/>
  </g>
  
  <!-- Texto "QE" -->
  <text x="256" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#000000">QE</text>
</svg>
`;

// Função para criar ícones placeholder
function createPlaceholderIcon(size) {
  const svg = svgContent.replace(/width="512"/, `width="${size}"`).replace(/height="512"/, `height="${size}"`);
  return svg;
}

// Cria a pasta de ícones se não existir
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Gera os ícones SVG para cada tamanho
iconSizes.forEach(size => {
  const iconContent = createPlaceholderIcon(size);
  const fileName = `icon-${size}x${size}.svg`;
  const filePath = path.join(iconsDir, fileName);
  
  fs.writeFileSync(filePath, iconContent);
  console.log(`Ícone criado: ${fileName}`);
});

// Cria também o ícone principal
const mainIconPath = path.join(iconsDir, 'icon.svg');
fs.writeFileSync(mainIconPath, svgContent);
console.log('Ícone principal criado: icon.svg');

console.log('\n✅ Ícones SVG criados com sucesso!');
console.log('💡 Para converter para PNG, use uma ferramenta online ou um conversor de imagem.');
console.log('📱 Os ícones estão prontos para uso no PWA!'); 