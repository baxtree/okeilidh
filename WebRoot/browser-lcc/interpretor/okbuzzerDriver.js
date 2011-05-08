var html_output = new String();
		var error_output = new String();
		var	dfa_table;
		
		function _error( msg )
		{
			if( show_errors )
				error_output += "Error: " + msg + "\n";

			errors++;
		}
		
		function _warning( msg )
		{
			if( show_warnings )
				error_output += "Warning: " + msg + "\n";

			warnings++;
		}
		
		function _print( txt )
		{
			html_output += txt;
		}
		
		function check_editor_content()
		{
			if( document.source.code.value != "" )
				if( confirm( "Delete current editor content?" ) )
				{
					document.source.code.value = "";
					document.source.code.focus();
					document.getElementById("buildButton").setAttribute("disabled", "disabled");
					return true;
				}
				else{
					document.getElementById("buildButton").removeAttribute("disabled");
					return false;
				}
			return true;
		}
		
		function reset()
		{
			if( document.source.code.value != "" )
				if( confirm( "Delete current LCC?" ) )
				{
					document.getElementById("lcc_head").value = "";
					document.getElementById("lcc_body").value = "";
					resetLCCEnvironment();
					return true;
				}
				else{
					return false;
				}

			return true;
		}
		
		function load_grammar()
		{
			if( check_editor_content() )
			{
				document.source.code.value = grammars[ document.source.stored.value ];
				document.source.code.focus();
			}
		}
		
		function enlarge_content( container )
		{
			var closebutton = "<div style=\"width:100%; text-align: center;\"><input type=\"button\" onclick=\"hide_enlarged_content();\" width=\"100%\" value=\"Close\" /></div>";
			var pop_up = document.getElementById( "popupcontent" );
			pop_up.style.top = "100px";
			pop_up.style.left = "200px";
			pop_up.style.width = "800px";
			pop_up.style.height = "600px";
			
			pop_up.innerHTML = closebutton + "<hr />" +
				document.getElementById( container ).innerHTML +
					"<hr />" +  closebutton;

			pop_up.style.visibility = "visible";
		}
		
		function hide_enlarged_content()
		{
			var pop_up = document.getElementById("popupcontent");
			pop_up.style.visibility = "hidden";	
		}
		
		function build()
		{
			alert("Load the LCC interpretor.");
			var pure_code, out_code, i;
			
			html_output = new String();
			error_output = new String();
			reset_all( EXEC_WEB );
			
			
			var src = "";
			src = new String( document.getElementById("lcc_interpretor").value);
			parse_grammar( src ); //parse the .par file
			
			if( errors == 0 )
			{
				undef();
				unreachable();
				
				if( errors == 0 )
				{
					first();
					print_symbols();
					print_grammar( MODE_GEN_HTML );
					
					html_output += "<hr />";
					
					dfa_table = create_subset( nfa_states );
					dfa_table = minimize_dfa( dfa_table );

					lalr1_parse_table( true );
					
					errors = 0;
					if( errors == 0 )
						document.getElementById( "output" ).innerHTML = html_output + "<hr />" + print_parse_tables( MODE_GEN_HTML );
				}
			}

			if( errors > 0 || warnings > 0 && error_output != "" )
				alert( error_output );
			
//			if( errors == 0 ){}
		}
		
		function run_parser()
		{
			build();
//			document.getElementById("reset").style.display = "block";
			alert("Start running the IM.");
			var driver = new String( driver_t );
			var webdriver = new String( webdriver_t );

			if( !code_foot )
				code_foot = "var error_offsets = new Array(); var error_lookaheads = new Array(); var error_count = 0; var str = prompt( \"Please enter a string to be parsed:\", \"\" ); if( ( error_count = __parse( str, error_offsets, error_lookaheads ) ) > 0 ) { var errstr = new String(); for( var i = 0; i < error_count; i++ ) errstr += \"Parse error in line \" + ( str.substr( 0, error_offsets[i] ).match( /\\n/g ) ? str.substr( 0, error_offsets[i] ).match( /\\n/g ).length : 1 ) + \" near \\\"\" + str.substr( error_offsets[i] ) + \"\\\", expecting \\\"\" + error_lookaheads[i].join() + \"\\\"\\n\" ; alert( errstr );}";

			//driver is for output
			driver = driver.replace( /##PREFIX##/gi, "" );
			driver = driver.replace( /##HEADER##/gi, code_head );
			driver = driver.replace( /##TABLES##/gi, print_parse_tables( MODE_GEN_JS ) );
			driver = driver.replace( /##DFA##/gi, print_dfa_table( dfa_table ) );
			driver = driver.replace( /##TERMINAL_ACTIONS##/gi, print_term_actions() );
			driver = driver.replace( /##LABELS##/gi, print_symbol_labels() );
			driver = driver.replace( /##ACTIONS##/gi, print_actions() );
			driver = driver.replace( /##FOOTER##/gi, code_foot );
			driver = driver.replace( /##ERROR##/gi, get_error_symbol_id() );
			driver = driver.replace( /##EOF##/gi, get_eof_symbol_id() );
			driver = driver.replace( /##WHITESPACE##/gi, get_whitespace_symbol_id() );
			
			//webdriver is for execution and parse tree generator
			webdriver = webdriver.replace( /##PREFIX##/gi, "" );
			webdriver = webdriver.replace( /##HEADER##/gi, code_head );
			webdriver = webdriver.replace( /##TABLES##/gi, print_parse_tables( MODE_GEN_JS ) );
			webdriver = webdriver.replace( /##DFA##/gi, print_dfa_table( dfa_table ) );
			webdriver = webdriver.replace( /##TERMINAL_ACTIONS##/gi, print_term_actions() );
			webdriver = webdriver.replace( /##LABELS##/gi, print_symbol_labels() );
			webdriver = webdriver.replace( /##ACTIONS##/gi, print_actions() );
			webdriver = webdriver.replace( /##FOOTER##/gi, code_foot );
			webdriver = webdriver.replace( /##ERROR##/gi, get_error_symbol_id() );
			webdriver = webdriver.replace( /##EOF##/gi, get_eof_symbol_id() );
			webdriver = webdriver.replace( /##WHITESPACE##/gi, get_whitespace_symbol_id() );			
			//driver = webdriver;
			
			//output the code
//			document.getElementById( "lcc_interpretor" ).innerHTML = driver.replace( /\n/g, "<br />" ).replace( /\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;" );

			//run the webdriver
			eval( webdriver );
		}
		
