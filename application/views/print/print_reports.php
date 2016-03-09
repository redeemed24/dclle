<?php

    // header
    $this->fpdf->Header();
    $this->fpdf->AddPage();
    $this->fpdf->Ln();
    
    //title
    $this->fpdf->SetFont('Arial','B',12);
    $this->fpdf->Cell(80);
    $this->fpdf->Cell(55,30,'GEOLOGIC ASSESSMENT REPORT');
    $this->fpdf->Ln(30);
    
    $this->fpdf->SetFont('Arial','B',9);
        // table header
        $this->fpdf->Cell(25,5,'Client','1');
        $this->fpdf->Cell(60,5,'Coordinates','1');
        $this->fpdf->Cell(80,5,'Address','1');
        $this->fpdf->Cell(60,5,'Geologist','1');
        $this->fpdf->Cell(30,5,'Date','1');
        $this->fpdf->Ln();
    
            //table content
            $this->fpdf->SetFont('Arial','',8);
            foreach($print as $row){
              
                $this->fpdf->Cell(25,5,$row->client_fname.' '.$row->client_lname,'1');
                $this->fpdf->Cell(60,5,str_replace('%',',',$row->loc_coor),'1');
                $this->fpdf->Cell(80,5,$row->area,'1');
                $this->fpdf->Cell(60,5,$row->geo_fname.' '.$row->geo_lname,'1');
                $this->fpdf->Cell(30,5,$row->send_date,'1');
                $this->fpdf->Ln();
            }
            
    $this->fpdf->Ln(30);
    // output
    $this->fpdf->Output();
    
?>