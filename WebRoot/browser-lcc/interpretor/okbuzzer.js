var emitter = new EventEmitter();
var offline_msg = undefined;
var triggered = false;
var xmpp_resource = undefined;
var finished = false;

var OKBuzzer = {
    connection : null,
    jid_to_id : function (jid) {
		return Strophe.getBareJidFromJid(jid).replace(/@/g, "-").replace(/\./g, "-");
	},
	resource : null,
	on_message : function (message) {
//		alert("message in");
	    var full_jid = $(message).attr("from");
	    var to_jid = $(message).attr("to");
	    var body = $(message).find("html > body");
	    if(Strophe.getResourceFromJid(to_jid) == xmpp_resource){
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
//		    alert("triggered " + triggered);
		    if(triggered){
//		    	alert("get new message");
		    	emitter.emit("gotMessageFromXMPPServer", {"from" : full_jid, "to" : to_jid, "body" : body});
		    }
		    else{
//		    	alert("got an offline message");
		    	offline_msg = {"from" : full_jid, "to" : to_jid, "body" : body};
		    }
	    }
	    return true;
	}
};

$(document).ready(function (){
	$("#login_dialog").dialog({
        autoOpen: false,
        dragOKBuzzerle: false,
        modal: true,
        title: "Connect to XMPP",
        resizable: false,
        buttons: {
            "Connect": function () {
                $(document).trigger("connect", {
                	server: $("#server").val(),
                    jid: $("#jid").val(),
                    password: $("#password").val()
                });
                
                $("#password").val("");
                $("#loading").show();
//              $(this).dialog("close");
            }
        }
    });
    
    $("#login_dialog").keyup(function(e){
    	if(e.keyCode == 13)
    		$("#login_dialog :button").click(); //this does not work
    });
    
    $("#disconnect").click(function(){
		OKBuzzer.connection.disconnect();
	});
});

function peerLogin() {
	if(OKBuzzer.connection == null)
		$("#login_dialog").dialog("open");
}
    
$(document).bind("connect", function (ev, data) {
    var conn = new Strophe.Connection(data.server);

    conn.connect(data.jid, data.password, function (status) {
        if (status === Strophe.Status.CONNECTED) {
            $(document).trigger("connected");
        } else if (status === Strophe.Status.DISCONNECTED) {
            $(document).trigger("disconnected");
        }
        else if(status === Strophe.Status.CONNFAIL){
        	alert("Can not connected to the XMPP Server. \n\r Please check its availability.");
        	$("#loading").hide();
        	$("#login_dialog").dialog("open");
        }
        else if(status === Strophe.Status.AUTHFAIL){
        	alert("Can not log on as this user. \n\r Please check your JID and password.");
        	$("#loading").hide();
        	$("#login_dialog").dialog("open");
        }
        else if(status === Strophe.Status.ERROR){
        	alert("An error occured! Please try again.");
        	$("#loading").hide();
        	$("#login_dialog").dialog("open");
        	
        }
    });
	
    OKBuzzer.connection = conn;
});
	
$(document).bind("connected", function () {
    $("#loading").hide();
    $("#login_dialog").dialog("close");
    OKBuzzer.connection.addHandler(OKBuzzer.on_message, null, "message", "chat");
    OKBuzzer.connection.send($pres().c("status").t("Available").up().c("priority").t("1"));
    OKBuzzer.resource = Strophe.getResourceFromJid($("#jid").val());
    xmpp_resource = OKBuzzer.resource;
    document.title = document.getElementById("jid").value;
//  alert("XMPP server connected!");
});
	
$(document).bind("disconnected", function () {
	alert("XMPP server disconnected!");
	document.title = "WebLCC Runtime Environment";
    OKBuzzer.connection = null;
    $("#loading").hide();
    $("#login_dialog").dialog("open");
});