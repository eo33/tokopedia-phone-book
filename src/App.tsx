import React from 'react';
import {ApolloClient, InMemoryCache,ApolloProvider} from '@apollo/client'
import ContactList from './components/ContactList';

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://wpe-hiring.tokopedia.net/graphql",
  })

  return (
    <ApolloProvider client={client}>
      <div className="container">
        <div className="row">

        </div>
        <div className="row">
          <ContactList/>
          <div className="col">
            de
          </div>
        </div>
      </div>
  
    </ApolloProvider>

  ); 
}

export default App;
