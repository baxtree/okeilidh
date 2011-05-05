var emitter = new EventEmitter();

var OKBuzzer = {
    connection : null,
    jid_to_id : function (jid) {
		return Strophe.getBareJidFromJid(jid).replace(/@/g, "-").replace(/\./g, "-");
	},
	resource : null,
	on_message : function (message) {
//		alert("message in");
	    var full_jid = $(message).attr('from');
	    var body = $(message).find("html > body");
	    if(body.length === 0){
	    	body = $(message).find("body");
	    	if(body.length > 0){
	    		body = body.text();
	    	}
	    	else{
	    		body = null;
	    	}
	    }
	    else{
	    	body = body.contents();
	    	var span = $("<span></span>");
	    	body.each(function(){
	    		if(document.importNode){
	    			$(document.importNode(this, true)).appendTo(span);
	    		}
	    		else{
	    			span.append(this.xml);
	    		}
	    	});
	    	body = span;
	    }
	    emitter.emit("gotMessageFromXMPPServer", {"from" : full_jid, "body" : body});
	    return true;
	}
};

$(document).ready(function () {
    $('#login_dialog').dialog({
        autoOpen: true,
        dragOKBuzzerle: false,
        modal: true,
        title: 'Connect to XMPP',
        buttons: {
            "Connect": function () {
                $(document).trigger('connect', {
                	server: $("#server").val(),
                    jid: $('#jid').val(),
                    password: $('#password').val()
                });
                
                $('#password').val('');
                $(this).dialog('close');
            }
        }
    });
    
    $("#disconnect").click(function(){
		OKBuzzer.connection.disconnect();
	});
});
    
$(document).bind('connect', function (ev, data) {
    var conn = new Strophe.Connection(data.server);

    conn.connect(data.jid, data.password, function (status) {
        if (status === Strophe.Status.CONNECTED) {
            $(document).trigger('connected');
        } else if (status === Strophe.Status.DISCONNECTED) {
            $(document).trigger('disconnected');
        }
    });
	
    OKBuzzer.connection = conn;
});
	
$(document).bind('connected', function () {
	OKBuzzer.connection.send($pres());
    OKBuzzer.connection.addHandler(OKBuzzer.on_message, null, "message", "chat");
    document.title = document.getElementById("jid").value;
    alert("XMPP server connected!");
});
	
$(document).bind('disconnected', function () {
	alert("XMPP server disconnected!");
	document.title = "WebLCC Runtime Environment";
    OKBuzzer.connection = null;
    $('#login_dialog').dialog('open');
});