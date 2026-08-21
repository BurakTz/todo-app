# ============================================
# STAGE 1: Build - npm ile statik dosyalari (dist/) uret
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

# Once sadece package.json + package-lock.json'i kopyala.
# Layer cache sayesinde, kaynak kod degisse bile bagimliliklar
# ayni kalirsa "npm ci" tekrar calismaz - build hizlanir.
COPY package.json package-lock.json ./
RUN npm ci

# Simdi kaynak kodu kopyala ve derle (tsc -b && vite build)
COPY . .
RUN npm run build

# ============================================
# STAGE 2: Serve - statik dosyalari Nginx ile sun
# ============================================
FROM nginx:alpine

# React Router (react-router-dom) client-side routing kullaniyor,
# yani /tasks gibi bir path'e direkt girilince Nginx bunu dosya
# sanip 404 vermemeli, index.html'e yonlendirmeli. Bunun icin
# ozel bir nginx.conf lazim (asagida ayrica olusturuyoruz).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build asamasindan SADECE dist/ klasorunu kopyala.
# node_modules, kaynak kod, build araclari bu asamaya hic gecmiyor.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]