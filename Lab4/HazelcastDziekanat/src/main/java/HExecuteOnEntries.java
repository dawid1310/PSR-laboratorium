import com.hazelcast.client.HazelcastClient;
import com.hazelcast.client.config.ClientConfig;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.map.EntryProcessor;
import com.hazelcast.map.IMap;

import java.io.Serializable;
import java.net.UnknownHostException;
import java.util.Map.Entry;

public class HExecuteOnEntries {

    public static void main( String[] args ) throws UnknownHostException {
        ClientConfig clientConfig = HConfig.getClientConfig();
		final HazelcastInstance client = HazelcastClient.newHazelcastClient(clientConfig);

		IMap<Long, Dziekanat> dziekanat = client.getMap("dziekanat");
		dziekanat.executeOnEntries(new HEntryProcessor());

		for (Entry<Long, Dziekanat> e : dziekanat.entrySet()) {
			System.out.println(e.getKey() + " => " + e.getValue());
		}
	}
}

class HEntryProcessor implements EntryProcessor<Long, Dziekanat, String>, Serializable {
	private static final long serialVersionUID = 1L;

	@Override
	public String process(Entry<Long, Dziekanat> e) {
		Dziekanat dziekanat = e.getValue();
		String name = dziekanat.getStudent();
		if (name.equals(name.toLowerCase())) {
			name = name.toUpperCase();
			dziekanat.setStudent(name);
		} else{
			name = name.toLowerCase();
			dziekanat.setStudent(name);
		}
		
		System.out.println("Processing = " + dziekanat);
		e.setValue(dziekanat);
		
		return name;
	}
}
