import org.mortbay.jetty.Handler;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.handler.DefaultHandler;
import org.mortbay.jetty.handler.HandlerList;
import org.mortbay.jetty.handler.ResourceHandler;
import org.mortbay.jetty.nio.SelectChannelConnector;


public class StartServletContainer {
	
	public static int PORT = 9999;
	
	public static void main(String[] args) {
		
		try{
			Server server = new Server();
	        SelectChannelConnector connector = new SelectChannelConnector();
	        connector.setPort(PORT);
	        server.addConnector(connector);
	 
	        ResourceHandler resource_handler = new ResourceHandler();
	        resource_handler.setWelcomeFiles(new String[]{ "index.html" });
	        resource_handler.setResourceBase(".");
	 
	        HandlerList handlers = new HandlerList();
	        handlers.setHandlers(new Handler[] { resource_handler, new DefaultHandler() });
	        server.setHandler(handlers);
	 
	        server.start();
	        server.join();
			System.out.println("OKeilidh started, please go to http://127.0.0.1:" + PORT + "/");
		} catch (final Exception e) {
			e.printStackTrace();
		}
	}

}
