require 'sinatra'
require 'pony'
require 'dotenv'
require 'aws/s3'

Dotenv.load

AWS::S3::Base.establish_connection!(
  :access_key_id => ENV['AWS_ACCESS_KEY_ID'],
  :secret_access_key => ENV['AWS_SECRET_ACCESS_KEY']
)

get '/' do
  redirect to('/portraits')
end

['/', '/contact', '/portraits', '/weddings'].each do |path|
	get path do
		@current_path = path.delete('/')
    bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
    images_dir = "http://s3.amazonaws.com/#{bucket.name}"
    if @current_path == 'portraits' || @current_path == 'weddings'
      logger.info params[:marker]
      @images = bucket.objects(:max_keys => 15, :prefix => "#{@current_path}/thumbnail_", :marker => "#{@current_path}/#{params[:marker]}").map{|x| File.join(images_dir, x.key)}
      request.xhr? ? (erb :images, :layout => false) : (erb :images_grid)
    elsif @current_path == 'contact'
      @image = File.join(images_dir, 'headshot.jpg')
      erb :contact
    end
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