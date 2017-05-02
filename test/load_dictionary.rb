require 'json'
require 'optparse'
require 'net/http'
require_relative 'anagram_client'

words = File.readlines('./test/dictionary.txt').each {|l| l.chomp!}

client = AnagramClient.new(ARGV)

client.post('/words.json', nil, {"words" => words })