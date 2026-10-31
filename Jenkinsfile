pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ahmed-elhamri/TechMart.git'
            }
        }

        stage('Check Environment') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install chromium'
            }
        }
        
        // stage('Execute Playwright Tests') {
        //     steps {
        //         bat 'npx playwright test tests/TS-CART.spec.js'
        //     }
        // }

        stage('Run Playwright Tests') {
            steps {
                script {
                    def exitCode = bat(
                        script: 'npx playwright test tests/TS-CART.spec.js',
                        returnStatus: true
                    )

                    if (exitCode != 0) {
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }
    
    post {
        always {

           // Publier les résultats des tests
            junit(
                testResults: 'junit-results.xml',
                allowEmptyResults: true
            )
            publishHTML(target: [
                reportName: 'Playwright HTML Report',
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                alwaysLinkToLastBuild: true,
                keepAll: true,
                allowMissing: true
            ])
        }
    }
}