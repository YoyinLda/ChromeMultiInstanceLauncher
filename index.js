#!/usr/bin/env node

/**
 * Script interactivo para abrir múltiples instancias de Chrome con una URL específica
 * 
 * Uso:
 *   node index.js  # Ejecuta el wizard interactivo
 */

const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Función para reemplazar placeholders en strings
function replacePlaceholders(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

// Función para cargar textos desde archivo JSON o usar valores por defecto
function loadTexts() {
  let loadedTexts = {};
  
  // Intentar cargar desde archivo externo (para personalización)
  // Prioridad: 1) Archivo externo junto al ejecutable, 2) Valores por defecto hardcodeados
  let textsPath = null;
  
  // Si está empaquetado con pkg, los assets están en el mismo directorio que el ejecutable
  if (process.pkg) {
    // En pkg, process.execPath apunta al ejecutable
    textsPath = path.join(path.dirname(process.execPath), 'texts.json');
  } else {
    // Si no está empaquetado, buscar en el mismo directorio que el script
    const scriptDir = path.dirname(require.main ? require.main.filename : __filename);
    textsPath = path.join(scriptDir, 'texts.json');
  }
  
  // Intentar cargar el archivo JSON externo (tiene prioridad para personalización)
  try {
    if (fs.existsSync(textsPath)) {
      const jsonContent = fs.readFileSync(textsPath, 'utf8');
      loadedTexts = JSON.parse(jsonContent);
    }
  } catch (error) {
    // Si hay error, continuar con valores por defecto
  }
  
  // Nota: Los valores por defecto están hardcodeados abajo, por lo que siempre funcionará
  // incluso si no existe texts.json. El archivo externo solo permite personalización.
  
  // Valores por defecto (usados si no existe el archivo JSON o faltan campos)
  const defaultTexts = {
    mainBanner: `__________ ____ ___.____    .____       _____    _______    ________ ____ ________________________ ________    _________._.
\\______   \\    |   \\    |   |    |     /  _  \\   \\      \\  /  _____/|    |   \\_   _____/\\______   \\\\_____  \\  /   _____/| |
 |    |  _/    |   /    |   |    |    /  /_\\  \\  /   |   \\/   \\  ___|    |   /|    __)_  |       _/ /   |   \\ \\_____  \\ | |
 |    |   \\    |  /|    |___|    |___/    |    \\/    |    \\    \\_\\  \\    |  / |        \\ |    |   \\/    |    \\/        \\ \\|
 |______  /______/ |_______ \\_______ \\____|__  /\\____|__  /\\______  /______/ /_______  / |____|_  /\\_______  /_______  / __
        \\/                 \\/       \\/       \\/         \\/        \\/                 \\/         \\/         \\/        \\/  \\/`,
    banner: `................................................................................
................................................................................
........................;c;'........',;;;;,'........';c;........................
........................,xxc:::::::cloddddolc:::::::cxx,........................
.........................:o:dkkkxdolloddddollodxkkkd:lc.........................
.........................;ol0WWNKkoc::::::::cok0NWW0lo;.........................
.........................cloX0ddxkkkkdlccldkkkkxdd0Xoll.........................
........................:ol0Nx:::ccldk0000Odlcc:::xN0lo:........................
.......................;olkXxclk0K0xc:oddo:cx0K0klcxXOlo;.......................
.......................lldNk:cOWMMMNx::::::xNMMMWOc:kNdll.......................
.......................olxNx:cdKNWN0o::::::o0NWNKxc:xNxlo.......................
.......................colKKdc:lodoolc::::cllodol:cdKKloc.......................
........................coo0NKOOkO0Kxc::::cx00OkOOKN0lol........................
.......................'lxc:OWWWWMNOl::::::lkNWWWWWO:cdo'.......................
......................:oldkxxkkkO0OdoolllloodO0Okkkxxkdlo:......................
...................,:lloxxc:cccllodxxddddddxxdollccc:cxkoll:,...................
.................:clddxxc........';::cccccc::;'........cxxddlc:'................
................;dcoOo;.....'ldddddddo,..,odddddddl'.....;oOdcd;................
................'olxO'......;0MMMMMMMXc..:XMMMMMMM0;......'kxlo'................
.................cloKc.......:dXMMMWOc'..'ckWMMMXd:.......cKolc.................
.................,olkO,.......;0MMMWo......lWMMMK;.......'kklo,.................
..................:olOx'......;0MMMWo......lNMMMK;.......dOlo:..................
...................colOx'.....;0MMMWo......lNMMMK;.....'dOloc...................
....................colOk,....;0MMMWo......oWMMMK;....,xOloc....................
.....................:olxOc...;0MMMWx'....'xWMMMK;...cOxlo:.....................
......................,lookx;..:ONMMWKOOOOKWMMNOc..;xkoll,......................
........................:oodkd;..cONMMMMMMMMNOc..;dkdoo:........................
.........................'clodkd:..:llllllll:..:dkdolc'.........................
...........................':lodxxo;........,oxxdol:'...........................
..............................:clodxxo;,';oxxdolc:..............................
................................':cldxxxxxxdlc:,................................
...................................':ccllc::,...................................
.......................................',.......................................
................................................................................`,
    wizardTitle: '🚀 APERTURA DE INSTANCIAS DE CHROME',
    configSummaryTitle: 'RESUMEN DE CONFIGURACIÓN',
    separator: '═══════════════════════════════════════════════════════════',
    urlPrompt: '📍 Ingresa la URL a abrir (Enter para usar https://www.puntoticket.com): ',
    instancesPrompt: '📊 Ingresa la cantidad de instancias de Chrome a abrir (Enter para usar 1): ',
    urlDefaultUsed: '✅ Usando URL por defecto: {url}\n',
    urlConfigured: '✅ URL configurada: {url}\n',
    instancesDefaultUsed: '✅ Usando cantidad por defecto: {num} instancia(s)\n',
    instancesConfigured: '✅ Se abrirán {num} instancia(s) de Chrome\n',
    invalidUrl: '❌ URL inválida. Por favor ingresa una URL válida (debe comenzar con http:// o https://)\n',
    invalidInstances: '❌ Número inválido. Por favor ingresa un número entre 1 y {max}\n',
    chromeNotFound: 'No se encontró Chrome en: {path}',
    errorOpeningChrome: '❌ Error al abrir Chrome: {message}',
    generalError: '❌ Error: {message}',
    openingInstance: '🚀 Abriendo instancia {num} de Chrome...',
    instanceOpened: '✅ Instancia {num} abierta con user-data-dir: {dir}',
    startingOpening: '🚀 Iniciando apertura de instancias...\n',
    instancesLaunched: '✨ Se han lanzado {num} instancia(s) de Chrome',
    urlLabel: '📍 URL: {url}',
    instancesLabel: '📊 Número de instancias: {num}',
    osLabel: '💻 Sistema operativo: {platform}',
    tipIndependent: '💡 Tip: Cada instancia es completamente independiente.',
    tipCleanup: '🗑️  Los directorios temporales se pueden limpiar después.\n',
    defaultUrl: 'https://www.puntoticket.com',
    defaultInstances: 1,
    maxInstances: 1000
  };
  
  // Combinar valores por defecto con los cargados (los cargados tienen prioridad)
  const texts = { ...defaultTexts, ...loadedTexts };
  
  // Convertir plantillas de strings en funciones para mantener compatibilidad
  return {
    ...texts,
    // Funciones que reemplazan placeholders
    urlDefaultUsed: (url) => replacePlaceholders(texts.urlDefaultUsed, { url }),
    urlConfigured: (url) => replacePlaceholders(texts.urlConfigured, { url }),
    instancesDefaultUsed: (num) => replacePlaceholders(texts.instancesDefaultUsed, { num }),
    instancesConfigured: (num) => replacePlaceholders(texts.instancesConfigured, { num }),
    invalidInstances: replacePlaceholders(texts.invalidInstances, { max: texts.maxInstances }),
    chromeNotFound: (path) => replacePlaceholders(texts.chromeNotFound, { path }),
    errorOpeningChrome: (message) => replacePlaceholders(texts.errorOpeningChrome, { message }),
    generalError: (message) => replacePlaceholders(texts.generalError, { message }),
    openingInstance: (num) => replacePlaceholders(texts.openingInstance, { num }),
    instanceOpened: (num, dir) => replacePlaceholders(texts.instanceOpened, { num, dir }),
    instancesLaunched: (num) => replacePlaceholders(texts.instancesLaunched, { num }),
    urlLabel: (url) => replacePlaceholders(texts.urlLabel, { url }),
    instancesLabel: (num) => replacePlaceholders(texts.instancesLabel, { num }),
    osLabel: (platform) => replacePlaceholders(texts.osLabel, { platform })
  };
}

// Cargar textos al inicio
const TEXTS = loadTexts();

// Detectar el sistema operativo y la ruta de Chrome
function getChromePath() {
  const platform = os.platform();
  
  if (platform === 'darwin') { // macOS
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else if (platform === 'win32') { // Windows
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe')
    ];
    return paths.find(p => fs.existsSync(p)) || 'chrome';
  } else { // Linux
    return 'google-chrome';
  }
}

// Función para abrir una instancia de Chrome
function openChromeInstance(instanceNumber, url) {
  const chromePath = getChromePath();
  const tempDir = os.tmpdir();
  const userDataDir = path.join(tempDir, `chrome-instance-${instanceNumber}-${Date.now()}`);
  
  console.log(TEXTS.openingInstance(instanceNumber));
  
  const args = [
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-features=TranslateUI',
    url
  ];

  const chromeProcess = spawn(chromePath, args, {
    detached: true,
    stdio: 'ignore'
  });

  // Permitir que el proceso continúe independientemente
  chromeProcess.unref();

  console.log(TEXTS.instanceOpened(instanceNumber, userDataDir));
}

// Función para solicitar input al usuario
function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Función para validar URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Función para validar número de instancias
function isValidInstances(input) {
  const num = parseInt(input, 10);
  return !isNaN(num) && num > 0 && num <= TEXTS.maxInstances;
}

// Wizard interactivo
async function runWizard() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Mostrar banners ASCII
  console.log('\n' + TEXTS.mainBanner);
  console.log('\n' + TEXTS.banner);
  console.log('\n' + TEXTS.separator);
  console.log(`  ${TEXTS.wizardTitle}`);
  console.log(TEXTS.separator + '\n');

  let URL = '';
  let NUM_INSTANCES = 0;

  // Solicitar URL
  while (!URL) {
    const urlInput = await question(rl, TEXTS.urlPrompt);
    
    if (urlInput.trim() === '') {
      URL = TEXTS.defaultUrl;
      console.log(TEXTS.urlDefaultUsed(URL));
    } else if (isValidUrl(urlInput.trim())) {
      URL = urlInput.trim();
      console.log(TEXTS.urlConfigured(URL));
    } else {
      console.log(TEXTS.invalidUrl);
    }
  }

  // Solicitar cantidad de instancias
  while (!NUM_INSTANCES) {
    const instancesInput = await question(rl, TEXTS.instancesPrompt);
    
    if (instancesInput.trim() === '') {
      NUM_INSTANCES = TEXTS.defaultInstances;
      console.log(TEXTS.instancesDefaultUsed(NUM_INSTANCES));
    } else if (isValidInstances(instancesInput.trim())) {
      NUM_INSTANCES = parseInt(instancesInput.trim(), 10);
      console.log(TEXTS.instancesConfigured(NUM_INSTANCES));
    } else {
      console.log(TEXTS.invalidInstances);
    }
  }

  rl.close();

  // Mostrar resumen
  console.log(TEXTS.separator);
  console.log(`  ${TEXTS.configSummaryTitle}`);
  console.log(TEXTS.separator);
  console.log(TEXTS.urlLabel(URL));
  console.log(TEXTS.instancesLabel(NUM_INSTANCES));
  console.log(TEXTS.osLabel(os.platform()));
  console.log(TEXTS.separator + '\n');

  return { URL, NUM_INSTANCES };
}

// Función para abrir instancias de Chrome
async function openChromeInstances(URL, NUM_INSTANCES) {
  try {
    // Verificar si Chrome está instalado
    const chromePath = getChromePath();
    if (!fs.existsSync(chromePath) && os.platform() !== 'linux') {
      throw new Error(TEXTS.chromeNotFound(chromePath));
    }

    console.log(TEXTS.startingOpening);

    // Abrir instancias con un pequeño delay entre cada una
    for (let i = 1; i <= NUM_INSTANCES; i++) {
      openChromeInstance(i, URL);
      
      // Esperar un poco entre instancias para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + TEXTS.separator);
    console.log(TEXTS.instancesLaunched(NUM_INSTANCES));
    console.log(TEXTS.separator);
    console.log('\n' + TEXTS.tipIndependent);
    console.log(TEXTS.tipCleanup);

  } catch (error) {
    console.error(TEXTS.errorOpeningChrome(error.message));
    process.exit(1);
  }
}

// Función principal
async function main() {
  try {
    const { URL, NUM_INSTANCES } = await runWizard();
    await openChromeInstances(URL, NUM_INSTANCES);
  } catch (error) {
    console.error(TEXTS.generalError(error.message));
    process.exit(1);
  }
}

// Ejecutar el script
main();
