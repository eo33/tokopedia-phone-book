import react, {useState,useEffect} from 'react';
import { useQuery, gql } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.css';
import "./stylesheet.css"

const GET_CONTACT_LIST = gql`
  query GetContactList(
    $distinct_on: [contact_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [contact_order_by!]
    $where: contact_bool_exp
  ) {
    contact(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

function ContactList(props) {
  // Received props from parents
  let {showEditPage, show, editContacts} = props;

  // Set search bar functionality
  const [searchQuery, setSearchQuery] = useState("")  
  const updateQuery = (e) => {
    e.preventDefault()
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
  };

  // Initialize GraphQL query
  const { loading, error, data } = useQuery(GET_CONTACT_LIST,{
    variables: {
      "where": {
        first_name: {"_like": `%${searchQuery}%`}
      }
    }
  });
  
  // Store the first fetched data in local web API
  useEffect(() => {
    if (!localStorage.getItem('contacts') && !loading && !error && data) {
      localStorage.setItem('contacts', JSON.stringify(data.contact));
    }
  }, [data]);

  // Set pagination function
  const [currentPage, setCurrentPage] = useState(1);
  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  }
  const prevPage = () => {
    setCurrentPage(prev => prev - 1);
  }

  // Set favorite
  let isFavorite = 0;

  // If 'loading' return common elements
  if (loading) return (
    <div className='col-12 col-md-6 contact-list'>
      <div className="row mt-1">
        <h2 className="col display-4 d-flex align-items-center">
          Contacts
        </h2>
        <div className="col d-flex justify-content-end">
          <button className='d-flex flex-column align-items-center button-style'>
            <i className="fa-solid fa-plus display-5"></i>
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col search-bar d-flex align-items-center gap-2">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input 
            type="text" 
            placeholder="Search" 
            aria-label="Search"
            value={searchQuery}
            onChange={updateQuery}
          />
        </div>      
      </div>
    </div>
  );
  

  // If 'error' return errpr
  if (error) return <p>`Error! ${error.message}`</p>;
  //Data loaded, proceed with logic
  let contactData = data.contact.map(e => ({
    ...e,
    "isFavorite":false
    })
  )
  const contacts = data.contact.slice((currentPage-1)*10,currentPage*10);
  
  // Show edit page and send contact data to parent
  const updateData = () => {
    showEditPage();
    editContacts(contactData)
  }

  return(
    <>
      {show ?
        <div className='col-12 col-md-6 contact-list'>
          <div className="row mt-1">
            <h2 className="col display-4 d-flex align-items-center">
              Contacts
            </h2>
            <div className="col d-flex justify-content-end">
              <button className='d-flex flex-column align-items-center button-style' onClick={updateData}>
                <i className="fa-solid fa-plus display-5"></i>
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col search-bar d-flex align-items-center gap-2">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Search" 
                aria-label="Search"
                value={searchQuery}
                onChange={updateQuery}
              />
            </div>      
          </div>
          {/*Map over the data*/}
          {
            contacts.map(contact=>(
              <div className="row contact-list mt-4">
                <div className="col-2 col-lg-1">
                  {/*Profile picture*/}
                  <i class="fa-solid fa-user profile-pic p-2 fa-2x"></i>
                </div>
                <div className="col-8 mx-lg-2">
                  <div className="row full-name">
                    {/*First name + last name*/}
                    <div className="col">
                      {contact.first_name+' '+contact.last_name}
                    </div>
                  </div>
                  <div className="row phone-number">
                    {/*Phone number*/}
                    <div className="col">
                      {contact.phones[0] != undefined ? contact.phones[0].number : null}
                    </div>
                  </div>
                </div>

                <div className="col favorite d-flex justify-content-end align-items-center">
                  <i className={`button-style fa-star fa-2x fa-${isFavorite?'solid':'regular'}`}></i>
                </div>
              </div>
            ))
          }
          <div className="row d-flex justify-content-center align-items-center button-style mt-4">
            <div className="col-auto">
              <button onClick={prevPage} className={`button-style ${currentPage == 1 ? "button-disabled": ""}`}>
                <i className="fa-solid fa-chevron-left mx-0 px-0"></i>
              </button>
            </div>
            <div className="col-auto mx-0 px-0">{currentPage}</div>
            <div className="col-auto">
              <button onClick={nextPage} className={`button-style ${currentPage == Math.ceil(data.contact.length/10) ? "button-disabled": ""}`}>
                <i className="fa-solid fa-chevron-right mx-0 px-0"></i>
              </button>
            </div>
          </div>
        </div>
        : null
      }
    </>
  )
}
export default ContactList