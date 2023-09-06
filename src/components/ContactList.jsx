import react, {useState} from 'react';
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
/*
    const { loading, error, data } = useQuery(GET_CONTACT_LIST,{
        variables: {
            "where":  {
                "first_name": {"_like": "%John%" }
            }
        }
    });
*/

function ContactList() {
  const { loading, error, data } = useQuery(GET_CONTACT_LIST);
  
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  }

  const prevPage = () => {
    setCurrentPage(prev => prev - 1);
  }

  let isFavorite = 0;

  if (loading) return <p>'Loading...'</p>;
  if (error) return <p>`Error! ${error.message}`</p>;
  // Data is loaded
  // add favorite for each data contact
  let contactData = data.contact.map(e => ({
    ...e,
    "isFavorite":false
    })
  )
  
  const contacts = data.contact.slice((currentPage-1)*10,currentPage*10);

  return(
    <div className='col-12 col-md-6'>
      <div className="row mt-1">
        <h2 className="col display-4 d-flex align-items-center">
          Contacts
        </h2>
        <div className="col d-flex justify-content-end">
          <a className='d-flex flex-column align-items-center button-style' href="/">
            <i className="fa-solid fa-plus display-5"></i>
            <span>Add</span>
          </a>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col search-bar d-flex align-items-center gap-2">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search" aria-label="Search"/>
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
                  {contact.phones[0].number}
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
  )
  /*
  return (
    <div>
        <h2>Contact List</h2>
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <p>Name: {contact.first_name} {contact.last_name}</p>
              <p>Phone Number: {contact.phones[0].number}</p>
            </li>
          ))}
        </ul>
    </div>  
  )
    {/*Map over the data}
    <div className="row contact-list mt-4">
    <div className="col-2 col-lg-1">
      {/*Profile picture*}
      <i class="fa-solid fa-user profile-pic p-2 fa-2x"></i>
    </div>
    <div className="col-8">
      <div className="row full-name">
        {/*First name + last name*}
        <div className="col">
          {contacts[0].first_name+' '+contacts[0].last_name}
        </div>
      </div>
      <div className="row phone-number">
        {/*Phone number/}
        <div className="col">
          {contacts[0].phones[0].number}
        </div>
      </div>
    </div>
  
    <div className="col favorite d-flex justify-content-end align-items-center">
      <i className={`button-style fa-star fa-2x fa-${isFavorite?'solid':'regular'}`}></i>
    </div>
  </div>
  */

}
export default ContactList