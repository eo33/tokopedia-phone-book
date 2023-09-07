import React, { useRef, useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const ADD_CONTACT = gql`
  mutation AddContactWithPhones(
    $first_name: String!,
    $last_name: String!,
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name,
        last_name: $last_name,
        phones: {
          data: $phones
        }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

function AddContact(props) {
  // Show or hide the page
  let { show, showEditPage } = props;

  // Variables to store form data
  const [contactName, setContactName] = useState({
    first_name: '',
    last_name: '',
  });

  const contactNameHandler = (e) => {
    const word = e.target.value
    const letterTyped = word[word.length-1]
    console.log(letterTyped)
    setContactName({ ...contactName, [e.target.name]: e.target.value });
  };

  // Seperate primary number and secondary number
  const [primaryNumber, setPrimaryNumber] = useState('');
  const [secondaryNumbers, setSecondaryNumbers] = useState([]);

  const primaryNumberHandler = (e) => {
    setPrimaryNumber(e.target.value);
  };

  const secondaryNumberHandler = () => {
    setSecondaryNumbers([...secondaryNumbers, '']);
  };

  const updateSecondaryNumber = (index, value) => {
    const updatedSecondaryNumbers = [...secondaryNumbers];
    updatedSecondaryNumbers[index] = value;
    setSecondaryNumbers(updatedSecondaryNumbers);
  };
  // Send mutation to add contact
  const [createUser] = useMutation(ADD_CONTACT);

  const handleSubmit = () => {
    const phones = [primaryNumber, ...secondaryNumbers];
    
    createUser({
      variables: {
        ...contactName,
        phones: phones.map((number) => ({ number })),
      },
    });
    showEditPage();
  };

  // Autoselect the name field effect
  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
    setSecondaryNumbers([])
  }, [show]);

  return (
    <>
      {show ? (
        <form className="col-md-8 add-contact d-flex flex-column offset-md-2" onSubmit={handleSubmit}>
          <div className="row mt-4">
            <div className="col-2 px-4">
              <button
                className="button-style large-text"
                type="button"
                onClick={showEditPage}
              >
                Cancel
              </button>
            </div>
            <div className="col d-flex flex-column align-items-center">
              <p>New contact</p>
              <i className="fa-solid fa-user profile-pic p-5 fa-6x"></i>
              <p>Add photo</p>
            </div>
            <p className="col-2 px-4 d-flex"></p>
          </div>

          <div className="row input-form p-2 m-3 px-4">
            <div className="col">
              <label className="mb-0 small-text" htmlFor="first-name">
                First name*
              </label>
              <input
                type="text"
                name="first_name"
                id="first-name"
                className="input-form x-large-text stretch-form"
                ref={textInputRef}
                onChange={contactNameHandler}
                required
              />
            </div>
          </div>

          <div className="row input-form p-2 m-3 px-4">
            <div className="col">
              <label className="mb-0 small-text" htmlFor="last-name">
                Last name*
              </label>
              <input
                type="text"
                name="last_name"
                id="last-name"
                className="input-form x-large-text stretch-form"
                onChange={contactNameHandler}
                required
              />
            </div>
          </div>

          

          <div className="row input-form p-2 m-3 px-4">
            <div className="col">
              <label className="mb-0 small-text" htmlFor="phone-number">
                Phone number*
              </label>
              <input
                type="tel"
                name="phones[number]"
                id="phone-number"
                className="input-form x-large-text stretch-form"
                onChange={primaryNumberHandler}
                required
              />
            </div>
          </div>

          {/* Secondary numbers */}
          {secondaryNumbers.map((number, index) => (
            <div className="row input-form p-2 m-3 px-4" key={index}>
              <div className="col">
                <label className="mb-0 small-text" htmlFor={`secondary-number-${index}`}>
                  Secondary Phone number {index + 1}*
                </label>
                <input
                  type="tel"
                  name={`secondary_phones[${index}]`}
                  id={`secondary-number-${index}`}
                  className="input-form x-large-text stretch-form"
                  onChange={(e) => updateSecondaryNumber(index, e.target.value)}
                  required
                />
              </div>
              <div className="col-1 d-flex align-items-center justify-content-center">
                <button className="button-style" type="button" onClick={() => setSecondaryNumbers((prev) => prev.filter((_, i) => i !== index))}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}

          <div className="row p-2 m-3 px-4">
            <div className="col">
              <button className="button-style" type="button" onClick={secondaryNumberHandler}>
                Add a new number
              </button>
            </div>
          </div>

          <div className="row px-4 mt-auto">
            <div className="col d-flex flex-column align-items-end justify-content-end">
              <button type="submit" className="button-style">
                <i className="fa-solid fa-paper-plane fa-2x"></i>
                <p>submit</p>
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </>
  );
}

export default AddContact;
