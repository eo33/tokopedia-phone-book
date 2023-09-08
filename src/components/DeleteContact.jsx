import {useState,useEffect} from 'react';
import Select from 'react-select';
import { useMutation, gql } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.css';
import "./stylesheet.css"

const DELETE_CONTACT_ID = gql`
mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }  
`;

function DeleteContact(props) {
  let {showDel, showDelPage} = props

  const [delContacts, setDelContacts] = useState([]);

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem('contacts'));
    if (localStorageData != null){
        const newDel = localStorageData;
        setDelContacts(newDel);
    }
    }, [showDel]);

  const [deleteUser] = useMutation(DELETE_CONTACT_ID);

  const handleDelete = (id) => {
    console.log('delete',id)
    // Delete in display
    let newContacts = delContacts.filter(e => e.id != id)
    setDelContacts(newContacts)
    // Delete in web api
    localStorage.setItem('contacts',JSON.stringify(newContacts))
    // Delete in graphQL
    deleteUser({variables: {id}})
  };

  return (
    <>{showDel?
        <div className='col-12 col-md-6 contact-list offset-md-3'>
            <div className="row mt-1">
                <h2 className="col display-4 d-flex align-items-center px-0 mt-2">
                    Delete
                </h2>
                <div className="col d-flex justify-content-end align-items-center mx-0 px-0 mt-3">
                    <button 
                        className='d-flex flex-column align-items-center button-style px-2'
                        onClick={showDelPage}
                    >
                        <i class="fa-solid fa-arrow-rotate-left fa-2x"></i>
                        <span>Back</span>
                    </button>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col search-bar d-flex align-items-center gap-2 search-bar-disabled disabled">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        aria-label="Search"
                        
                    />
                </div>      
            </div>
            {
                delContacts.map(contact=>(
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
                    {/*When user click on button set isFav to true for that ID*/}
                    <button 
                        className='button-style' 
                        type='button'
                        onClick={()=>handleDelete(contact.id)}
                    >
                        <i className="button-style fa-solid fa-trash fa-2x"></i>
                    </button>
                    </div>
                </div>
                ))
            }
        </div>:null}
    </>
  )
}
export default DeleteContact