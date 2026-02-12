# 🔧 Arreglo Rápido - Ejecuta Esto

Tu proyecto tiene problemas de dependencias. **Ejecuta este comando ahora:**

## Linux/macOS/WSL:

```bash
chmod +x scripts/fix-install.sh && ./scripts/fix-install.sh
```

## Windows PowerShell:

```powershell
.\scripts\fix-install.ps1
```

## ¿Qué hace este script?

1. ✅ Limpia todo node_modules y cache
2. ✅ Instala dependencias con configuración correcta
3. ✅ Verifica que Turbo esté instalado
4. ✅ Te deja listo para ejecutar `npm run dev`

## Después de ejecutar el script:

```bash
npm run dev
```

---

## Si el script falla, ejecuta esto manualmente:

```bash
# 1. Limpiar todo
rm -rf node_modules package-lock.json apps/*/node_modules packages/*/node_modules

# 2. Limpiar cache de npm
npm cache clean --force

# 3. Instalar con legacy-peer-deps
npm install --legacy-peer-deps

# 4. Ejecutar el proyecto
npm run dev
```

---

## Problemas que se arreglaron:

1. ✅ Conflicto de ESLint 9 vs ESLint 8 en apps/pages
2. ✅ Paquete @publicadis/typescript-config faltante
3. ✅ Turbo no instalado localmente
4. ✅ Configuración .npmrc para peer dependencies

---

## ¿Aún no funciona?

Avísame y reviso el error específico.

