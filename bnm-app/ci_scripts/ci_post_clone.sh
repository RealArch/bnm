#!/bin/sh

# Navega al directorio raíz del repositorio
cd $CI_WORKSPACE

# Instala las dependencias de Node.js
echo "---- Instalando dependencias de Node.js ----"
npm install

# Ejecuta Capacitor Sync para copiar los assets web y actualizar los plugins nativos
echo "---- Sincronizando plugins de Capacitor ----"
npx cap sync ios

echo "---- Script de post-clonación finalizado ----"

# Salir con éxito
exit 0