/***************************************************FILE_MGT*******************************************************************************/
window.onload = function(){
    fileMgt();
};

function fileMgt(){
	var base_url = 'http://localhost/dclle/public_html/'; /*****base url******/
	
	$("#file_b").click(function(){ // table list of files
	    $('#note_span').css('visibility','visible');
	    $('#cert_files').fadeIn('fast','swing',function(){
		$(document).keyup(function(e) { // escape button
		    if (e.keyCode == 27){
			$('#cert_files').fadeOut('fast','swing');
			$('#cert_wrap').fadeOut('fast','swing');
		    }   // esc
		});
	    });
	    
	    $('#cert_wrap').fadeIn('fast','swing');
	    
	    $('#close_files').click(function(){
		$('#cert_files').fadeOut('fast','swing');
		$('#cert_wrap').fadeOut('fast','swing');
	    });
	    
	    $('#search_files').click(function(){
		
		var month = $('[name="file_month"] option:selected').val();
		var year = $('[name="file_year"] option:selected').text();
		$.ajax({
		    type: 'POST',
		    url: base_url + 'index.php/wysiwyg_c/getSearch',
		    dataType: 'json',
		    cache: false,
		    data: {month: month, year: year},
		    success: function(data){
			$('#cert_list').empty();
			$('#note_span').css('visibility','hidden');
			if(data=='empty')
			{
			    $('#cert_list').append('<div id="div_empty">No results found</div>');
			}
			else
			{
			    $('#div_empty').remove();
			    $('#cert_list').append(data);
			}
		    },
		    error:function(xhr,status,errorThrown){alert(status);}
		});
	    });
	    
	    $('#print_reports').click(function(){
		var month_ = $('[name="file_month"] option:selected').val();
		var year_ = $('[name="file_year"] option:selected').text();
		
		 window.open( base_url + 'index.php/wysiwyg_c/printReports/' + month_ + '/' + year_, '_blank');
	    });
	});
	
}