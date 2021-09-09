const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
const shortid = require('shortid');
const rateLimit = require("express-rate-limit")
const config = require("./config.json")
var Filter = require('bad-words'),
    filter = new Filter();
const createAccountLimiter = rateLimit({
  windowMs: 10000,
  max: 2, 
  message:
    "You can only create 2 urls in 10 seconds!"
});

mongoose.connect(config.mongooseconnectionstring, {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()

  res.render('index', { shortUrls: shortUrls, code: "", showHeader: null, title: "Code Bin", description: "Store and Access your codes on the cloud" })
});
app.get("/del", async (req, res) => {
	const key = req.query.auth;
	const doc = await ShortUrl.findOne({ name: req.query.name })
	if(key === "aw2plm" && doc) {
		doc.delete()
		res.json({success:`Deleted ${doc.name}`})
	} else {
		res.json({error:"Not found or Unauthorized"})
	}
})

app.get("/list", async (req, res) => {
  const e = await ShortUrl.find()
  res.json({ data: e})
});


app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css")
});
app.get("/script.js", (req, res) => {
	res.sendFile(process.cwd() + "/script.js")
})

app.post('/create', createAccountLimiter, async (req, res) => {
	const existing = await ShortUrl.findOne({code:req.body.code})
	if(existing) return res.render("error", {link: existing.name})
	let tit = req.body.title;
	if(tit.length > 25) {
		tit = tit.slice(0, 50) + "..."
	}
  const d = await ShortUrl.create({name: shortid.generate(), code: filter.clean(req.body.code), title: filter.clean(tit), description: req.body.description })
	res.redirect(`/${d.name}`)
});


app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ name: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)
 
  shortUrl.clicks++
  shortUrl.save()
	
	const views = shortUrl.clicks === null ? 0 : shortUrl.clicks
  res.render("index", {code: shortUrl.code, showHeader: true, views: views, title: shortUrl.title ? shortUrl.title : "Code Bin", description: shortUrl.description ? shortUrl.description : "Store and Access your codes on the cloud" })
});

app.listen(5000);
