<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reportes_tcpdf extends CI_Controller {

function __construct()
	{
		parent::__construct();
		$this->load->helper('url');
		$this->load->library('My_tcpdf');
		$this->load->library('UtilsWrapper');

		$this->load->model('Reportes_model');
	}// __construct()


	public function carta_responsiva($usuario){
		if (Utilswrapper::verifica_sesion_redirige($this)) {

		$idusuario = $usuario;
		$director = mb_strtoupper($this->input->post('director'));

		$pdf = new My_tcpdf('P', 'mm', 'A4', true, 'UTF-8', false);

		// set document (meta) information
		$pdf->SetCreator(PDF_CREATOR);
		$pdf->SetAuthor('SEP');
		$pdf->SetTitle('Carta reponsiva');
		$pdf->SetSubject('');
		$pdf->SetKeywords('');

		// add a page
		$pdf->AddPage();

		//imagenes

		// set JPEG quality
		$pdf->setJPEGQuality(75);
		// echo base_url(); die();
		// echo base_url().'assets/img/logoGEP.png'; die();
		// echo  $_SERVER["HTTP_HOST"].'/yolixtli/assets/img/logoGEP.png'; die();
		// echo base_url().'/assets/img/logoGEP.png'; die();
		// $pdf->Image('http://localhost/yolixtli/assets/img/logoGEP.png', 20,5, 60, 20, '', '', '', true, 150, '', false, false, 1, false, false, false);
		$pdf->Image('assets/img/logoGEP.png', 20,5, 60, 20, '', '', '', true, 150, '', false, false, 1, false, false, false);

		function obtenerFechaEnLetra($fecha){
    $num = date("j", strtotime($fecha));
    $anno = date("Y", strtotime($fecha));
    $mes = array('enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre');
    $mes = $mes[(date('m', strtotime($fecha))*1)-1];
    return $num.' de '.$mes.' de '.$anno;
		}


		$fecha=obtenerFechaEnLetra(date('Y-m-d'));
		// echo $a;die();
		// título
		$pdf->CreateTextBox('OFICIO:', 0, 10, 180, 10, 8, 'B', 'R');
		$pdf->CreateTextBox('ASUNTO: Responsiva', 0, 14, 180, 10, 8, 'B', 'R');
		$pdf->CreateTextBox('"Cuatro veces Heroica Puebla de Zaragoza", a '.$fecha, 0, 20, 180, 10, 8, 'N', 'R');

		$pdf->Ln(40);
		$pdf->CreateTextBox('C. '.$director, 0, 30, 180, 10, 8, 'B', 'L');
		// $pdf->CreateTextBox('ENLACE DE CONTROL ESCOLAR', 0, 28, 180, 10, 8, 'B', 'L');
		// $pdf->CreateTextBox('DIRECCIÓN GENERAL DE DESARROLLO EDUCATIVO', 0, 31, 180, 10, 8, 'B', 'L');
		$pdf->CreateTextBox('DIRECTOR(A) DEL CENTRO DE TRABAJO', 0, 33, 180, 10, 8, 'B', 'L');
		$pdf->CreateTextBox('PRESENTE.', 0, 36, 180, 10, 8, 'B', 'L');


		$palabra = "https://yolixtli.gob.mx";



		$array_datos = $this->Reportes_model->carta_responsiva($idusuario);
		// echo "<pre>"; print_r($array_datos); die();
		$texto1  = "C. ".$array_datos['nombre_completo']." por este conducto reciba un cordial saludo y al mismo tiempo, notificarle que ya cuenta
		con usuario para la operación del Sistema de Yolixtli ".$palabra;
		// $pdf->CreateTextBox($texto1, 0, 40, 180, 10, 8, 'N', 'L');

		// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0)

		// $pdf->MultiCell(0, 10, "hola", 0, 'L', 1, 0, '', '', true);
		// $pdf->MultiCell($w=0, $h=0, "hola", $border=0, $align='L', $fill=false, $ln=1, $x='', $y='', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);
		$pdf->MultiCell($w=0, $h=0, $texto1, $border=0, $align='L', $fill=false, $ln=0, $x='20', $y='50', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);
		// $pdf->Ln(20);


	$html= <<<EOT
	<style>
table, th, td {
  border: 1px solid black;
	padding: 3px;
	text-align: center;
}
</style>
	<table>
	  <tr>
	    <th>USUARIO</th>
	    <th>CLAVE DE ACCESO</th>
	  </tr>
	  <tr>
		<td>
EOT;

$html.= $array_datos['username'];

$html.= <<<EOT
</td>
<td>
EOT;


$html.= $array_datos['clave'];

$html.= <<<EOT
</td>
</tr>
</table>
EOT;
// $pdf->writeHTMLCell(80, '', '', '', $html, 1, 1, 1, true, 'J', true);
		  $pdf->writeHTMLCell(80,10,63,67, $html, 0, 1, 0, true, '', true);

			$texto2  = "El sistema cuenta con una bitácora de movimientos realizados, tales como: altas, traslados, bajas, captura de evaluaciones lo cual impacta directamente en la base de datos Estatal de alumnos en Puebla, queda bajo su responsabilidad el contenido, movimientos y descargas que realice en dicho sistema.";
			$pdf->MultiCell($w=0, $h=0, $texto2, $border=0, $align='L', $fill=false, $ln=0, $x='20', $y='90', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);

			$texto3  = "Así mismo, le manifiesto que el manejo y uso de la cuenta de acceso al sistema, se sujeta a lo previsto en el Título Tercero Capítulo I, Artículos 49, 50 Fracciones I,IV y XXI, Capítulo II, Artículos 57 y 58 de la Ley de Responsabilidades de los Servicios Públicos del Estado de Puebla.";
			$pdf->MultiCell($w=0, $h=0, $texto3, $border=0, $align='L', $fill=false, $ln=0, $x='20', $y='105', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);


			// $texto4  = "ATENTAMENTE";
			// $pdf->MultiCell($w=0, $h=0, $texto4, $border=0, $align='L', $fill=false, $ln=0, $x='90', $y='140', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);

			// $texto5  = "SUFRAGIO EFECTIVO. NO REELECCIÓN";
			// $pdf->MultiCell($w=0, $h=0, $texto5, $border=0, $align='L', $fill=false, $ln=0, $x='75', $y='145', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);


			// $texto6  = $director;
			// $pdf->MultiCell($w=0, $h=0, $texto6, $border=0, $align='L', $fill=false, $ln=0, $x='40', $y='175', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);
			//
			// $texto7  = "DIRECTOR";
			// $pdf->MultiCell($w=0, $h=0, $texto7, $border=0, $align='L', $fill=false, $ln=0, $x='45', $y='180', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);


			$texto6  = $array_datos['nombre_completo'];
			$pdf->MultiCell($w=0, $h=0, $texto6, $border=0, $align='C', $fill=false, $ln=0, $x='15', $y='155', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);

			$texto7  = "RESPONSABLE QUE RECIBE";
			$pdf->MultiCell($w=0, $h=0, $texto7, $border=0, $align='C', $fill=false, $ln=0, $x='15', $y='160', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);

			$texto7_1  = 'C. '.$director;
			$pdf->MultiCell($w=0, $h=0, $texto7_1, $border=0, $align='C', $fill=false, $ln=0, $x='15', $y='205', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);

			$texto7_2  = "DIRECTOR(A) DEL CENTRO DE TRABAJO";
			$pdf->MultiCell($w=0, $h=0, $texto7_2, $border=0, $align='C', $fill=false, $ln=0, $x='15', $y='210', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);




			$texto8  = "SECRETARÍA DE EDUCACIÓN PÚBLICA";
			$pdf->MultiCell($w=0, $h=0, $texto8, $border=0, $align='L', $fill=false, $ln=0, $x='20', $y='260', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);

			$texto9  = "DIRECCIÓN GENERAL DE PLANEACIÓN Y SERVICIO PROFESIONAL DOCENTE";
			$pdf->MultiCell($w=0, $h=0, $texto9, $border=0, $align='L', $fill=false, $ln=0, $x='20', $y='265', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);

			$texto10  = "DIRECCIÓN DE CONTROL ESCOLAR";
			$pdf->MultiCell($w=0, $h=0, $texto10, $border=0, $align='L', $fill=false, $ln=0, $x='20', $y='270', $reseth=true, $stretch=0, $ishtml=false, $autopadding=true, $maxh=0);


		//Close and output PDF document
		$pdf->Output('carta_responsiva.pdf', 'I');
				}// verifica_sesion_redirige
	}// carta_responsiva()




	public function ruta_de_mejora($idcfg){

		$idcentrocfg=$idcfg;
		// echo $idcentrocfg;die();
			$pdf = new My_tcpdf('P', 'mm', 'A4', true, 'UTF-8', false);

			// set document (meta) information
			$pdf->SetCreator(PDF_CREATOR);
			$pdf->SetAuthor('SEP');
			$pdf->SetTitle('Ruta de mejora');
			$pdf->SetSubject('');
			$pdf->SetKeywords('');

			// add a page
			$pdf->AddPage();

			//imagenes

			// set JPEG quality
			$pdf->setJPEGQuality(75);
			$pdf->Image('assets/img/logoGEP.png', 10,10, 60, 20, '', '', '', true, 150, '', false, false, 1, false, false, false);
			$array_datos = $this->Reportes_model->get_datos_escuela($idcentrocfg);
			$array_datos_rutas = $this->Reportes_model->get_rutas($idcentrocfg);
			// echo "<pre>";print_r($array_datos_rutas);die();

			$pdf->CreateTextBox('CCT: '.$array_datos['cct'], 125, 5, 180, 10, 8, 'B', 'L');
			$pdf->CreateTextBox('ESCUELA: '.$array_datos['nombre'], 125, 10, 180, 10, 8, 'B', 'L');
			$pdf->CreateTextBox('CICLO: '.$array_datos['ciclo'].' FECHA: '.date("d/m/Y"), 125,15, 180, 10, 8, 'B', 'L');

			$pdf->CreateTextBox('', 120,15, 180, 10, 8, 'N', 'L');

			$html1="";
			foreach ($array_datos_rutas as $rutas) {
				// echo "<pre>"; print_r($rutas); die();
				$orden=$rutas['orden'];
				// echo $obj;
				$tema=$rutas['tema'];
				$indicador=$rutas['indicador'];
				$objetivo=$rutas['objetivo'];
				$problematica=$rutas['problematicas'];
				$evidencia=$rutas['evidencias'];
				$observaciones=$rutas['observaciones'];
				$observacionessuperv=$rutas['observacionessuperv'];
				$html1.= '<p>
				<table WIDTH="540" align="left" style="border: 1px solid gray; padding-top:2px; padding-left:4px; padding-right:4px; padding-bottom:5px;">
				<thead>
				<tr>
						<td colspan="1"><span style="font-weight: bold;">Orden: </span>'.$orden.'</td>
						<td colspan="1"><span style="font-weight: bold;">Tema: </span> '.$tema.'</td>
						<td colspan="1"><span style="font-weight: bold;">Indicador APA: </span>'.$indicador.'</td>
				</tr>
				<tr>
						<td colspan="3" align="left"><span style="font-weight: bold;">Objetivo: </span>'.$objetivo.'</td>
				</tr>
				<tr>
						<td colspan="3" align="left"><span style="font-weight: bold;">Problematica(s): </span>'.$problematica.'</td>
				</tr>
				<tr>
						<td colspan="3"align="left"><span style="font-weight: bold;">Evidencia(s): </span>'.$evidencia.'</td>
				</tr>
				<tr>
						<td colspan="3"align="left"><span style="font-weight: bold;">Observaciones: </span>'.$observaciones.'</td>
				</tr>
				<tr>
						<td colspan="3"align="left"><span style="font-weight: bold;">Observaciones supervisor: </span>'.$observacionessuperv.'</td>
				</tr>
				</thead><tbody><tr><td colspan="3">
			';

			// ACA VAMOS A PINTAR LAS ACTIVIDADES
			$array_actividades = $this->Reportes_model->get_actividades_xidrutatema($rutas['idrutamtema']);

			$html1 .= '
			<table WIDTH="532" style="padding:2px;">
						<tr>
								<td style="border: 1px solid black; width:4%" align="center"><span style="font-weight: bold;">No. </span></td>
								<td style="border: 1px solid black; width:40%" align="center"><span style="font-weight: bold;">Actividad</span></td>
								<td style="border: 1px solid black; width:15%" align="center"><span style="font-weight: bold;">Ámbito</span></td>
								<td style="border: 1px solid black; width:10%" align="center"><span style="font-weight: bold;">F. inicio</span></td>
								<td style="border: 1px solid black; width:10%" align="center"><span style="font-weight: bold;">F. fin</span></td>
								<td style="border: 1px solid black; width:14%" align="center"><span style="font-weight: bold;">Recursos</span></td>
								<td style="border: 1px solid black; width:7%" align="center"><span style="font-weight: bold;">Avance</span></td>
						</tr>
						';


			$contador = 0;
			if(count($array_actividades)>0){
//
foreach ($array_actividades as $key => $actividad) {
	$contador ++;
	$html1.= '
	<tr>
			<td colspan="1" style="border: 1px solid black;">'.$contador.'</td>
			<td colspan="1" style="border: 1px solid black;">'.$actividad['descripcion'].'</td>
			<td colspan="1" style="border: 1px solid black;">'.$actividad['ambito'].'</td>
			<td colspan="1" style="border: 1px solid black;">'.$actividad['finicio'].'</td>
			<td colspan="1" style="border: 1px solid black;">'.$actividad['ffin'].'</td>
			<td colspan="1" style="border: 1px solid black;">'.$actividad['recursos'].'</td>
			<td colspan="1" style="border: 1px solid black;">'.$actividad['avance'].'</td>
	</tr>';

}
// $html1.="</tr>";
//
}else{
	$html1.= '<tr>
	<td colspan="7" style="border: 1px solid black;"> Sin actividades </td>
	</tr>';
}

$html1.=  '</table></td></tr></tbody></table></p>';
			}
			$html_final = <<<EOT
			$html1
EOT;

			// die();
			// echo $html1; die();
					$pdf->writeHTMLCell(10,0,10,40, $html_final, 0, 1, 0, true, '', '');
					// $pdf->writeHTMLCell(10,0,20,80, $html2, 0, 1, 0, true, '', '');

			$pdf->CreateTextBox('RUTA DE MEJORA', 0,25, 180, 10,16, 'B', 'C');

		$pdf->Output('ruta_de_mejora.pdf', 'I');
	}// ruta_de_mejora()

}
