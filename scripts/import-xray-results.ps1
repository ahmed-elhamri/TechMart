$ErrorActionPreference = "Stop"

$resultsFile = "xray-junit-results.xml"
$outputFile = "xray-execution-info.json"

$clientId = $env:XRAY_CLIENT_ID
$clientSecret = $env:XRAY_CLIENT_SECRET

if (-not $clientId -or -not $clientSecret) {
    throw "Les variables XRAY_CLIENT_ID ou XRAY_CLIENT_SECRET sont manquantes."
}

if (-not (Test-Path $resultsFile)) {
    throw "Fichier introuvable : $resultsFile"
}

# 1. Authentification Xray
Write-Host "Authentification auprès de Xray Cloud..."

$authBody = @{
    client_id = $clientId
    client_secret = $clientSecret
} | ConvertTo-Json

$token = Invoke-RestMethod `
    -Uri "https://xray.cloud.getxray.app/api/v2/authenticate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $authBody

if (-not $token) {
    throw "Authentification Xray échouée."
}

Write-Host "Authentification réussie."

# 2. Lecture des résultats JUnit
[xml]$xml = Get-Content -Path $resultsFile -Raw

$testsuites = $xml.SelectNodes("//testsuite")

$suiteNames = @(
    $testsuites |
    ForEach-Object {
        [System.IO.Path]::GetFileNameWithoutExtension($_.name).Replace(".spec", "")
    } |
    Sort-Object -Unique
)

if ($suiteNames.Count -eq 1) {
    $suiteDescription = "Test Suite: $($suiteNames[0])"
}
else {
    $suiteDescription = "Test Suites:`n" + (($suiteNames | ForEach-Object { "- $_" }) -join "`n")
}

# 3. Calcul de la durée
$duration = [double]$xml.testsuites.time

# 4. Construction de la description
$description = @"
$suiteDescription

GitLab Pipeline: $env:CI_PIPELINE_ID
Branch: $env:CI_COMMIT_REF_NAME
Pipeline URL: $env:CI_PIPELINE_URL
Execution Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Playwright Test Duration: $duration seconds
"@

# 5. Préparation des métadonnées
$executionInfo = @{
    fields = @{
        project = @{
            key = "TEC"
        }
        summary = "Playwright Automated Test Execution"
        description = $description
        issuetype = @{
            name = "Test Execution"
        }
    }
    xrayFields = @{
        testPlanKey = "TEC-124"
    }
}

$jsonContent = $executionInfo | ConvertTo-Json -Depth 10

[System.IO.File]::WriteAllText(
    $outputFile,
    $jsonContent,
    (New-Object System.Text.UTF8Encoding($false))
)

Write-Host "Métadonnées générées : $outputFile"
Write-Host "Test Plan associé : TEC-124"

# 6. Importation des résultats dans Xray Cloud
Write-Host "Importation des résultats dans Xray..."

$response = & curl.exe `
    --silent `
    --show-error `
    -X POST `
    "https://xray.cloud.getxray.app/api/v2/import/execution/junit/multipart" `
    -H "Authorization: Bearer $token" `
    -F "results=@$resultsFile;type=application/xml" `
    -F "info=@$outputFile;type=application/json" `
    -w "`nHTTP_STATUS:%{http_code}"

if ($LASTEXITCODE -ne 0) {
    throw "Erreur lors de l'appel à l'API Xray."
}

$responseText = $response -join "`n"

Write-Host $responseText

if ($responseText -match "HTTP_STATUS:(200|201)") {
    Write-Host "Importation Xray réussie."

    $jsonResponse = $responseText -replace "`nHTTP_STATUS:\d{3}$", ""

    try {
        $result = $jsonResponse | ConvertFrom-Json
        Write-Host "Test Execution créé : $($result.key)"
    }
    catch {
        Write-Host "Réponse Xray reçue."
    }
}
else {
    throw "Échec de l'importation Xray."
}