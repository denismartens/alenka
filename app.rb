require 'sinatra'
require 'pony'
require 'dotenv'
require 'aws/s3'
require 'mini_magick'

configure { set :server, :puma }

Dotenv.load

AWS::S3::Base.establish_connection!(
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
)

%w[/ /portraits /wedding].each do |path|
	get path do
		@current_path = path
    bucket = AWS::S3::Bucket.find(ENV['AWS_BUCKET_NAME'])
    bucket_url = "http://s3.amazonaws.com/#{bucket.name}"
    if @current_path == '/'
      @images = bucket.objects(max_keys: 10, prefix: 'landing/', marker: "landing/#{params[:marker]}").map{|img| File.join(bucket_url, img.key)}
      request.xhr? ? (erb :images, locals: {type: :carousel}, layout: false) : (erb :landing)
    # elsif @current_path == '/about'
    #   @images = bucket.objects(prefix: 'about/headshot').map{|img| File.join(bucket_url, img.key)}
    #   erb :about
    else
      folder = @current_path.match(/portraits|wedding/).to_s
      @images = bucket.objects(max_keys: 25, prefix: params[:marker] ? "#{folder}/" : "#{folder}/thumbnail_", marker: "#{folder}/#{params[:marker]}").map{|img| File.join(bucket_url, img.key)}
      request.xhr? ? (erb :images, locals: {type: params[:marker].start_with?('thumbnail_') ? :grid : :carousel}, layout: false) : (erb :images_grid)
    end
	end
end

get '/contact' do
  erb :contact
end

get '/pricing' do
  erb :pricing
end

get '/create-thumbnails/:path' do
  protected!
  status 202
  # request.env['HTTP_AUTHORIZATION'] = ""
  # @auth = nil
  if system("ruby create_thumbnails.rb -d #{params['path']} -r")
    erb :alert, locals: {notice: 'success', text: 'Thumbnails successfully created'}, layout: false
  else
    halt erb :alert, locals: {notice: 'failure', text: 'Something went wrong'}, layout: false
  end
end

post '/contact' do 
  name = params[:name]
  sender_email = params[:email]
  message = params[:message]
  begin
    Pony.mail(
      from: "#{name}<#{sender_email}>",
      to: ENV['EMAIL'],
      subject:"#{name} says hello!",
      body: "#{message}",
      via: :smtp,
      via_options: { 
        address: 'smtp.sendgrid.net', 
        port: '587',
        domain: 'heroku.com',
        user_name: ENV['SENDGRID_USERNAME'], 
        password: ENV['SENDGRID_PASSWORD'], 
        authentication: :plain, 
        enable_starttls_auto: true
	    }
    )
    logger.info('success')
    erb :alert, locals: {notice: 'success', text: 'Thank you, your message has been sent!'}, layout: false
  rescue
    logger.info('failure')
    erb :alert, locals: {notice: 'failure', text: 'Sorry, your message could not be sent.'}, layout: false
  end
end

def protected!
  return if authorized?
  headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
  halt 401, "Not authorized\n"
end

def authorized?
  @auth ||=  Rack::Auth::Basic::Request.new(request.env)
  @auth.provided? and @auth.basic? and @auth.credentials and @auth.credentials == [ENV['ADMIN_USER'], ENV['ADMIN_PASSWORD']]
end