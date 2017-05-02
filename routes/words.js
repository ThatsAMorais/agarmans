var utils = require('./utils')

/*
 * Iterate over the set of words from the body of the request,
 * adding each one to the key corresponding to its letters.
 * 
 * A given words letters are lowercased and sorted to form the
 * key which it shares with its anagrams.
 * 
 * This process of building the hash helps (but does not 
 * complete) the calculation of all anagrams of a word.
 * The other part is when the letters of a word consist of
 * multiple smaller words, which must be calculated based
 * on the corpus.
 */
exports.add = function(req, res) {
    if (!req.body) return res.status(400).send('No json body in request')

    var words = req.body.words,
        wordsLength = words.length,
        wordsAdded = wordsLength,
        collection = db.collection('anagrams')
        
    for(var i=0; i < wordsLength; i++) {        
        var newWord = words[i]
        collection.updateOne(
            {key: utils.getWordKey(newWord)},
            {$push: {words: newWord}},
            {upsert: true},
            function(err, result) {
                if(err) {
                    console.log(err.message)
                    wordsAdded--
                }
            })
    }
    res.sendStatus(201)
}

/*
 * Delete a single word from the corpus
 */
exports.deleteWord = function(req, res) {
    var word = req.params.word
    db.collection('anagrams').findAndModify(
        {key: utils.getWordKey(word)},  // query
        [],                             // sort
        {$pop: {words: word}},          // update
        {new: true,},                   // options
        function(err, result) {
            if(err) {
                console.log(err)
                res.status(500).send('Failed to delete the word: ' + word)
            }
            else {
                if(result.value == null || result.value.words.length == 0) {
                    db.collection('anagrams').remove({_id: result._id})
                }
                res.sendStatus(200)
            }
        })
}

/*
 * Delete all of the words
 */
exports.deleteCorpus = function(req, res) {
    db.collection('anagrams').remove({},
     function(err, result) {
         res.sendStatus(204)
     })
}


