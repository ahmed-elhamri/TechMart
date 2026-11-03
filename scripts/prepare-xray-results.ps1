$inputFile = "junit-results.xml"
$outputFile = "xray-junit-results.xml"

if (-not (Test-Path $inputFile)) {
    throw "Fichier JUnit introuvable : $inputFile"
}

[xml]$xml = Get-Content -Path $inputFile -Raw

$mappedCount = 0

foreach ($testcase in $xml.SelectNodes("//testcase")) {

    if ($testcase.name -match '\[(TEC-\d+)\]') {

        $testKey = $Matches[1]

        $properties = $testcase.SelectSingleNode("properties")

        if (-not $properties) {
            $properties = $xml.CreateElement("properties")
            $null = $testcase.PrependChild($properties)
        }

        $property = $xml.CreateElement("property")
        $property.SetAttribute("name", "test_key")
        $property.SetAttribute("value", $testKey)

        $null = $properties.AppendChild($property)

        Write-Host "Test mapped: $testKey"

        $mappedCount++
    }
    else {
        Write-Warning "Aucune clé Xray trouvée : $($testcase.name)"
    }
}

if ($mappedCount -eq 0) {
    throw "Aucune clé Xray trouvée. Importation annulée."
}

$xml.Save((Join-Path (Get-Location).Path $outputFile))

Write-Host "--------------------------------"
Write-Host "Transformation terminée."
Write-Host "Tests associés à Xray : $mappedCount"
Write-Host "Fichier généré : $outputFile"