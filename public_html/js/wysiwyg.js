var req_id;

var SetReqId = function(request_id){
    req_id = request_id;
}

window.onload = function(){
    textArea_wysi();
};

function textArea_wysi(){
   // var base_url = 'http://localhost/dclle/public_html/'; /*****base url******/
    
    window.onbeforeunload = function(){
	$.getJSON(base_url + "index.php/wysiwyg_c/setEditable/"+ req_id);
	alert('Press ok to continue.');
    };
     
    /************************************************WYSIWYG*******************************************************************************************/
    tinymce.init({selector:'#wysi_textarea', // wysiwyg
	theme: "modern", 
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars", "table","noneditable"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
        toolbar2: "media",
	content_css: base_url + "css/wysiwyg_print.css"
    });
    
    $('#upload_cert').submit(function(){ // upload cert
	if($('[name="userfile"]').val() == ''){ // is empty
	    alert("No file submitted.");
	    return false;
	}
	
	else{
	    var parts = $('[name="userfile"]').val().split('.'); // check format
	    parts = parts[parts.length -1].toLowerCase();
	    switch(parts){
		case "pdf":
		    return true;
		    break;
		default:
		    alert("Invalid file format.");
		    return false;
	    }     
	}
	
	return true;
    });
    
    $('#wysi_pop').submit(function(e){ // check if title and content is empty
	
	if( $('[name="wysi_input"]').val() == '' || $('#wysi_textarea').val() == ''){
	    alert('Please fill in all the data fields');
	    return false;
	}
	
	return true;
    });
}