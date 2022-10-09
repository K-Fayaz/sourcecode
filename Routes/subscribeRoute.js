  require('dotenv').config();
  const express = require('express');
  const router = express.Router();
  const sgMail = require('@sendgrid/mail');
  const sgClient = require('@sendgrid/client');
  const {addContact,addContactToList,getListID,getContactByEmail,deleteContactFromList} = require("../helpers/subscribers.helper");

  // This code sets the API key for both of the SendGrid packages and
  // initializes the Express server with middleware.
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgClient.setApiKey(process.env.SENDGRID_API_KEY);

  // creating the new subscriber
  router.post('/user/emails/subscribe/news-letter',async (req,res)=>{
    try{
      let { email ,firstname , lastname } = req.body;
      const confNum = Math.floor(Math.random() * 90000) + 10000;
      console.log(confNum);
      const params = new URLSearchParams({
        conf_num: confNum,
        email,
      });

      const confirmationURL = req.protocol + '://' + req.headers.host + '/confirm/?' + params;

      const msg = {
       to: email,
       from: process.env.SENDER_VERIFIED,
       subject: `Confirm your subscription to our newsletter`,
       html: `Hello ${firstname},<br>Thank you for subscribing to our newsletter. Please complete and confirm your subscription by <a href="${confirmationURL}"> clicking here</a>.`
     }

     await addContact(firstname,lastname,email, confNum);
     await sgMail.send(msg);

      res.status(200).send('Fine');
    }
    catch(err){
      console.log(err);
      res.status(501).send("Something went wrong!");
    }
  })

  // confirm subscriber
  router.get('/confirm', async (req, res) => {
    try {
     const contact = await getContactByEmail(req.query.email);
     console.log(contact);
     // console.log(req.query);
     if(contact == null) throw `Contact not found.`;
     if (contact.custom_fields.confir_number ==  req.query.conf_num) {
       const listID = await getListID('sourceCode Newsletter Subscribers');
       await addContactToList(req.query.email, listID);
     } else {
       throw 'Confirmation number does not match';
     }
     res.render('message', { message: 'You are now subscribed to our newsletter. We can\'t wait for you to hear from us!' });
     } catch (error) {
       console.error(error);
       res.render('message', { message: 'Subscription was unsuccessful. Please <a href="/">try again.</a><br><p>Or try clicking the same link in the email inbox.</p>' });
     }
  });

  // handle unsubscribers
  router.get('/delete', async (req, res) => {
    try {
     const contact = await getContactByEmail(req.query.email);
     if(contact == null) throw `Contact not found.`;
     if (contact.custom_fields.confir_number ==  req.query.conf_num) {
       const listID = await getListID('sourceCode Newsletter Subscribers');
       await deleteContactFromList(listID, contact);
       res.render('message', { message: 'You have been successfully unsubscribed. If this was a mistake re-subscribe <a href="/">here</a>.' });
     }
    else throw 'Confirmation number does not match or contact is not subscribed'
    }
    catch(error) {
     console.error(error)
     res.render('message', { message: 'Email could not be unsubscribed. please try again.' })
    }
  });




module.exports = router;
