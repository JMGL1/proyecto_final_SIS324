import fs from 'fs';
import path from 'path';

const dir = 'src';

const replacements = [
  // Colores (Indigo a Emerald)
  { regex: /indigo/g, replace: 'emerald' },
  // Botones / Acciones Específicas
  { regex: /Solicitar Servicio/g, replace: 'Inscribirse al Taller' },
  { regex: /solicitar servicio/g, replace: 'inscribirse al taller' },
  { regex: /NUEVA SOLICITUD/g, replace: 'NUEVA INSCRIPCIÓN' },
  { regex: /Nueva solicitud/g, replace: 'Nueva inscripción' },
  { regex: /Mis Solicitudes/g, replace: 'Mis Inscripciones' },
  { regex: /mis solicitudes/g, replace: 'mis inscripciones' },
  { regex: /solicitud/g, replace: 'inscripción' },
  { regex: /solicitudes/g, replace: 'inscripciones' },
  { regex: /Solicitudes/g, replace: 'Inscripciones' },
  { regex: /Solicitud/g, replace: 'Inscripción' },
  // Palabras generales (Respetando mayúsculas)
  { regex: /Servicios/g, replace: 'Talleres' },
  { regex: /servicios/g, replace: 'talleres' },
  { regex: /Servicio/g, replace: 'Taller' },
  { regex: /servicio/g, replace: 'taller' },
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const rule of replacements) {
    if (rule.regex.test(content)) {
      content = content.replace(rule.regex, rule.replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.html')) {
      replaceInFile(fullPath);
    }
  }
}

// También actualizar index.html
replaceInFile('index.html');

traverseDir(dir);
console.log('Rebranding complete.');
