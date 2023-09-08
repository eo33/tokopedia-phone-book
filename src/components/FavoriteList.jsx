import {useState, useEffect} from 'react';

function FavoriteList(props) {
    let {showFav, showFavPage} = props
    
    const [favContacts, setFavContacts] = useState([]);
  
    useEffect(() => {
        const localStorageData = JSON.parse(localStorage.getItem('contacts'));
        if (localStorageData != null){
            const newFav = localStorageData.filter((contact) => contact.isFav === true);
            setFavContacts(newFav);
        }
    }, [showFav]);
    
  return (
    <>
        { showFav?
        <div className='col-12 col-md-6 contact-list offset-md-3'>
            <div className="row mt-1">
                <h2 className="col display-3 d-flex align-items-center pb-0 mb-0">
                    Favorites
                </h2>
                <div className="col d-flex justify-content-end align-items-center">
                    <button className='d-flex flex-column align-items-center button-style ' onClick={showFavPage}>
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
            favContacts.map(contact=>(
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
                  >
                    <i className={`button-style fa-star fa-2x fa-solid`}></i>
                  </button>
                </div>
              </div>
            ))
          }
        </div>:null
        }
    </>
  )
}
export default FavoriteList