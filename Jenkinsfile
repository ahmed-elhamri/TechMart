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

        // stage('Xray Authentication') {
        //     steps {
        //         withCredentials([
        //             string(credentialsId: 'xray-client-id', variable: 'XRAY_CLIENT_ID'),
        //             string(credentialsId: 'xray-client-secret', variable: 'XRAY_CLIENT_SECRET')
        //         ]) {
        //             powershell '''
        //                 $body = @{
        //                     client_id = $env:XRAY_CLIENT_ID
        //                     client_secret = $env:XRAY_CLIENT_SECRET
        //                 } | ConvertTo-Json
        
        //                 try {
        //                     $response = Invoke-RestMethod `
        //                         -Uri "https://xray.cloud.getxray.app/api/v2/authenticate" `
        //                         -Method Post `
        //                         -ContentType "application/json" `
        //                         -Body $body
        
        //                     if (-not $response) {
        //                         throw "Authentication failed: empty token"
        //                     }
        
        //                     Write-Host "Xray authentication successful!"
        //                 }
        //                 catch {
        //                     Write-Error "Xray authentication failed."
        //                     throw
        //                 }
        //             '''
        //         }
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

        stage('Import Results to Xray') {
            steps {
                withCredentials([
                    string(credentialsId: 'xray-client-id', variable: 'XRAY_CLIENT_ID'),
                    string(credentialsId: 'xray-client-secret', variable: 'XRAY_CLIENT_SECRET')
                ]) {
                    powershell '''
                        $ErrorActionPreference = "Stop"
        
                        # 1. Authenticate with Xray
                        $body = @{
                            client_id = $env:XRAY_CLIENT_ID
                            client_secret = $env:XRAY_CLIENT_SECRET
                        } | ConvertTo-Json
        
                        $token = Invoke-RestMethod `
                            -Uri "https://xray.cloud.getxray.app/api/v2/authenticate" `
                            -Method Post `
                            -ContentType "application/json" `
                            -Body $body
        
                        if (-not $token) {
                            throw "Xray authentication failed."
                        }
        
                        Write-Host "Xray authentication successful."
        
                        # 2. Check JUnit report
                        if (-not (Test-Path "junit-results.xml")) {
                            throw "JUnit report not found."
                        }

                        # Transform JUnit XML for Xray
                        [xml]$xml = Get-Content "junit-results.xml"
                        
                        $testCases = $xml.SelectNodes("//testcase")
                        $mappedCount = 0
                        
                        foreach ($testCase in $testCases) {
                            if ($testCase.name -match '\\[(TEC-[0-9]+)\\]')
                        
                                $testKey = $Matches[1]
                        
                                $properties = $testCase.SelectSingleNode("properties")
                        
                                if (-not $properties) {
                                    $properties = $xml.CreateElement("properties")
                                    $testCase.AppendChild($properties) | Out-Null
                                }
                        
                                $property = $xml.CreateElement("property")
                                $property.SetAttribute("name", "test_key")
                                $property.SetAttribute("value", $testKey)
                        
                                $properties.AppendChild($property) | Out-Null
                        
                                Write-Host "Mapped test to Xray: $testKey"
                        
                                $mappedCount++
                            }
                        }
                        
                        if ($mappedCount -ne 4) {
                            throw "Expected 4 mapped tests, but found $mappedCount."
                        }
                        
                        $xml.Save("xray-junit-results.xml")
                        
                        Write-Host "Xray JUnit report generated successfully."
        
                        # 3. Import JUnit results into Xray
                        $headers = @{
                            Authorization = "Bearer $token"
                        }
                        
                        $response = Invoke-RestMethod `
                            -Uri "https://xray.cloud.getxray.app/api/v2/import/execution/junit?projectKey=TEC" `
                            -Method Post `
                            -Headers $headers `
                            -ContentType "application/xml" `
                            -InFile "junit-results.xml"
                        
                        Write-Host "Xray import successful!"
                        $response | ConvertTo-Json -Depth 10
        
                        Write-Host "JUnit results successfully imported into Xray."
                        Write-Host $response
                    '''
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
