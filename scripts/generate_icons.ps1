Add-Type -AssemblyName System.Drawing

function Generate-DraughtsIcon($size, $outputPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # 1. Background dark gradient
    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)), ([System.Drawing.Color]::FromArgb(255, 2, 6, 23)), 45.0
    $g.FillRectangle($bgBrush, $rect)

    # 2. Outer border ring
    $borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(200, 16, 185, 129)), ($size * 0.025)
    $g.DrawRectangle($borderPen, ($size * 0.02), ($size * 0.02), ($size * 0.96), ($size * 0.96))

    # 3. Nigerian Flag Accent (Top)
    $flagW = $size * 0.12
    $flagH = $size * 0.035
    $flagY = $size * 0.08
    $flagX = ($size - ($flagW * 3)) / 2

    $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0, 135, 81))
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $g.FillRectangle($greenBrush, $flagX, $flagY, $flagW, $flagH)
    $g.FillRectangle($whiteBrush, ($flagX + $flagW), $flagY, $flagW, $flagH)
    $g.FillRectangle($greenBrush, ($flagX + $flagW * 2), $flagY, $flagW, $flagH)

    # 4. Draughts Piece (Emerald Green)
    $pieceRadius = $size * 0.35
    $centerX = $size / 2
    $centerY = $size * 0.55
    $pieceRect = New-Object System.Drawing.RectangleF ($centerX - $pieceRadius), ($centerY - $pieceRadius), ($pieceRadius * 2), ($pieceRadius * 2)

    $pieceBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $pieceRect, ([System.Drawing.Color]::FromArgb(255, 52, 211, 153)), ([System.Drawing.Color]::FromArgb(255, 4, 120, 87)), 45.0
    $g.FillEllipse($pieceBrush, $pieceRect)

    # Piece rim
    $rimPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(220, 110, 231, 183)), ($size * 0.018)
    $g.DrawEllipse($rimPen, $pieceRect)

    # Inner concentric ring
    $innerRadius = $pieceRadius * 0.65
    $innerRect = New-Object System.Drawing.RectangleF ($centerX - $innerRadius), ($centerY - $innerRadius), ($innerRadius * 2), ($innerRadius * 2)
    $innerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 6, 78, 59))
    $g.FillEllipse($innerBrush, $innerRect)
    $innerPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(200, 16, 185, 129)), ($size * 0.012)
    $g.DrawEllipse($innerPen, $innerRect)

    # 5. Golden Oba Crown in Center
    $goldBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $innerRect, ([System.Drawing.Color]::FromArgb(255, 251, 191, 36)), ([System.Drawing.Color]::FromArgb(255, 217, 119, 6)), 90.0

    $cw = $size * 0.16
    $ch = $size * 0.13
    $cx = $centerX - ($cw / 2)
    $cy = $centerY - ($ch / 2)

    # Crown points
    $p1 = New-Object System.Drawing.PointF $cx, ($cy + $ch)
    $p2 = New-Object System.Drawing.PointF $cx, $cy
    $p3 = New-Object System.Drawing.PointF ($cx + $cw * 0.28), ($cy + $ch * 0.55)
    $p4 = New-Object System.Drawing.PointF ($cx + $cw * 0.5), ($cy - $ch * 0.15)
    $p5 = New-Object System.Drawing.PointF ($cx + $cw * 0.72), ($cy + $ch * 0.55)
    $p6 = New-Object System.Drawing.PointF ($cx + $cw), $cy
    $p7 = New-Object System.Drawing.PointF ($cx + $cw), ($cy + $ch)

    $points = [System.Drawing.PointF[]]@($p1, $p2, $p3, $p4, $p5, $p6, $p7)
    $g.FillPolygon($goldBrush, $points)

    $crownPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 146, 64, 14)), ($size * 0.008)
    $g.DrawPolygon($crownPen, $points)

    # Crown pearls
    $pearlBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $pearlR = $size * 0.016
    $g.FillEllipse($pearlBrush, ($cx - $pearlR), ($cy - $pearlR), ($pearlR * 2), ($pearlR * 2))
    $g.FillEllipse($pearlBrush, (($cx + $cw * 0.5) - $pearlR), (($cy - $ch * 0.15) - $pearlR), ($pearlR * 2), ($pearlR * 2))
    $g.FillEllipse($pearlBrush, (($cx + $cw) - $pearlR), ($cy - $pearlR), ($pearlR * 2), ($pearlR * 2))

    $g.Dispose()
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated: $outputPath ($size x $size)"
}

Generate-DraughtsIcon 192 "icons/icon-192.png"
Generate-DraughtsIcon 512 "icons/icon-512.png"
Generate-DraughtsIcon 64 "favicon.ico"
