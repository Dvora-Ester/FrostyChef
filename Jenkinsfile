pipeline {
    agent any

    environment {
        // מזהה האימג' ב-Docker Hub (שנו את 'youruser' לשם המשתמש שלכם)
        DOCKER_USER = "youruser"
        APP_NAME = "chef-mirror"
        // מזהה הקרדנשלס שהגדרתם בג'נקינס עבור Docker Hub
        DOCKER_HUB_CREDS = 'docker-hub-login'
        // מפתח ה-API עבור הטסטים
        GEMINI_API_KEY = credentials('gemini-api-key')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('server') {
                    sh 'npm config set strict-ssl false'
                    sh 'npm install'
                    // הרצת הטסטים מהקובץ visionService.test.js
                    sh 'npm test'
                }
            }
        }

        stage( 'Build Images') {
            steps {
                // בנייה באמצעות docker-compose כפי שמוגדר בפרויקט
                sh 'docker-compose build'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // התחברות ל-Docker Hub ודחיפת האימג'ים
                    docker.withRegistry('', "${DOCKER_HUB_CREDS}") {
                        // תיוג ודחיפה של ה-Backend (נבנה לפי server/Dockerfile)
                        sh "docker tag ${APP_NAME}-backend:latest ${DOCKER_USER}/${APP_NAME}-backend:latest"
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-backend:latest"
                        
                        [cite_start]// תיוג ודחיפה של ה-Frontend (נבנה לפי ה-Dockerfile של הלקוח [cite: 2])
                        sh "docker tag ${APP_NAME}-frontend:latest ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                    }
                }
            }
        }
    }
}