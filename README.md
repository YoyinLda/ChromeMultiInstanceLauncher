# 🚀 Chrome Instances Opener

Script para abrir múltiples instancias independientes de Google Chrome con una URL específica.

## 📥 Descarga Rápida

### Descargar Ejecutables Pre-compilados

Los ejecutables ya están disponibles en este repositorio. Descarga el archivo correspondiente a tu sistema operativo desde la carpeta [`dist/`](https://github.com/YoyinLda/ChromeMultiInstanceLauncher/tree/main/dist):

#### 🍎 macOS

- **Apple Silicon (M1/M2/M3)**: [chrome-instances-opener-macos-arm64](https://github.com/YoyinLda/ChromeMultiInstanceLauncher/raw/main/dist/chrome-instances-opener-macos-arm64)
- **Intel**: [chrome-instances-opener-macos-x64](https://github.com/YoyinLda/ChromeMultiInstanceLauncher/raw/main/dist/chrome-instances-opener-macos-x64)

**Instrucciones para macOS:**
1. Descarga el archivo correspondiente a tu Mac
2. Abre Terminal y navega a la carpeta de descargas
3. Haz el archivo ejecutable: `chmod +x chrome-instances-opener-macos-*`
4. Ejecuta: `./chrome-instances-opener-macos-*`

**Nota**: La primera vez puede que necesites permitir la ejecución en Preferencias del Sistema > Seguridad y Privacidad.

#### 🪟 Windows

- **Windows (64-bit)**: [chrome-instances-opener-win-x64.exe](https://github.com/YoyinLda/ChromeMultiInstanceLauncher/raw/main/dist/chrome-instances-opener-win-x64.exe)

**Instrucciones para Windows:**
1. Descarga el archivo `.exe`
2. Haz doble clic para ejecutar
3. Si Windows Defender muestra una advertencia, haz clic en "Más información" y luego "Ejecutar de todas formas" (es un falso positivo común)

#### 📝 Archivo de Configuración

También puedes descargar el archivo de configuración de textos:
- [texts.json.example](https://github.com/YoyinLda/ChromeMultiInstanceLauncher/raw/main/texts.json.example)

Cópialo como `texts.json` en el mismo directorio que el ejecutable para personalizar los textos.

---

## 📋 Descripción

Este proyecto permite abrir múltiples instancias completamente independientes de Chrome (no pestañas), cada una con su propio perfil temporal. Ideal para situaciones donde necesitas acceder simultáneamente a un sitio web desde diferentes "sesiones".

## ✨ Características

- ✅ Abre **10 instancias independientes** de Chrome (no pestañas)
- ✅ Cada instancia tiene su propio perfil temporal
- ✅ Compatible con **macOS, Windows y Linux**
- ✅ No requiere dependencias externas (solo Node.js nativo)
- ✅ Delay de 500ms entre cada instancia para evitar sobrecarga
- ✅ Procesos independientes que continúan ejecutándose

## 📦 Instalación

### Opción 1: Usar el script directamente (requiere Node.js)

```bash
# Clonar o descargar el proyecto
cd chrome-instances-opener

# Instalar dependencias (solo para desarrollo/build)
npm install

# Ejecutar el script
npm start
```

### Opción 2: Generar ejecutables (recomendado para distribución)

El proyecto puede compilarse en ejecutables independientes que no requieren Node.js instalado.

```bash
# Instalar dependencias de desarrollo
npm install

# Generar ejecutables para todas las plataformas
npm run build:all

# O generar para plataformas específicas:
npm run build:mac    # Solo macOS (Intel y Apple Silicon)
npm run build:win    # Solo Windows
npm run build        # Todas las plataformas configuradas
```

Los ejecutables se generarán en la carpeta `dist/`:
- **macOS Intel**: `chrome-instances-opener-macos-x64`
- **macOS Apple Silicon**: `chrome-instances-opener-macos-arm64`
- **Windows**: `chrome-instances-opener-win-x64.exe`

### Opcional: Hacer el script ejecutable (solo Linux/macOS)

```bash
chmod +x index.js
./index.js
```

## 🎯 Uso

### Si usas el ejecutable compilado:

**macOS:**
```bash
./dist/chrome-instances-opener-macos-x64        # Intel
./dist/chrome-instances-opener-macos-arm64     # Apple Silicon
```

**Windows:**
```bash
dist\chrome-instances-opener-win-x64.exe
```

### Si usas el script directamente:

**Opción 1: Usando npm (Recomendado)**
```bash
npm start
```

**Opción 2: Ejecutando directamente con Node**
```bash
node index.js
```

**Opción 3: Como ejecutable directo (solo Linux/macOS)**
```bash
chmod +x index.js
./index.js
```

## ⚙️ Configuración

El script ahora incluye un **wizard interactivo** que te permite configurar:
- 📍 La URL a abrir (por defecto: `https://www.puntoticket.com`)
- 📊 La cantidad de instancias (por defecto: `1`)

### Personalización de Textos

Todos los textos del wizard se pueden personalizar editando el archivo `texts.json` que se encuentra en el mismo directorio que el ejecutable o script.

#### Ubicación del archivo

- **Si usas el script directamente**: `texts.json` debe estar en el mismo directorio que `index.js`
- **Si usas el ejecutable**: `texts.json` debe estar en el mismo directorio que el ejecutable

#### Editar textos.json

El archivo `texts.json` contiene todos los textos que se muestran en el wizard. Puedes editarlo con cualquier editor de texto:

```json
{
  "wizardTitle": "🚀 APERTURA DE INSTANCIAS DE CHROME",
  "urlPrompt": "📍 Ingresa la URL a abrir (Enter para usar https://www.puntoticket.com): ",
  "defaultUrl": "https://www.puntoticket.com",
  "defaultInstances": 1,
  "maxInstances": 1000,
  ...
}
```

#### Plantillas de texto

Algunos textos usan plantillas con placeholders que se reemplazan automáticamente:

- `{url}` - Se reemplaza con la URL ingresada
- `{num}` - Se reemplaza con el número de instancias
- `{max}` - Se reemplaza con el máximo de instancias permitidas
- `{path}` - Se reemplaza con la ruta de Chrome
- `{message}` - Se reemplaza con el mensaje de error
- `{platform}` - Se reemplaza con el sistema operativo
- `{dir}` - Se reemplaza con el directorio temporal

**Ejemplo:**
```json
{
  "urlConfigured": "✅ URL configurada: {url}\n",
  "instancesConfigured": "✅ Se abrirán {num} instancia(s) de Chrome\n"
}
```

#### Valores configurables

- `defaultUrl`: URL por defecto cuando el usuario presiona Enter
- `defaultInstances`: Cantidad de instancias por defecto cuando el usuario presiona Enter
- `maxInstances`: Límite máximo de instancias permitidas

#### Archivo de ejemplo

El proyecto incluye un archivo `texts.json.example` que puedes copiar y personalizar:

```bash
# Copiar el archivo de ejemplo
cp texts.json.example texts.json

# Editar con tu editor favorito
nano texts.json    # Linux/macOS
notepad texts.json # Windows
```

#### Notas importantes

- Si el archivo `texts.json` no existe, se usarán los valores por defecto del código
- Si falta algún campo en `texts.json`, se usará el valor por defecto para ese campo
- El archivo debe ser un JSON válido (usa comillas dobles, no simples)
- Los banners ASCII (`mainBanner` y `banner`) también se pueden personalizar
- El archivo `texts.json` se ignora en git para permitir personalizaciones locales

## 📋 Requisitos

### Para ejecutar el script directamente:
- **Node.js** versión 10 o superior
- **Google Chrome** instalado en tu sistema

### Para generar ejecutables:
- **Node.js** versión 18 o superior (recomendado)
- **npm** o **yarn**
- **pkg** se instalará automáticamente como dependencia de desarrollo

### Para usar los ejecutables compilados:
- **Google Chrome** instalado en tu sistema
- **No requiere Node.js** instalado

## 💡 Notas Importantes

### Instancias vs Pestañas

El script abre **instancias completamente independientes** de Chrome, no solo pestañas. Esto significa que cada una:
- Tiene su propia memoria y procesos
- Tiene su propio perfil temporal
- No comparte cookies ni sesiones con las demás
- Aparece como una aplicación separada

### Directorios Temporales

Cada instancia crea un directorio temporal en:
- **macOS/Linux**: `/tmp/chrome-instance-X-timestamp/`
- **Windows**: `%TEMP%\chrome-instance-X-timestamp\`

### Limpieza de Directorios Temporales

Estos directorios pueden acumularse con el tiempo. Para limpiarlos:

**macOS/Linux:**
```bash
rm -rf /tmp/chrome-instance-*
```

**Windows (PowerShell):**
```powershell
Remove-Item "$env:TEMP\chrome-instance-*" -Recurse -Force
```

**Windows (CMD):**
```cmd
del /s /q %TEMP%\chrome-instance-*
rmdir /s /q %TEMP%\chrome-instance-*
```

## 🐛 Solución de Problemas

### Chrome no se encuentra

**macOS:**
Asegúrate de que Chrome esté instalado en `/Applications/Google Chrome.app/`

**Windows:**
El script busca Chrome en las ubicaciones estándar:
- `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
- `%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe`

Si Chrome está en otra ubicación, edita la función `getChromePath()` en `index.js`.

**Linux:**
Asegúrate de que el comando `google-chrome` esté disponible en tu PATH.

### Las instancias no se abren

1. Verifica que Chrome esté instalado correctamente
2. Verifica que tengas permisos para crear directorios temporales
3. Intenta abrir Chrome manualmente para verificar que funcione
4. Revisa que no haya restricciones de seguridad o antivirus bloqueando la ejecución

### Alto consumo de recursos

Cada instancia de Chrome consume memoria RAM. Si tu sistema se pone lento:
- Reduce el número de instancias (`NUM_INSTANCES`)
- Cierra otras aplicaciones
- Considera aumentar la RAM de tu sistema

## ⚠️ Advertencia Importante

Usar múltiples instancias para acceder al mismo sitio web puede:
- 💻 Consumir muchos recursos del sistema (RAM, CPU)
- 🚨 Ser interpretado por algunos sitios como comportamiento sospechoso
- ⚖️ Violar los términos de servicio de algunos sitios web
- 🔒 Provocar bloqueos temporales o permanentes de IP

**Usa este script de manera responsable y respetando las políticas del sitio que estás visitando.**

## 🔨 Construcción de Ejecutables

### Requisitos previos

Asegúrate de tener Node.js instalado (versión 18 o superior recomendada).

### Pasos para construir

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Construir ejecutables:**

   **Para todas las plataformas:**
   ```bash
   npm run build:all
   ```

   **Solo macOS (Intel y Apple Silicon):**
   ```bash
   npm run build:mac
   ```

   **Solo Windows:**
   ```bash
   npm run build:win
   ```

3. **Encontrar los ejecutables:**

   Los archivos se generarán en la carpeta `dist/`:
   - `chrome-instances-opener-macos-x64` (macOS Intel)
   - `chrome-instances-opener-macos-arm64` (macOS Apple Silicon)
   - `chrome-instances-opener-win-x64.exe` (Windows)

### Notas sobre los ejecutables

- Los ejecutables son **independientes** y no requieren Node.js instalado
- El tamaño de cada ejecutable es aproximadamente **30-50 MB** (incluye el runtime de Node.js)
- En macOS, es posible que necesites permitir la ejecución en Preferencias del Sistema > Seguridad y Privacidad
- En Windows, el antivirus puede mostrar una advertencia la primera vez (falso positivo común con ejecutables empaquetados)

### Distribución

Puedes distribuir los ejecutables directamente:
- **macOS**: Renombra el archivo a `chrome-instances-opener` y distribúyelo
- **Windows**: El archivo `.exe` está listo para distribuir

## 🎫 URL por Defecto

El script viene configurado con la URL por defecto:
```
https://www.puntoticket.com
```

Puedes cambiarla durante la ejecución del wizard o editando el diccionario `TEXTS` en el código fuente.

## 📊 Casos de Uso

Este script puede ser útil para:
- 🎫 Compra de tickets en sitios con alta demanda
- 🧪 Testing de aplicaciones web con múltiples sesiones
- 🔍 Testing de sistemas de cola/waiting room
- 📱 Simulación de múltiples usuarios simultáneos

## 🤝 Contribuciones

Este es un proyecto interno. Si encuentras mejoras o bugs, siéntete libre de modificarlo según tus necesidades.

## 📝 Licencia

ISC License - Uso interno

## 👨‍💻 Autor

Autofact

---

**Última actualización:** Enero 2026
