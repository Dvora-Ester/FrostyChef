FROM node:20-slim

# הגדרת משתני סביבה למניעת שאלות אינטראקטיביות ועקיפת שגיאות SSL ב-TensorFlow
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app


# ✅ הגדרת npm לעקיפת אימות SSL (פתרון לשגיאת ה-Certificate בסינון אינטרנט)
RUN npm config set strict-ssl false

# העתקת קבצי הגדרות ה-Node
COPY server/package*.json ./

# התקנת תלויות Node.js-שחררתי עכשיו
RUN npm install 


# ✅ העתקת כל תוכן תיקיית השרת
COPY server/ .

# מעתיק את תיקיית הפייתון לתוך /app/python_server

# ✅ העתקת תיקיית הפייתון שנמצאת רמה אחת מעל (בזמן הבנייה נדאג שהיא תהיה זמינה)
# הערה: נתיב זה מניח שאתה מריץ את הבנייה מתיקיית השורש של הפרויקט
# COPY ../python_server ./python_server
RUN npm test

EXPOSE 8080

CMD ["node", "src/server.js"]