pipeline {
    agent any
    
    tools {
        nodejs 'node' 
    }
    
    environment {
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
                    // שימוש ב-docker compose (ללא מקף)
                    sh 'docker compose build'
                    
                    docker.withRegistry('', "${DOCKER_HUB_CREDS}") {
                        // תיוג ודחיפה של ה-Backend
                        sh "docker tag ${APP_NAME}-backend:latest ${DOCKER_USER}/${APP_NAME}-backend:latest"
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-backend:latest"
                        
                        // תיוג ודחיפה של ה-Frontend
                        sh "docker tag ${APP_NAME}-frontend:latest ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                    }
                }
            }
        }

        stage('Local Deploy') {
            steps {
                echo 'Deploying to local Docker environment...'
                // עצירה של קונטיינרים ישנים והרצה מחדש
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}