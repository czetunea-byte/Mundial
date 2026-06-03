# ⚽ Fondo Mundial 2030

App tipo Splitwise para llevar el **fondo común** del grupo rumbo al Mundial:
control de las **aportaciones semanales** de cada amigo, registro de **gastos y
compras**, **saldo** del fondo y **reportes** — todo sincronizado para que
**todos lo vean actualizado** desde su celular.

## ¿Cómo funciona?

- Cada semana, cada integrante aporta una cantidad fija (por defecto **$1,000**).
- En **Aportaciones** marcas quién puso su semana en una cuadrícula de las
  ~208 semanas que faltan para el Mundial 2030.
- En **Gastos** registras las compras (boletos, vuelos, hospedaje…) y la app
  calcula el **saldo disponible** del fondo.
- **Resumen** muestra el total recaudado, gastado, el avance hacia la meta y
  quién está al corriente o atrasado.
- **Reportes** trae gráficas y exportación a **PDF**.

## Correr localmente

```bash
npm install
npm run dev
```

Sin configurar nada, la app arranca en **modo local** (los datos se guardan
solo en tu navegador). Ideal para probarla. Para compartirla con tus amigos,
conecta Firebase 👇

## Conectar Firebase (para que TODOS lo vean en tiempo real)

1. Entra a <https://console.firebase.google.com> y crea un proyecto.
2. **Firestore Database → Crear base de datos** (modo producción).
3. **Configuración del proyecto → Tus apps → Web (`</>`)**: registra una app
   y copia el objeto `firebaseConfig`.
4. Copia `.env.example` a `.env.local` y pega los valores:

   ```bash
   cp .env.example .env.local
   ```

5. Reinicia `npm run dev`. El banner amarillo de "modo local" desaparece y los
   datos pasan a vivir en la nube, sincronizados para todos.

### Reglas de Firestore (sugeridas)

Para empezar entre amigos de confianza, en la consola de Firestore →
**Reglas**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // abierto: cámbialo por auth cuando quieras
    }
  }
}
```

> ⚠️ Esto deja la base abierta a cualquiera con la URL. Para más seguridad,
> activa **Authentication** (Google) y restringe las reglas a usuarios
> autenticados.

## Publicar la app

Cualquier hosting de sitios estáticos funciona (los amigos entran desde el
navegador del cel, sin instalar nada):

```bash
npm run build   # genera /dist
```

Sube `dist/` a **Vercel**, **Netlify** o **Firebase Hosting**. Recuerda
configurar las variables `VITE_FIREBASE_*` en el hosting.

## Stack

React 19 · Vite · Firebase (Firestore) · jsPDF.
