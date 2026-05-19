# 🏛️ Normita AI Chat

**Normita AI Chat** es una interfaz web desarrollada para uso interno de la Municipalidad de Godoy Cruz. Este proyecto fue iniciado utilizando una IA generativa de código llamada `lovable-dev[bot]`, continuado con [Claude](https://claude.ai/) (Anthropic) como asistente de desarrollo, y personalizada de acuerdo a los requerimientos del municipio.

La aplicación permite interactuar con un modelo de lenguaje reducido, cuyo conocimiento base está compuesto por normas, digestos y resoluciones generadas por la municipalidad.

---

## 🚀 Tecnologías utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📦 Instalación

```bash
npm install
```

---

## 💻 Desarrollo local

```bash
npm run dev
```

---

## 🚢 Despliegue (homologación y producción)

El deploy se realiza mediante un workflow de GitHub Actions que corre en un runner self-hosted (por restricciones de red no se pueden usar runners remotos de GitHub).

### Pasos

#### 1. Iniciar Docker Desktop

Abrir Docker Desktop en Windows para que el servicio de Docker esté activo.

#### 2. Levantar el runner de GitHub en WSL

Abrir una terminal WSL e ir a la carpeta del runner para iniciarlo:

```bash
cd ~/actions-runner
./run.sh
```

Dejar esa terminal abierta mientras dura el deploy.

#### 3. Disparar el workflow con `gh`

Desde PowerShell o cualquier terminal con el [GitHub CLI](https://cli.github.com/) autenticado, ejecutar:

```bash
gh workflow run deploy.yml \
  --ref <rama> \
  -f target=<homo|prod> \
  -f version=<NOMBRE_VERSION>
```

Parámetros:

- `--ref`: rama desde la que se ejecuta el workflow (ej: `develop`, `master`). Sin este flag usa la rama por defecto del repositorio (`master`).
- `target`: servidor destino (`homo` o `prod`)
- `version`: nombre de la carpeta que se creará en el servidor remoto, a modo de tag o versión (ej: `HOMO`, `1.2.0`, `v2-rc1`)

Ejemplo — desplegar a homologación desde `develop`:

```bash
gh workflow run deploy.yml --ref develop -f target=homo -f version=HOMO
```

Ejemplo — desplegar a producción desde `master`:

```bash
gh workflow run deploy.yml --ref master -f target=prod -f version=1.3.0
```

El workflow construye el bundle (`npm run build-homo` / `npm run build-prod`), lo empaqueta y lo sube al servidor bajo `/home/hgarrido/DigestoSemanticSearch/frontend/<version>`, actualizando el symlink `current` de forma atómica.

---

## 🧩 Estructura del proyecto

```text
├── public/            # Archivos públicos y logos
├── src/
│   ├── components/    # Componentes reutilizables de la UI
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilidades y helpers
│   ├── pages/         # Páginas principales
```

---

## 👥 Autores

Desarrollado por la **Municipalidad de Godoy Cruz**.

---

## 🛠️ Contribuciones

Este proyecto es de uso interno. Por el momento no se aceptan contribuciones externas.
