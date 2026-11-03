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

        stage('Xray Authentication') {
            steps {
                withCredentials([
                    string(credentialsId: 'xray-client-id', variable: 'XRAY_CLIENT_ID'),
                    string(credentialsId: 'xray-client-secret', variable: 'XRAY_CLIENT_SECRET')
                ]) {
                    powershell '''
                        $body = @{
                            client_id = $env:XRAY_CLIENT_ID
                            client_secret = $env:XRAY_CLIENT_SECRET
                        } | ConvertTo-Json
        
                        try {
                            $response = Invoke-RestMethod `
                                -Uri "https://xray.cloud.getxray.app/api/v2/authenticate" `
                                -Method Post `
                                -ContentType "application/json" `
                                -Body $body
        
                            if (-not $response) {
                                throw "Authentication failed: empty token"
                            }
        
                            Write-Host "Xray authentication successful!"
                        }
                        catch {
                            Write-Error "Xray authentication failed."
                            throw
                        }
                    '''
                }
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
                        script: 'npx playwright test tests/TS-SMOKE.spec.js',
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
