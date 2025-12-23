pipeline {
    agent any
    
    tools {
        nodejs 'node' // השם שהגדרת ב-Tools
    }
    environment {
        DOCKER_USER = "youruser"
        APP_NAME = "chef-mirror"
        DOCKER_HUB_CREDS = 'docker-hub-login'
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

        stage('Build & Push') {
            steps {
                script {
                    [cite_start]// בנייה באמצעות docker-compose כפי שמוגדר בפרויקט [cite: 1]
                    sh 'docker-compose build'
                    
                    docker.withRegistry('', "${DOCKER_HUB_CREDS}") {
                        sh "docker tag ${APP_NAME}-backend:latest ${DOCKER_USER}/${APP_NAME}-backend:latest"
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-backend:latest"
                        
                        sh "docker tag ${APP_NAME}-frontend:latest ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                    }
                }
            }
        }

        stage('Local Deploy') {
            steps {
                [cite_start]// שלב זה מעדכן את הקונטיינרים שאת רואה ב-Docker Desktop [cite: 1]
                echo 'Deploying to local Docker environment...'
                sh 'docker-compose up -d'
            }
        }
    }
}