require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require './app'

$stdout.sync = true

run Sinatra::Application