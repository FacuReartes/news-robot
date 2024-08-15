Libraries used: axios (fetches data), fs (text file manager), nodemailer (mail sender).

APIs used: first news API "Mediastack.com", second news API "Newsdata.io"

The script does two GET to the news API and structures the data based on the same class then verifies that the data is not duplicated. 
This is done via the text file, it saves the titles of the already sent news and uses them to compare them with the new data.
Finally sends mails with the processed data.