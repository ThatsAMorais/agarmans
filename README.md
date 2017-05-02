# agarmans #

agarmans is an API built on Node that serves anagrams. One anagram of "anagrams" is "Agar Mans", thus the name.

## design overview ##

Express.js, which is built on Node.js, provides the MVC architecture to the server. With it one can create a server with a couple lines of code; its super easy.

The application code itself consists of the server.js which creates the express application and defines various mappings of verbs and URLs to their corresponding service method.

These service methods are split into files by endpoint, such as anagrams.js and words.js, for clarity and proximity. They read from and write to MongoDB, which maps words to their anagrams as a persistent key-value store.

The approach is to insert the words provided to the `words` API into a key/value store according to the letters they contain, which gives us all of the single-word anagrams upon insertion. The `anagrams` API, given a word, pulls the word's sorted-letters key from the key-value store, filters it out, and returns this result.

I ran out of time to implement the recursion-based algorithm required to calculate multi-word anagrams in queries. See `future work` for how I would approach that.

### optional work ###

I implemented the following optional extensions to the service.

#### delete word + anagrams ####

Because of the way the data is organized this feature was easy; simply remove the document corresponding to the word's sorted letter string. This is demonstrated in the tests and the Postman collection

#### meta-data ####

In the hopes of facilitating more tracking of "counts", "max", "min", and other data about the anagram store

## quick start ##

The application is hosted on heroku at: https://agarmans.herokuapp.com/

And this Postman collection has all the API calls for this service: https://www.getpostman.com/collections/7a6eae3805b21386db43
The `{{agarmans}}` var maps to the heroku URL above if you use an environment. Feel free to simply replace that with the above URL

### docker ###
If you have docker installed, it should be possible to run the tests like:
```
ruby .\test\anagram_test.rb -- -n $DOCKER_IP
```
Or point the test client to `<YOUR_DOCKER_IP>` in a ruby shell

You can even use the Postman collection above, just replace `{{agarmans}}` with `<YOUR_DOCKER_IP>:3000`.

## technology ##
  
- Node.js / Express.js
- Ruby for testing
- MongoDB
- Visual Studio Code
- Docker
- Heroku

Node.js and JavaScript, with Express, are a popular and simple set of tools to use in the implementation of an API, so an easy choice for building a project like this. All are popular enough to facilitate much knowledge sharing from different developers to get it done quickly and painlessly. For example, [A](http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/), [B](https://medium.freecodecamp.com/building-a-simple-node-js-api-in-under-30-minutes-a07ea9e390d2), [C](https://closebrace.com/tutorials/2017-03-02/the-dead-simple-step-by-step-guide-for-front-end-developers-to-getting-up-and-running-with-nodejs-express-and-mongodb) to list a few...

Heroku was chosen for hosting the API because it has comprehensive documentation for Node.js. Even better, they've built sample projects and documented how to integrate backend storage, such as MongoDB or Redis, for many platforms. Furthermore, the costs are very low for a project like this. Although its fair to say if API traffic significantly increased that other PaaS hosts may provide lower rates in the long run.

I built a docker image of the service for easy test running, which are written in Ruby. Containerization saves developers' time and reduces the complexity of local development by not forcing developers to recreate the habitat of the application locally.

### trade-offs ###

- Redis might have been a good choice for the key-value store for a simple project. Using Redis in this way was even regarded as [fast](https://www.terlici.com/2015/06/15/redis-node-express.html "smart"). This is clearly for the fact that Redis is decent at [persistence](https://redis.io/topics/persistence "persistence"). Yet, MongoDB was a more recognizable solution.
- Could have written the API in Python and Flask because I have a background in Python. However, the only place where adopting it is helpful would be in writing the anagram backend logic. Whereas, everything else about the API is no more difficult than (or as much fun as) using Node.js.
- Heroku is of course not the only choice for hosting a Node.js service. Amazon, and Google App Engine all support it. All offer a free and painless solution for deploying Node applications. I had always wanted to dive deeper into Heroku so I chose it, but it is not clear what would be the cheapest solution.
- Express.js is currently the most popular web application framework, which is why it was chosen, but there is also Koa and Hapi. Koa touts being more enjoyable to write and having a smaller footprint. Hapi is obsessed with "configuration over code." The differences are subtle but I chose Express for the large user base to ensure access to helpful tutorials.

## anagram meta-data ##

This [site](http://www.manythings.org/anagrams/) provides great information about English language anagrams:  
- there are only around 651 common words which have one word anagrams, most only having 1, the highest number being 3-4.  
- There are, however, millions of proper nouns, and they are likely to account for hundreds, maybe thousands, of additional anagrams, depending on the language with which they are compared.  
- The longest single word anagrams are around 17, i.e. basiparachromatin = marsipobranchiata

## story ##

I set out to build this API using technology that was fitting for the task. Taking all of the requirements under consideration, I planned the endpoints with documentation. I felt it best to deploy this where it could be accessed without local installation so I chose a fitting cloud-based host. I also determined what technology, tools, and libraries would be needed to ensure the success of the service, and aid my development of it. Most of the contents of this document are the result of that process.

Then, I tested boilerplate capabilities of the technologies on which I would rely to prove their straight-forwardness and that I had arranged the necessary support. I started by installing Node.js, NPM, MongoDB, etc, stubbed the various endpoints I had documented into the Express.js service, ran the Node server locally, ran the tests locally for the first time, pushed the first Github PR, deployed the app into my Heroku pipeline, and even tested building a docker image of the service. None of it worked, but its much easier to debug behavior when staging and testing infrastructure is in place, so that is what I sought to achieve.

Finally, I had a clear path to implement the "anagrams" and "words" APIs. Visual Studio Code's native Node.js debug support came in handy.

The optional work I took on was limited by the time I had available to work on it, but I chose features that I thought would bring value to users.

## future work ##

### multi-word anagrams ###
Single word anagrams are fairly easy, especially since we get this for free by properly inserting the data into the right document hash. Finding multiple word anagrams for a set of letters requires walking through a tree of possible letter sets, the depth of which is equal to the length of the letter-set. For example "anagram" would be divided into [["a", "nagram"], ["an" "agram"], etc for every combination. If both sides of the branch produce a word (or word combination) then they are bubbled up to be paired with the "other" branch on the level above. Therefore, many sub-anagrams would be calculated. I would recommend divide and conquer via recursion, and store valid sub-anagrams directly into the lazy anagrams storage.

### proper-noun distinction ###
Any proper nouns would have to be declared in the POST /words.json body to be that, probably with a different json structure. Otherwise, they would have to be inferred from the use of capital letters. Proper nouns could also be stored as a separate list in the set of anagrams for a given word so that its trivial to exclude them when needed.

### metrics ###
Any live service should be monitored, so I would like to see metrics added to track the performance of the service, backend, the amount of traffic each endpoint receives. Alerts sent to my phone when the metrics are unhealthy are also useful so that I can ensure the service doesn't stay offline for long, if ever.

### abstracted MongoDB error handling ###
Rather than defining lambda callbacks with each interaction, it brings consistency to the API's responses to handle them as uniformly as possible. 

### improve POST /words.json ###
It is fine for small lists of words, but enormous lists of words take some time to process. The solutions range from using MongoDb's BulkOp to offloading to an external queue consumed by a microservice. However, the return on investment is low because rebuilding the entire corpus should not happen often (except in tests with smaller datasets).
