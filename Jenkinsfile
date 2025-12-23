pipeline {
    agent any
    
    tools {
        nodejs 'node' 
    }
    
    environment {
        // החליפי את youruser בשם המשתמש שלך ב-Docker Hub
        DOCKER_USER = "Bracha" 
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
                    sh 'npm test'
                }
            }
        }

        stage('Build & Push') {
            steps {
                script {
                    // שינוי כאן: docker compose במקום docker-compose
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
                echo 'Deploying to local Docker environment...'
                // שינוי כאן: docker compose במקום docker-compose
                sh 'docker-compose up -d'
            }
        }
    }
}