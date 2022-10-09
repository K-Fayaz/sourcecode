const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

async function addContact(firstName,lastName, email, confNum) {
 const customFieldID = await getCustomFieldID('confir_number');
 const data = {
   "contacts": [{
     "email": email,
     "first_name": firstName,
     "last_name": lastName,
     "custom_fields": {}
   }]
 };
 data.contacts[0].custom_fields[customFieldID] = confNum;
 const request = {
   url: `/v3/marketing/contacts`,
   method: 'PUT',
   body: data
 }
 return sgClient.request(request);
}

async function getCustomFieldID(customFieldName) {
 const request = {
   url: `/v3/marketing/field_definitions`,
   method: 'GET',
 }
 const response = await sgClient.request(request);
 const allCustomFields = response[1].custom_fields;
 return allCustomFields.find(x => x.name === customFieldName).id;
}


async function getContactByEmail(email) {
 const data = {
   "emails": [email]
 };
 const request = {
   url: `/v3/marketing/contacts/search/emails`,
   method: 'POST',
   body: data
 }
 const response = await sgClient.request(request);
 if(response[1].result[email]) return response[1].result[email].contact;
 else return null;
}

async function getListID(listName) {
 const request = {
   url: `/v3/marketing/lists`,
   method: 'GET',
 }
 const response = await sgClient.request(request);
 const allLists = response[1].result;
 return allLists.find(x => x.name === listName).id;
}

async function addContactToList(email, listID) {
 const data = {
   "list_ids": [listID],
   "contacts": [{
     "email": email
   }]
 };
 const request = {
   url: `/v3/marketing/contacts`,
   method: 'PUT',
   body: data
 }
 return sgClient.request(request);
}

async function sendNewsletterToList(req,essentials,listID,id) {
   const data = {
     "query": `CONTAINS(list_ids, '${listID}')`
   };
   const request = {
     url: `/v3/marketing/contacts/search`,
     method: 'POST',
     body: data
   }
   const response = await sgClient.request(request);
   for (const subscriber of response[1].result) {
     const params = new URLSearchParams({
       conf_num: subscriber.custom_fields.confir_number,
       email: subscriber.email,
     });
     const unsubscribeURL = req.protocol + '://' + req.headers.host + '/delete/?' + params;
     let postURL = req.protocol + '://' + req.headers.host + '/read/blog' + id;
     const msg = {
       to: subscriber.email,
       from: process.env.SENDER_VERIFIED,
       subject: "Check out my New Blog post !",
       html: `
        <div style='background-color: white; width: 100% ; height: auto;'>
          <img src=${essentials.image} alt="Blog post Hero image"/>
          <h3>${essentials.title}</h3>
          <a style="display: block; background: #9A0648; padding: 10px 15px; color:white;
          text-decoration: none; width: 70px;" href=${essentials.url}>Read me</a>
          <br><br>
        </div>
       ` + `<a style="display: block;" href=${unsubscribeURL}>unsubscribe</a>`
     }
     sgMail.send(msg);
   }
}


async function deleteContactFromList(listID, contact) {
 const request = {
   url: `/v3/marketing/lists/${listID}/contacts`,
   method: 'DELETE',
   qs: {
     "contact_ids": contact.id
   }
 }
 await sgClient.request(request);
}


module.exports = {
  addContact,
  addContactToList,
  getListID,
  getContactByEmail,
  sendNewsletterToList,
  deleteContactFromList
}
