<?php
$src = __DIR__ . '/../images/board/wood-1024_100.jpg';
$dst = __DIR__ . '/../images/board/wood-1024_100_mirrored.jpg';

$im = imagecreatefromjpeg($src);
if (!$im) {
    die("Failed to load source image");
}

imageflip($im, IMG_FLIP_HORIZONTAL);
imagejpeg($im, $dst, 92);
imagedestroy($im);

echo "SUCCESS! Wrote $dst with size: " . filesize($dst) . " bytes\n";
