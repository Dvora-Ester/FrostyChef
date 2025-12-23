# שלב 1: בנייה (Build)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# שלב 2: הגשה (Serving)
FROM nginx:alpine
# העתקת התוצר הסופי של React לתיקייה של Nginx
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]