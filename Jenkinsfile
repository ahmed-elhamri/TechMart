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

    stage('Run Playwright Tests') {
      steps {
        script {
            def exitCode = bat(
              script: 'npx playwright test tests/TS-SMOKE.spec.js tests/TS-CATALOG.spec.js',
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

                    # 3. Transform JUnit XML for Xray
                    [xml]$xml = Get-Content "junit-results.xml"

                    $testCases = $xml.SelectNodes("//testcase")
                    $mappedCount = 0

                    foreach ($testCase in $testCases) {
                        $start = $testCase.name.IndexOf('[')
                        $end = $testCase.name.IndexOf(']')

                        if ($start -ge 0 -and $end -gt $start) {
                            $testKey = $testCase.name.Substring(
                                $start + 1,
                                $end - $start - 1
                            )

                            if ($testKey.StartsWith("TEC-")) {
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
                    }

                    if ($mappedCount -eq 0) {
                        throw "No Xray tests were mapped. Check test keys in JUnit report."
                    }

                    Write-Host "Successfully mapped $mappedCount tests to Xray."

                    $xml.Save("xray-junit-results.xml")

                    Write-Host "Xray JUnit report generated successfully."

                    # 4. Prepare Test Execution metadata

                    [xml]$report = Get-Content "xray-junit-results.xml"

                    $root = $report.DocumentElement

                    # Get all test suites
                    $testSuites = @($report.SelectNodes("//testsuite"))

                    if ($testSuites.Count -eq 0) {
                        throw "No test suites found in JUnit report."
                    }

                    # Extract and clean suite names
                    $suiteNames = @(
                        $testSuites | ForEach-Object {
                            $name = [System.IO.Path]::GetFileNameWithoutExtension(
                                $_.GetAttribute("name")
                            )

                            $name = $name.Replace(".spec", "")
                            $name
                        } | Sort-Object -Unique
                    )

                    # Display detected suites in Jenkins console
                    Write-Host "Detected test suites:"
                    $suiteNames | ForEach-Object {
                        Write-Host "- $_"
                    }

                    # Build suite description
                    if ($suiteNames.Count -eq 1) {
                        $suiteDescription = "Test Suite: $($suiteNames[0])"
                    }
                    else {
                        $suiteList = $suiteNames -join "`n- "
                        $suiteDescription = "Test Suites:`n- $suiteList"
                    }

                    # Execution information
                    $testSuite = $testSuites[0]

                    $executionDate = $testSuite.GetAttribute("timestamp")
                    $duration = $root.GetAttribute("time")

                    $reportUrl = "$env:BUILD_URL" + "Playwright_20HTML_20Report/"

                    $summary = "Playwright Automated Test Execution"

                    $description = "Project: TEC`n`n" +
                        "$suiteDescription`n`n" +
                        "Jenkins Build: $env:BUILD_URL`n`n" +
                        "Build Number: $env:BUILD_NUMBER`n`n" +
                        "Execution Date: $executionDate`n`n" +
                        "Playwright Test Duration: $duration seconds`n`n" +
                        "Playwright HTML Report: $reportUrl"

                    # Display generated metadata
                    Write-Host "Generated Test Execution description:"
                    Write-Host $description

                    $executionInfo = @{
                        fields = @{
                            project = @{ key = "TEC" }
                            summary = $summary
                            description = $description
                            issuetype = @{ name = "Test Execution" }
                        }
                    }

                    $json = $executionInfo | ConvertTo-Json -Depth 10

                    [System.IO.File]::WriteAllText(
                        "xray-execution-info.json",
                        $json,
                        [System.Text.UTF8Encoding]::new($false)
                    )

                    Write-Host "Test Execution metadata generated."

                    # 5. Import JUnit report + execution metadata into Xray

                    $response = & curl.exe `
                        --silent `
                        --show-error `
                        --fail `
                        -X POST `
                        "https://xray.cloud.getxray.app/api/v2/import/execution/junit/multipart" `
                        -H "Authorization: Bearer $token" `
                        -F "results=@xray-junit-results.xml;type=application/xml" `
                        -F "info=@xray-execution-info.json;type=application/json"

                    if ($LASTEXITCODE -ne 0) {
                        throw "Xray import failed."
                    }

                    Write-Host "Xray import successful!"
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
