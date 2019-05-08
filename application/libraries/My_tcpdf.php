<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once dirname(__FILE__) . '/tcpdf/tcpdf.php';

/*
class My_tcpdf extends TCPDF
{
    function __construct()
    {
        parent::__construct();
    }

    public function Header() {
            $this->setJPEGQuality(90);
            $this->Image('logo.png', 120, 10, 75, 0, 'PNG', 'assets/img/logoGEP.png');

    }
    public function Footer() {
            $this->SetY(-15);
            $this->SetFont(PDF_FONT_NAME_MAIN, 'I', 8);
            $this->Cell(0, 10,'', 0, false, 'C');
    }
    public function CreateTextBox($textval, $x = 0, $y, $width = 0, $height = 10, $fontsize = 10, $fontstyle = '', $align = 'L') {
            $this->SetXY($x+20, $y); // 20 = margin left
            $this->SetFont(PDF_FONT_NAME_MAIN, $fontstyle, $fontsize);
            $this->Cell($width, $height, $textval, 0, false, $align);
    }
}
*/


class My_tcpdf extends TCPDF
{
    public $flag_no_pagina = FALSE;

    function __construct()
    {
        parent::__construct();
    }

    public function Header() {
            $this->setJPEGQuality(90);
            $this->Image('logo.png', 120, 10, 75, 0, 'PNG', 'assets/img/logoGEP.png');
    }// Header()

    public function Footer() {
            $this->SetY(-15);
            $this->SetFont(PDF_FONT_NAME_MAIN, 'I', 8);
            if($this->flag_no_pagina){
              $this->Cell(0, 10,$this->getAliasNumPage(), 0, false, 'C');
            }else{
              $this->Cell(0, 10,'', 0, false, 'C');
            }

    }// Footer()

    public function CreateTextBox($textval, $x = 0, $y, $width = 0, $height = 10, $fontsize = 10, $fontstyle = '', $align = 'L') {
            $this->SetXY($x+20, $y); // 20 = margin left
            $this->SetFont(PDF_FONT_NAME_MAIN, $fontstyle, $fontsize);
            $this->Cell($width, $height, $textval, 0, false, $align);
    }// CreateTextBox()
    
}// class

/* End of file Pdf.php */
/* Location: ./application/libraries/Pdf.php */
