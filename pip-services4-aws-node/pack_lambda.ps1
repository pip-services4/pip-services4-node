#!/usr/bin/env pwsh

try {

    # Create tmp folder for pack
    if (Test-Path "$PSScriptRoot/tmp") {
        Remove-Item -Recurse -Force -Path "$PSScriptRoot/tmp"
    }
    
    New-Item -ItemType Directory -Force -Path "$PSScriptRoot/tmp"
    
    Set-StrictMode -Version latest
    $ErrorActionPreference = "Stop"

    # Get component data and set necessary variables
    $component = Get-Content -Path "$PSScriptRoot/component.json" | ConvertFrom-Json
    $buildImage = "$($component.registry)/$($component.name):$($component.version)-$($component.build)-lambda"
    $container = $component.name

    # Build docker image
    docker build -f "$PSScriptRoot/docker/Dockerfile.build" -t $buildImage $PSScriptRoot

    # Create and copy compiled files, then destroy
    docker create --name $container $buildImage
    docker cp "$($container):/app/obj" "$PSScriptRoot/tmp/obj"
    docker rm $container

    # Copy dependency files and sources
    New-Item -ItemType Directory -Force -Path "$PSScriptRoot/tmp/config"
    Copy-Item "$PSScriptRoot/config/config.yml" "$PSScriptRoot/tmp/config/config.yml"
    Copy-Item "$PSScriptRoot/src/" "$PSScriptRoot/tmp/src/" -Recurse
    Copy-Item "$PSScriptRoot/test/" "$PSScriptRoot/tmp/test/" -Recurse
    Copy-Item "$PSScriptRoot/node_modules/" "$PSScriptRoot/tmp/node_modules/" -Recurse
    Copy-Item "$PSScriptRoot/package.json" "$PSScriptRoot/tmp/package.json"
    Copy-Item "$PSScriptRoot/bin/lambda.js" "$PSScriptRoot/tmp/index.js"

    # Create dist folder
    if (Test-Path "$PSScriptRoot/dist") {
        Remove-Item -Recurse -Force -Path "$PSScriptRoot/dist"
    }
    New-Item -ItemType Directory -Force -Path "$PSScriptRoot/dist"

    $component = Get-Content -Path "$PSScriptRoot/component.json" | ConvertFrom-Json

    # Pack archive for lambda

    $compress = @{
        Path             = "$PSScriptRoot/tmp/*"
        CompressionLevel = "Optimal" #"NoCompression"
        DestinationPath  = "$PSScriptRoot/dist/$($component.name)-lambda-v$($component.version).zip"
    }
    # Archiving
    Compress-Archive @compress
    
    Write-Host "The archive was successfully created."
}
finally {
    Remove-Item -Recurse -Force -Path "$PSScriptRoot/tmp"
}