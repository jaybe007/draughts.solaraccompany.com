Add-Type -AssemblyName System.Drawing
$inPath = Join-Path $PSScriptRoot "..\images\board\wood-1024_100.jpg"
$outPng = Join-Path $PSScriptRoot "..\images\board\wood-1024_100_mirrored.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inPath)
$bmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Successfully generated mirrored board PNG: $outPng"
