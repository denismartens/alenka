require 'sinatra'
require 'pony'
require 'dotenv'

Dotenv.load

get '/' do
	erb :index
end

['/about', '/contact', '/portfolio'].each do |path|
	get path do
		@current_path = path.delete('/')
    @images_dir = "http://s3.amazonaws.com/#{ENV['AWS_BUCKET_NAME']}"
		erb @current_path.to_sym
	end
end

post '/contact' do 
  name = params[:name]
  sender_email = params[:email]
  message = params[:message]
  begin
    Pony.mail(
      :from => "#{name}<#{sender_email}>",
      :to => ENV['EMAIL'],
      :subject =>"#{name} says hello!",
      :body => "#{message}",
      :via => :smtp,
	    :via_options => { 
	      :address              => 'smtp.sendgrid.net', 
        :port                 => '587',  
	      :domain               => 'heroku.com',
        :user_name            => ENV['SENDGRID_USERNAME'], 
        :password             => ENV['SENDGRID_PASSWORD'], 
        :authentication       => :plain, 
        :enable_starttls_auto => true
	    }
    )
    erb :contact, :locals => {:notice => 'success'}
  rescue
    erb :contact, :locals => {:notice => 'failure'}
  end
end