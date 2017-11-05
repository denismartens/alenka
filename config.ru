require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require_relative 'app.rb'

$stdout.sync = true

run Sinatra::Application