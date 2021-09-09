# Code Bin
Easy to use and useful code paste bin using mongoose, ejs and node js!

### Setup

- `Clone the repository`

- ```json
   {
   "mongooseconnectionstring": "YOUR_MONGODB_URI"
   }
   ```
Go to `config.json` and enter the mongodb uri and a key of your wish for the admins to delete any bins using the del endpoint.
### Delete endpoint usage

- `https://yourdomain.com/del?name=bin_name(the_random_string)&auth=staffkey`
Done!
