<?php
/**
 * Generates a valid, standalone PDF document:
 * "Nigerian Draughts - Official Tournament Hosting Guide"
 * Standard PDF-1.4 format with Catalog, Pages, Fonts, Page Content Streams and XRef.
 */

class SimplePdf {
    private $objects = [];
    private $pages = [];
    private $currentPageContent = '';
    private $offsets = [];

    public function addPage() {
        if ($this->currentPageContent !== '') {
            $this->pages[] = $this->currentPageContent;
        }
        $this->currentPageContent = '';
    }

    public function addText($text, $x, $y, $font = 'F1', $size = 12, $r = 0, $g = 0, $b = 0) {
        // Escape special chars
        $text = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);
        $cr = sprintf('%.2f', $r);
        $cg = sprintf('%.2f', $g);
        $cb = sprintf('%.2f', $b);
        $this->currentPageContent .= "q\n{$cr} {$cg} {$cb} rg\nBT\n/{$font} {$size} Tf\n1 0 0 1 {$x} {$y} Tm\n({$text}) Tj\nET\nQ\n";
    }

    public function addRect($x, $y, $w, $h, $r = 0.9, $g = 0.9, $b = 0.9, $stroke = false, $sr = 0, $sg = 0, $sb = 0) {
        $cr = sprintf('%.2f', $r);
        $cg = sprintf('%.2f', $g);
        $cb = sprintf('%.2f', $b);
        $out = "q\n{$cr} {$cg} {$cb} rg\n";
        if ($stroke) {
            $csr = sprintf('%.2f', $sr);
            $csg = sprintf('%.2f', $sg);
            $csb = sprintf('%.2f', $sb);
            $out .= "{$csr} {$csg} {$csb} RG 1 w\n";
            $out .= "{$x} {$y} {$w} {$h} re B\n";
        } else {
            $out .= "{$x} {$y} {$w} {$h} re f\n";
        }
        $out .= "Q\n";
        $this->currentPageContent .= $out;
    }

    public function render() {
        if ($this->currentPageContent !== '') {
            $this->pages[] = $this->currentPageContent;
        }

        $pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";

        // Object 1: Catalog
        // Object 2: Outlines
        // Object 3: Pages
        // Object 4: Font F1 (Helvetica)
        // Object 5: Font F2 (Helvetica-Bold)
        // Subsequent objects: Content streams, Page objects

        $numPages = count($this->pages);
        $pageObjIds = [];
        $contentObjIds = [];

        $currentObjId = 6;
        for ($i = 0; $i < $numPages; $i++) {
            $pageObjIds[] = $currentObjId++;
            $contentObjIds[] = $currentObjId++;
        }

        $objectsData = [];

        // 1: Catalog
        $objectsData[1] = "<< /Type /Catalog /Pages 3 0 R >>";
        // 2: Outlines
        $objectsData[2] = "<< /Type /Outlines /Count 0 >>";

        // 3: Pages
        $kidsStr = implode(' 0 R ', $pageObjIds) . ' 0 R';
        $objectsData[3] = "<< /Type /Pages /Kids [{$kidsStr}] /Count {$numPages} >>";

        // 4: Font F1
        $objectsData[4] = "<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
        // 5: Font F2
        $objectsData[5] = "<< /Type /Font /Subtype /Type1 /Name /F2 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

        for ($i = 0; $i < $numPages; $i++) {
            $pId = $pageObjIds[$i];
            $cId = $contentObjIds[$i];

            // Page
            $objectsData[$pId] = "<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595.28 841.89] /Contents {$cId} 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> >>";

            // Content
            $stream = $this->pages[$i];
            $len = strlen($stream);
            $objectsData[$cId] = "<< /Length {$len} >>\nstream\n{$stream}\nendstream";
        }

        // Assemble objects & xref
        $offsets = [];
        $offsets[0] = 0;

        foreach ($objectsData as $id => $data) {
            $offsets[$id] = strlen($pdf);
            $pdf .= "{$id} 0 obj\n{$data}\nendobj\n";
        }

        $xrefStart = strlen($pdf);
        $totalObjs = count($objectsData) + 1;
        $pdf .= "xref\n0 {$totalObjs}\n";
        $pdf .= "0000000000 65535 f \n";
        for ($id = 1; $id < $totalObjs; $id++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$id]);
        }

        $pdf .= "trailer\n<< /Size {$totalObjs} /Root 1 0 R >>\nstartxref\n{$xrefStart}\n%%EOF";
        return $pdf;
    }
}

// Generate the Guide PDF
$pdf = new SimplePdf();

// --- PAGE 1: COVER & RULES ---
$pdf->addPage();
// Header bar
$pdf->addRect(0, 780, 595.28, 62, 0.08, 0.53, 0.32); // Emerald Green
$pdf->addText("NAIJA DRAUGHTS FEDERATION (NDF)", 40, 808, 'F2', 18, 1, 1, 1);
$pdf->addText("OFFICIAL TOURNAMENT HOSTING & CHAMPIONSHIP GUIDE", 40, 792, 'F1', 10, 0.95, 0.95, 0.95);

// Intro Box
$pdf->addRect(40, 690, 515.28, 70, 0.96, 0.97, 0.99, true, 0.8, 0.85, 0.9);
$pdf->addText("WELCOME TO THE OFFICIAL CHAMPIONSHIP ENGINE", 55, 738, 'F2', 12, 0.1, 0.2, 0.4);
$pdf->addText("This guide provides hosts, tournament directors, and community leaders with standard", 55, 722, 'F1', 10, 0.2, 0.25, 0.3);
$pdf->addText("rules, coin requirements, bracket mechanics, and automated payout schedules.", 55, 706, 'F1', 10, 0.2, 0.25, 0.3);

