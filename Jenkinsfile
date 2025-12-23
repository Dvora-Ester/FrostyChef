pipeline {
    agent any

    environment {
        DOCKER_USER = "youruser"
        APP_NAME = "chef-mirror"
        DOCKER_HUB_CREDS = 'docker-hub-login'
        GEMINI_API_KEY = credentials('gemini-api-key')
    }

    stages {
        stage('Cleanup') {
            steps {
                // ניקוי סביבה לפני התחלה
                sh 'docker-compose down --remove-orphans'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('server') {
                    // הגדרות SSL לטובת עבודה ברשת מסוננת
                    sh 'npm config set strict-ssl false'
                    sh 'npm install'
                    sh "export GEMINI_API_KEY=${GEMINI_API_KEY} && npm test"
                }
            }
        }

        stage('Build & Tag Images') {
            steps {
                script {
                    // בנייה מרוכזת דרך ה-Compose
                    sh 'docker-compose build'
                    
                    // תיוג האימג'ים שנוצרו לפורמט של Docker Hub
                    // הערה: Docker Compose יוצר אימג'ים בשם: project_service
                    sh "docker tag chef-mirror-backend:latest ${DOCKER_USER}/${APP_NAME}-backend:latest"
                    sh "docker tag chef-mirror-frontend:latest ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_HUB_CREDS}") {
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-backend:latest"
                        sh "docker push ${DOCKER_USER}/${APP_NAME}-frontend:latest"
                    }
                }
            }
        }
    }
    
    post {
        always {
            // ניקוי אימג'ים מקומיים כדי לא למלא את הדיסק של השרת
            sh 'docker system prune -f'
        }
    }
}