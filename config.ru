require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require_relative 'app.rb'
require 'sprockets'

$stdout.sync = true

map '/assets' do
  environment = Sprockets::Environment.new
  environment.append_path 'assets/css'
  environment.append_path 'assets/javascript'
  run environment
end

map '/' do
	run Sinatra::Application
end