// Section 1: Host Requirements
$pdf->addRect(40, 655, 515.28, 22, 0.92, 0.75, 0.15); // Golden banner
$pdf->addText("1. HOST REQUIREMENTS & COIN POLICIES", 50, 662, 'F2', 11, 0.1, 0.1, 0.1);

$pdf->addText("- Minimum 20 Platform Coins: Every host must maintain at least 20 coins to initiate any championship.", 45, 638, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Creation Fee: Exactly 20 coins is deducted as a platform hosting fee upon publishing registration.", 45, 622, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Host Sponsorship: If 'Who is paying' is set to Host, the host sponsors all player entry fees upfront.", 45, 606, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("  Example: 8 players x 100 coins = 800 coins + 20 fee = 820 coins total required from the host.", 45, 590, 'F1', 9.5, 0.2, 0.3, 0.5);

// Section 2: Tournament Types & Formats
$pdf->addRect(40, 555, 515.28, 22, 0.12, 0.2, 0.3);
$pdf->addText("2. TOURNAMENT TYPES & BRACKET FORMATS", 50, 562, 'F2', 11, 1, 1, 1);

$pdf->addText("A. Knockout (Single Elimination): Traditional tournament bracket. Winners advance; losers are eliminated.", 45, 538, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("B. League (Round-Robin): Contenders battle for points across scheduled match fixtures.", 45, 522, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("C. Best of 5 / Best of 3: Extended series between masters to determine the undisputed winner.", 45, 506, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("D. Player Capacities Supported: Exactly 4, 8, 16, 32, or 64 players.", 45, 490, 'F1', 9.5, 0.1, 0.1, 0.1);

// Section 3: Official Rule Types
$pdf->addRect(40, 455, 515.28, 22, 0.12, 0.2, 0.3);
$pdf->addText("3. OFFICIAL RULE SETS", 50, 462, 'F2', 11, 1, 1, 1);

$pdf->addText("1. Nigeria: Free capture choice, flying kings with multi-jump directional stops, 10x10 board.", 45, 438, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("2. Ghana (Damii): Immediate crown freeze on king row, 16-move 3v1 endgame enforcement.", 45, 422, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("3. International (FMJD): Strict majority capture rule; king moves across open diagonals.", 45, 406, 'F1', 9.5, 0.1, 0.1, 0.1);

// Section 4: Player Join Modes
$pdf->addRect(40, 370, 515.28, 22, 0.12, 0.2, 0.3);
$pdf->addText("4. PLAYER PARTICIPATION & JOIN MODES", 50, 377, 'F2', 11, 1, 1, 1);

$pdf->addText("- Join Tournament Button: Open access for any authenticated contender with sufficient coin stake.", 45, 352, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Request Participation: Contenders apply; the host approves or rejects registrations.", 45, 336, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Invited Only: Private championship requiring a special direct invitation.", 45, 320, 'F1', 9.5, 0.1, 0.1, 0.1);

// Section 5: Scheduling & Deadlines
$pdf->addRect(40, 285, 515.28, 22, 0.12, 0.2, 0.3);
$pdf->addText("5. GMT SCHEDULING & REGISTRATION DEADLINES", 50, 292, 'F2', 11, 1, 1, 1);

$pdf->addText("- All times on the platform operate in GMT / UTC for fair global participation.", 45, 268, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Registration Deadline: Contenders must join before the deadline timestamp (dd/mm/yyyy --:--).", 45, 252, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Tournament Start: As soon as the bracket reaches capacity or the start timestamp triggers.", 45, 236, 'F1', 9.5, 0.1, 0.1, 0.1);

// Section 6: Prize Pool Payouts
$pdf->addRect(40, 200, 515.28, 22, 0.08, 0.53, 0.32);
$pdf->addText("6. AUTOMATED PRIZE POOL DISTRIBUTION", 50, 207, 'F2', 11, 1, 1, 1);

$pdf->addText("- Champion (1st Place): 70% of total prize pot credited immediately to winner wallet/coins.", 45, 182, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Runner-Up (2nd Place): 20% of total prize pot credited immediately to runner-up.", 45, 166, 'F1', 9.5, 0.1, 0.1, 0.1);
$pdf->addText("- Federation Platform Commission: 10% retained for escrow security, ratings, and server maintenance.", 45, 150, 'F1', 9.5, 0.1, 0.1, 0.1);

// Footer
$pdf->addRect(40, 80, 515.28, 45, 0.94, 0.95, 0.96);
$pdf->addText("HOST CHECKLIST: Ensure your account has 20+ coins, specify valid start/end GMT dates,", 55, 108, 'F2', 9, 0.2, 0.2, 0.2);
$pdf->addText("and notify your club members on WhatsApp to join before the registration deadline!", 55, 94, 'F1', 9, 0.3, 0.3, 0.3);

$pdf->addText("Page 1 of 1 | Naija Draughts Official Federation Tournament Document", 155, 45, 'F1', 8, 0.5, 0.5, 0.5);

$docDir = __DIR__ . '/../docs';
if (!is_dir($docDir)) @mkdir($docDir, 0777, true);
$targetPdf = $docDir . '/Nigerian_Draughts_Tournament_Hosting_Guide.pdf';
file_put_contents($targetPdf, $pdf->render());
echo "✓ Generated official PDF guide at: {$targetPdf} (" . filesize($targetPdf) . " bytes)\n";
