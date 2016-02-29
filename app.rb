require 'sinatra'

get '/' do
	erb :index
end

['/about', '/contact', '/portfolio'].each do |path|
	get path do
		@current_path = path.delete('/')
		erb @current_path.to_sym
	end
end