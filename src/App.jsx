import {useState} from 'react';
import {ApolloClient, InMemoryCache,ApolloProvider} from '@apollo/client'
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import FavoriteList from './components/FavoriteList';
import DeleteContact from './components/DeleteContact';

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://wpe-hiring.tokopedia.net/graphql",
  })


  // Edit page
  const [editPage, setEditPage] = useState(false);
  const showEditPage = () => {
    setEditPage(prev => {
      let result = !prev;
      return result;
    });
  }

  //Fav page
  const [favPage, setFavPage] = useState(false);
  const showFavPage = () => {
    setFavPage(prev => {
      let result = !prev;
      return result;
    });
  }

  // Delete page 
  const [delPage, setDelPage] = useState(false);
  const showDelPage = () => {
    setDelPage(prev => {
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
            showEdit={!editPage} 

            showFavPage={showFavPage} 
            showFav={!favPage} 

            showDelPage={showDelPage} 
            showDel={!delPage} 
          />
          
          <FavoriteList showFavPage={showFavPage} showFav={favPage}/>
          <AddContact showEditPage={showEditPage} showEdit={editPage}/>
          <DeleteContact showDelPage={showDelPage} showDel={delPage}/>
        </div>
      </div>
      
  
    </ApolloProvider>

  ); 
}

export default App;
