import React,{useState} from 'react';
import {ApolloClient, InMemoryCache,ApolloProvider} from '@apollo/client'
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import EditContact from './components/EditContact';

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://wpe-hiring.tokopedia.net/graphql",
  })

  // List of contacts
  const [listOfContacts, setListOfContacts] = useState([]);
  const editContacts = (elem) => {
    setListOfContacts(elem)
  }

  // Edit page
  const [editPage, setEditPage] = useState(false);
  const showEditPage = () => {
    setEditPage(prev => {
      let result = !prev;
      return result;
    });
  }

  return (
    <ApolloProvider client={client}>
      <div className="container">
        <div className="row">

        </div>
        <div className="row">
          <ContactList 
            showEditPage={showEditPage} 
            show={!editPage} 
            editContacts={editContacts}
          />
          <EditContact/>
          <AddContact showEditPage={showEditPage} show={editPage}/>
        </div>
      </div>
  
    </ApolloProvider>

  ); 
}

export default App;
