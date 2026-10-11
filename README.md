# Dashboard de Regresión Lineal · Equipo 13

¡Hola! 👋 Este es un pequeño dashboard que hice para mi clase de **Sistemas de Apoyo a la Decisión** (Unidad 3) en la Facultad de Ingeniería Mochis (UAS). Lo comparto por si a alguien le sirve para entender, practicar o enseñar **regresión lineal por mínimos cuadrados ordinarios**.

La idea es simple: capturas tus pares de datos `(x, y)`, y la app calcula la recta que mejor se ajusta, te muestra los errores, las métricas de evaluación y, además, el **procedimiento paso a paso** con las fórmulas ya sustituidas con tus números. Todo se recalcula al instante mientras escribes.

Si lo clonas, siéntete libre de usar los datos de ejemplo, cambiarlos por los tuyos o modificar lo que quieras. Está hecho con **Vue 3 + Vite** y **Chart.js**.

---

## ¿Qué incluye?

El proyecto tiene tres vistas que puedes alternar desde la barra superior:

### 1. Dashboard
El corazón de la app. Aquí ves:

- La **ecuación de la recta** obtenida (`ŷ = b + m·x`).
- Las métricas **RMSE**, **MAE** y **MAPE** para evaluar qué tan bueno es el ajuste.
- La **gráfica de dispersión** con tus puntos, la recta de tendencia y el punto de predicción.
- Gráficas individuales de la variable **x** y de la variable **y**, con su media.
- Una tabla de **estadísticas generales** (media, desviación estándar, varianza, mínimo y máximo).
- La tabla de **captura de datos**: agrega, edita o elimina filas y todo se recalcula solo.

### 2. Procedimiento
La parte didáctica. Muestra, en 8 pasos, **cómo se llega** al resultado con los datos que tengas cargados:

1. Sumas necesarias (`Σx`, `Σy`, `Σxy`, `Σx²`).
2. Medias de `x` y de `y`.
3. Cálculo de la pendiente `m`.
4. Cálculo de la ordenada al origen `b`.
5. Ecuación final y la predicción.
6. Tabla de errores (`e`, `e²`, `|e|`, `|e|/y`).
7. Métricas de evaluación (MSE, RMSE, MAE, MAPE, R²).
8. Estadísticas generales.

### 3. Integrantes
Los datos del equipo, del curso y las fotos de cada quien. Si le das **clic a una foto, se abre en grande** para verla bien.

---

## Cómo usarlo

### Requisitos

Solo necesitas tener instalado **Node.js** (versión 18 o superior) y npm. Nada más.

### Pasos

1. Clona el repositorio:

   ```bash
   git clone <url-del-repo>
   cd regresion-lineal-dashboard
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre la URL que te muestra la terminal (normalmente `http://localhost:5173`) y listo. 🚀

### Comandos disponibles

| Comando           | Qué hace                                                    |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Inicia el entorno de desarrollo con recarga en vivo.        |
| `npm run build`   | Genera la versión de producción en la carpeta `dist/`.      |
| `npm run preview` | Previsualiza localmente lo que quedó en `dist/`.            |

---

## Cómo usarlo dentro de la app

1. Entra a **Dashboard**.
2. Ve a la tabla **Captura de datos** y escribe tus valores de `x` y `y`.
   - Por defecto vienen cargados los datos de la práctica 7 (edad del neumático vs. tiempo por vuelta de Kimi Antonelli), pero puedes editarlos o borrarlos.
   - Con **Agregar dato** sumas filas y con **✕** las eliminas.
   - Con **Restablecer práctica 7** vuelves a los datos originales.
   - Las filas incompletas se ignoran automáticamente.
3. En la tarjeta **Predicción**, escribe un valor de `x` para estimar su `y` con la recta que se calculó.
4. Abre **Procedimiento** para ver todo el desarrollo matemático con tus propios datos.
5. Cambia el nombre de las etiquetas `x` y `y` si trabajas con otra cosa (están en `src/lib/store.js`).

> Nota: para que la regresión tenga sentido necesitas **al menos 2 datos** y que los valores de `x` no sean todos iguales.

---

## Personalizar el equipo

Las fotos de los integrantes viven en la carpeta `assets/` de la raíz del proyecto. El nombre del archivo debe ser **el primer nombre de la persona en minúsculas**:

```
assets/
├── carlos.jpeg
├── jaime.jpeg
└── gerardo.jpeg
```

Si una foto no existe, la tarjeta muestra las **iniciales** como respaldo (así que no se rompe nada). Para cambiar los nombres, el curso o las fotos, edita `src/views/TeamView.vue`.

---

## Estructura del proyecto

```
regresion-lineal-dashboard/
├── assets/                      # Fotos de los integrantes (carlos.jpeg, jaime.jpeg, ...)
├── src/
│   ├── components/
│   │   ├── ChartCanvas.vue      # Envoltura reutilizable para Chart.js
│   │   └── NavBar.vue           # Barra de navegación entre vistas
│   ├── lib/
│   │   ├── regression.js        # Toda la matemática (mínimos cuadrados, métricas)
│   │   └── store.js             # Estado reactivo compartido (datos, modelo, predicción)
│   ├── views/
│   │   ├── DashboardView.vue    # Vista principal con gráficas y captura de datos
│   │   ├── ProcedureView.vue    # Procedimiento paso a paso
│   │   └── TeamView.vue         # Integrantes del equipo
│   ├── App.vue                  # Raíz de la app y cambio de vistas
│   ├── main.js                  # Punto de entrada
│   └── styles.css               # Estilos globales
├── index.html
├── package.json
└── vite.config.js
```

La lógica de cálculo está toda en `src/lib/regression.js` (función `fit`), así que si quieres reutilizarla en otro proyecto, es el único archivo que realmente necesitas.

---

## Stack

- [Vue 3](https://vuejs.org/) (Composition API con `<script setup>`)
- [Vite](https://vitejs.dev/) como bundler y servidor de desarrollo
- [Chart.js](https://www.chartjs.org/) para las gráficas

---

## Créditos

Hecho con cariño por el **Equipo 13**:

- Carlos David Cota Sañudo
- Jaime Omar Escalante Soto
- Gerardo Miguel Vázquez Navarro

**Asignatura:** Sistemas de Apoyo a la Decisión · **Docente:** Alan David Ramírez Noriega
**Facultad de Ingeniería Mochis · Universidad Autónoma de Sinaloa**

Si te sirvió, siéntete libre de hacer fork, mejorarlo y compartirlo. ¡Éxitos en tu tarea! 💪
