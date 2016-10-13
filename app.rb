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

['/', '/contact', '/portraits', '/portraits/slideshow', '/weddings', '/weddings/slideshow'].each do |path|
	get path do
		@current_path = path
    bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
    bucket_url = "http://s3.amazonaws.com/#{bucket.name}"
    folder = @current_path.match(/portraits|weddings/).to_s
    if @current_path == '/portraits' || @current_path == '/weddings'
      @images = bucket.objects(:max_keys => 15, :prefix => "#{folder}/thumbnail_", :marker => "#{folder}/#{params[:marker]}").map{|img| File.join(bucket_url, img.key)}
      request.xhr? ? (erb :images, :layout => false) : (erb :images_grid)
    elsif @current_path == '/portraits/slideshow' || @current_path == '/weddings/slideshow'
      @current_image = params[:image]
      @images = bucket.objects(:prefix => "#{folder}/", :marker => "#{folder}/").reject{|img| img.key.include?('thumbnail') || img.key.include?(File.basename(params[:image]))}.map{|img| File.join(bucket_url, img.key)}
      erb :testing
    elsif @current_path == '/contact'
      @image = File.join(bucket_url, 'headshot.jpg')
      erb :contact
    end
	end
end

get '/testing' do
  erb :testing
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
    logger.info('success')
    erb :alert, :locals => {:notice => 'success'}, :layout => false
  rescue
    logger.info('failure')
    erb :alert, :locals => {:notice => 'failure'}, :layout => false
  end
end